import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoRequestData {
  name: string;
  email: string;
  organizationType: string;
  message: string;
}

// HTML entity encoding to prevent XSS
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// Input validation
function validateInput(data: DemoRequestData): { valid: boolean; error?: string } {
  // Check required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'Navn er påkrevd' };
  }
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    return { valid: false, error: 'E-post er påkrevd' };
  }
  if (!data.organizationType || typeof data.organizationType !== 'string') {
    return { valid: false, error: 'Organisasjonstype er påkrevd' };
  }

  // Check length limits
  if (data.name.length > 100) {
    return { valid: false, error: 'Navn kan ikke være lengre enn 100 tegn' };
  }
  if (data.email.length > 255) {
    return { valid: false, error: 'E-post kan ikke være lengre enn 255 tegn' };
  }
  if (data.organizationType.length > 100) {
    return { valid: false, error: 'Organisasjonstype kan ikke være lengre enn 100 tegn' };
  }
  if (data.message && data.message.length > 2000) {
    return { valid: false, error: 'Melding kan ikke være lengre enn 2000 tegn' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Ugyldig e-postadresse' };
  }

  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input
    const validation = validateInput(rawData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, organizationType, message }: DemoRequestData = rawData;

    // Sanitize inputs by trimming and escaping HTML
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeOrganizationType = escapeHtml(organizationType.trim());
    const safeMessage = message ? escapeHtml(message.trim()) : "Ingen melding";

    console.log("Received demo request:", { name: safeName, email: safeEmail, organizationType: safeOrganizationType });

    // Send notification email to info@xala.no
    const emailResponse = await resend.emails.send({
      from: "Digilist <onboarding@resend.dev>",
      to: ["info@xala.no"],
      subject: `Ny demo-forespørsel fra ${safeName}`,
      html: `
        <h1>Ny demo-forespørsel</h1>
        <p><strong>Navn:</strong> ${safeName}</p>
        <p><strong>E-post:</strong> ${safeEmail}</p>
        <p><strong>Organisasjonstype:</strong> ${safeOrganizationType}</p>
        <p><strong>Melding:</strong> ${safeMessage}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-demo-request function:", error);
    return new Response(
      JSON.stringify({ error: "En feil oppstod. Vennligst prøv igjen senere." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
