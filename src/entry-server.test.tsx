import { afterEach, describe, expect, it, vi } from "vitest";
import * as React from "react";

// entry-server.tsx always renders "./App" (AppShell), so we mock it with a
// controllable React.lazy boundary to exercise the retry loop the same way
// a real lazy route (e.g. BlogPost) would during prerender, without pulling
// in the full app tree.
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.resetModules();
  vi.doUnmock("./App");
});

describe("SSR prerender retry loop (src/entry-server.tsx)", () => {
  it("retries past a still-pending lazy boundary and returns the real content", async () => {
    let resolveImport: (mod: { default: React.ComponentType }) => void;
    const importPromise = new Promise<{ default: React.ComponentType }>((resolve) => {
      resolveImport = resolve;
    });
    const Lazy = React.lazy(() => importPromise);

    vi.doMock("./App", () => ({
      AppShell: () => (
        <React.Suspense fallback={<div>Laster…</div>}>
          <Lazy />
        </React.Suspense>
      ),
    }));

    const { render } = await import("./entry-server");
    const pending = render("/some-route");

    // Give the first renderToString() pass time to hit the fallback before
    // the lazy import resolves, so the loop actually has to retry.
    await new Promise((resolve) => setTimeout(resolve, 30));
    resolveImport!({ default: () => <h1>Ekte innhold</h1> });

    const html = await pending;
    expect(html).toContain("Ekte innhold");
    expect(html).not.toContain("<!--$!-->");
  });

  it("fails loud instead of shipping the loading shell when a boundary never resolves", async () => {
    vi.useFakeTimers();
    const Lazy = React.lazy(() => new Promise<{ default: React.ComponentType }>(() => {}));

    vi.doMock("./App", () => ({
      AppShell: () => (
        <React.Suspense fallback={<div>Laster…</div>}>
          <Lazy />
        </React.Suspense>
      ),
    }));

    const { render } = await import("./entry-server");
    const pending = render("/stuck-route");
    const assertion = expect(pending).rejects.toThrow(/did not resolve/);
    await vi.advanceTimersByTimeAsync(6000);
    await assertion;
  });
});
