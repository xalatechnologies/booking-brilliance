import { useState } from "react";
import { ArrowRight, User, Mail, Phone, Building2, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organizationType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the Supabase edge function to send email
      const { data, error } = await supabase.functions.invoke('send-demo-request', {
        body: {
          name: formData.name,
          email: formData.email,
          organizationType: formData.organizationType || formData.phone || "Ikke oppgitt",
          message: formData.message || `Telefon: ${formData.phone || 'Ikke oppgitt'}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Demo forespørsel sendt!",
        description: "Vi tar kontakt med deg snart for å avtale en demo.",
      });

      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          organizationType: "",
          message: "",
        });
      }, 3000);
    } catch (error: any) {
      console.error("Error sending demo request:", error);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke sende forespørselen. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="kontakt" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden section-border">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 via-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-blue-500/15 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-full blur-3xl"></div>
        
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* Diagonal stripes */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px)',
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div>
            <h2 className="section-heading mb-6">
              Book en gratis demo
            </h2>
            
            <p className="section-subheading mb-8">
              Se hvordan Digilist kan forenkle booking og administrasjon for din kommune.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-lg">Personlig gjennomgang</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">30-45 minutters live demo tilpasset deres behov</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-lg">Ingen forpliktelser</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Gratis demo uten binding eller salgsprat</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-lg">Rask respons</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Vi kontakter deg innen 24 timer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative">
            <div className="bg-card/90 backdrop-blur-xl border-2 border-border/50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-primary/50 transition-all duration-300">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Takk for din interesse!</h3>
                  <p className="text-muted-foreground text-lg">Vi kontakter deg snart.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Navn *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ditt fulle navn"
                        className="pl-11 h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      E-post *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="din@epost.no"
                        className="pl-11 h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Telefon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+47 123 45 678"
                          className="pl-11 h-12 text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Organisasjon
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="Kommune/Org"
                          className="pl-11 h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Melding (valgfritt)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Fortell oss om deres behov..."
                        className="pl-11 min-h-[100px] resize-none text-base"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full h-14 text-base group shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sender...
                      </>
                    ) : (
                      <>
                        Send forespørsel
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Ved å sende inn dette skjemaet godtar du vår{" "}
                    <a href="/personvern" className="text-primary hover:underline font-medium">personvernerklæring</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
