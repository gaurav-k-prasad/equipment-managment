
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Contact form submitted:", data);
    // Placeholder for actual submission logic
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    form.reset();
  };

  return (
    <PageContainer title="Contact Us" className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><Send className="w-6 h-6 mr-2 text-primary"/> Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl><Input placeholder="Question about..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl><Textarea placeholder="Your message..." rows={5} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-headline font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                You can also reach us through the following channels.
              </p>
              <div className="space-y-4">
                <ContactInfoItem icon={<Mail className="w-5 h-5 text-primary"/>} label="Email" value="support@equiptrack.example.com" href="mailto:support@equiptrack.example.com"/>
                <ContactInfoItem icon={<Phone className="w-5 h-5 text-primary"/>} label="Phone" value="+1 (555) 123-4567" href="tel:+15551234567"/>
                <ContactInfoItem icon={<MapPin className="w-5 h-5 text-primary"/>} label="Address" value="123 EquipTrack Ave, Suite 100, Innovation City, ST 54321"/>
              </div>
            </div>
            
            {/* Optional: Map placeholder */}
            <div className="mt-8">
                <h3 className="text-xl font-headline font-semibold mb-3">Our Location</h3>
                <div className="aspect-video bg-muted rounded-lg border flex items-center justify-center">
                    <p className="text-muted-foreground">(Map Placeholder)</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

interface ContactInfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
}

function ContactInfoItem({icon, label, value, href}: ContactInfoItemProps) {
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
            <div>
                <p className="font-medium">{label}</p>
                {href ? (
                     <a href={href} className="text-muted-foreground hover:text-primary transition-colors">{value}</a>
                ) : (
                    <p className="text-muted-foreground">{value}</p>
                )}
            </div>
        </div>
    )
}
