import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Building2, MessageSquare, CheckCircle, Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BookDemo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    roles: [] as string[],
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const roleOptions = [
    { id: "administrator", label: "Administrator" },
    { id: "saksbehandler", label: "Saksbehandler" },
    { id: "bruker", label: "Bruker" },
    { id: "organisasjonsbruker", label: "Organisasjonsbruker" },
  ];

  const handleRoleChange = (roleId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, roleId]
        : prev.roles.filter(r => r !== roleId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-demo-request', {
        body: {
          name: formData.name,
          email: formData.email,
          organizationType: formData.organization,
          message: `Ønsket rolle(r): ${formData.roles.join(", ")}\n\n${formData.comment}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Demo-forespørsel sendt!",
        description: "Vi tar kontakt med deg snart for å avtale en demo.",
      });

      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          organization: "",
          roles: [],
          comment: "",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <Navbar />
      
      {/* Hero Section with Form */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 via-success/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-accent/15 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px' 
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Side - Branding & Benefits */}
            <div className="space-y-8">
              {/* Logo and Title */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src="/logo.svg" 
                    alt="Digilist" 
                    className="h-16 w-auto"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-3xl font-bold text-foreground tracking-tight">
                      DIGILIST
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      ENKEL BOOKING
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                  Be om tilgang til <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">DigiList-demo</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  DigiList tilbyr en fullverdig demonstrasjon av bookingløsningen som benyttes i kommunal drift. 
                  For å sikre korrekt oppsett og riktige roller ber vi om at du registrerer kontaktinformasjon nedenfor.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Komplett plattform</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Booking, betaling, kalender og rapportering i én løsning
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Zap className="w-7 h-7 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Automatisering</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Regelbasert godkjenning reduserer manuelt arbeid med 60%+
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">GDPR-klar & Sikker</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Full etterlevelse av personvernregler og norske standarder
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="relative">
              <div className="bg-card/95 backdrop-blur-xl border-2 border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl">
                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/30">
                      <CheckCircle className="w-12 h-12 text-success" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Takk for din interesse!</h2>
                    <p className="text-lg text-muted-foreground">Vi sender deg tilgangsinformasjon snart.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Fullt navn *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Ola Nordmann"
                          className="pl-11 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        E-postadresse *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="ola.nordmann@kommune.no"
                          className="pl-11 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Organisasjon *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          placeholder="Skien kommune"
                          className="pl-11 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    {/* Desired Role */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-3">
                        Ønsket rolle *
                      </label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Velg én eller flere roller du ønsker tilgang til
                      </p>
                      <div className="space-y-3">
                        {roleOptions.map((role) => (
                          <div key={role.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={role.id}
                              checked={formData.roles.includes(role.id)}
                              onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                              className="w-5 h-5"
                            />
                            <label
                              htmlFor={role.id}
                              className="text-base font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {role.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Kommentar (valgfritt)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                        <Textarea
                          name="comment"
                          value={formData.comment}
                          onChange={(e) => setFormData({...formData, comment: e.target.value})}
                          placeholder="Eventuelle tilleggsopplysninger..."
                          className="pl-11 min-h-[120px] resize-none text-base"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full h-14 text-base group shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
                      disabled={isSubmitting || formData.roles.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sender forespørsel...
                        </>
                      ) : (
                        <>
                          Be om demo-tilgang
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
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

      <Footer />
    </div>
  );
};

export default BookDemo;
