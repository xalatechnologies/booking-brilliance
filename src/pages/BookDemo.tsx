import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Calendar, Clock, Mail, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BookDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Demo forespørsel sendt!",
      description: "Vi tar kontakt med deg snart for å avtale en demo.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      organizationType: "",
      message: "",
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Book gratis demo
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vil du se Digilist i praksis før du bestemmer deg? Vi tar en kostnadsfri demo og viser deg funksjonene, arbeidsflyten og hva du faktisk får
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Navn *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ola Nordmann"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-post *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ola@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                {/* Organization Type */}
                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organisasjonstype *</Label>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) => handleChange("organizationType", value)}
                    required
                  >
                    <SelectTrigger id="organizationType">
                      <SelectValue placeholder="Velg organisasjonstype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kommune">Kommune</SelectItem>
                      <SelectItem value="kulturhus">Kulturhus</SelectItem>
                      <SelectItem value="idrett-skole">Idrett/Skole</SelectItem>
                      <SelectItem value="bedrift">Bedrift</SelectItem>
                      <SelectItem value="annet">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Melding (valgfritt)</Label>
                  <Textarea
                    id="message"
                    placeholder="Fortell oss litt om dine behov eller spørsmål..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sender..." : "Book demo"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg border bg-card">
              <Clock className="w-8 h-4 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">30 minutter</h3>
              <p className="text-sm text-muted-foreground">
                Demo varer ca. 30 minutter
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Calendar className="w-8 h-4 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Etter avtale</h3>
              <p className="text-sm text-muted-foreground">
                Vi tilpasser tiden etter ditt behov
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Mail className="w-8 h-4 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">24 timer</h3>
              <p className="text-sm text-muted-foreground">
                Vi svarer innen 24 timer
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDemo;

