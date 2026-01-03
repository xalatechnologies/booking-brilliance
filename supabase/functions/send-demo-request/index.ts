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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organizationType, message }: DemoRequestData = await req.json();

    console.log("Received demo request:", { name, email, organizationType, message });

    // Send notification email to info@xala.no
    const emailResponse = await resend.emails.send({
      from: "Digilist <onboarding@resend.dev>",
      to: ["info@xala.no"],
      subject: `Ny demo-forespørsel fra ${name}`,
      html: `
        <h1>Ny demo-forespørsel</h1>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Organisasjonstype:</strong> ${organizationType}</p>
        <p><strong>Melding:</strong> ${message || "Ingen melding"}</p>
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
