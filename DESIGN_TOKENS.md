# Design Tokens Documentation

This document outlines all design tokens used in the Digilist booking system.

## Color Tokens

All colors are defined using HSL values in CSS custom properties:

- `--background`: Main background color
- `--foreground`: Main text color
- `--primary`: Primary brand color (teal/cyan)
- `--secondary`: Secondary background color
- `--muted`: Muted text and backgrounds
- `--accent`: Accent color
- `--border`: Border color
- `--card`: Card background color
- `--destructive`: Error/destructive actions

## Spacing Tokens

- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)
- `--spacing-3xl`: 4rem (64px)
- `--spacing-4xl`: 6rem (96px)

## Sizing Tokens

- `--size-orb-large`: 24rem (384px) - Large decorative orbs
- `--size-orb-medium`: 16rem (256px) - Medium decorative orbs
- `--size-orb-small`: 12rem (192px) - Small decorative orbs
- `--size-blur-large`: 3rem (48px) - Large blur effect
- `--size-blur-medium`: 2rem (32px) - Medium blur effect
- `--size-blur-small`: 1rem (16px) - Small blur effect

## Animation Tokens

### Delays
- `--animation-delay-fast`: 0.1s
- `--animation-delay-normal`: 0.2s
- `--animation-delay-slow`: 0.4s
- `--animation-delay-slower`: 0.6s
- `--animation-delay-slowest`: 3s

### Durations
- `--animation-duration-fast`: 0.2s
- `--animation-duration-normal`: 0.3s
- `--animation-duration-slow`: 0.6s
- `--animation-duration-slower`: 0.8s

## Gradient Tokens

- `--gradient-primary`: Primary brand gradient
- `--gradient-dark`: Dark theme gradient
- `--gradient-card`: Card background gradient
- `--gradient-hero-overlay`: Hero section overlay gradient

## Shadow Tokens

- `--shadow-glow`: Glowing shadow effect
- `--shadow-card`: Card shadow
- `--shadow-primary-glow`: Primary color glow shadow

## Opacity Tokens

- `--opacity-primary-light`: 0.1
- `--opacity-primary-medium`: 0.3
- `--opacity-primary-strong`: 0.5
- `--opacity-border-light`: 0.3
- `--opacity-border-medium`: 0.5
- `--opacity-overlay`: 0.95

## Usage

### In CSS
```css
.my-element {
  padding: var(--spacing-md);
  background: var(--gradient-primary);
  animation-delay: var(--animation-delay-normal);
}
```

### In Tailwind Classes
```tsx
<div className="orb-large blur-large delay-normal">
  {/* Uses design tokens */}
</div>
```

### Utility Classes Available
- `.orb-large`, `.orb-medium`, `.orb-small` - Orb sizing
- `.blur-large`, `.blur-medium`, `.blur-small` - Blur effects
- `.delay-fast`, `.delay-normal`, `.delay-slow`, `.delay-slower`, `.delay-slowest` - Animation delays

## Best Practices

1. **Always use tokens** instead of hardcoded values
2. **Use Tailwind utilities** when available (e.g., `bg-primary`, `text-foreground`)
3. **Use CSS custom properties** for dynamic or complex values
4. **Avoid inline styles** except for truly dynamic values (e.g., background images from imports)
5. **Extend tokens** in `tailwind.config.ts` when needed for Tailwind integration

