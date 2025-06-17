
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import Image from "next/image";
import { Users, Target, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <PageContainer title="About EquipTrack" className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">Empowering Asset Management</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            EquipTrack was born from the need for a simple, yet powerful system to manage physical assets effectively. We believe that knowing what you have, where it is, and its condition is crucial for any organization's success.
          </p>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden shadow-lg border">
              <Image src="https://placehold.co/600x400.png" alt="Team working on EquipTrack" layout="fill" objectFit="cover" data-ai-hint="team collaboration" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-semibold mb-4">Our Mission <Target className="inline h-7 w-7 ml-2 text-primary" /></h2>
              <p className="text-muted-foreground mb-4">
                Our mission is to provide an intuitive, reliable, and scalable asset tracking platform that helps businesses of all sizes streamline their operations, reduce costs associated with lost or underutilized equipment, and make data-driven decisions.
              </p>
              <p className="text-muted-foreground">
                We focus on user experience, ensuring that EquipTrack is easy to adopt and integrate into your existing workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-headline font-semibold text-center mb-8">Our Core Values</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Customer-Centric"
              description="We prioritize our users' needs and feedback to continuously improve EquipTrack."
            />
            <ValueCard
              icon={<Target className="w-8 h-8 text-primary" />}
              title="Simplicity & Power"
              description="We strive for a balance of powerful features and an easy-to-use interface."
            />
            <ValueCard
              icon={<Eye className="w-8 h-8 text-primary" />}
              title="Transparency"
              description="We believe in open communication and clear processes in our development and support."
            />
          </div>
        </section>
        
        <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-semibold mb-4">Meet the (Placeholder) Team</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                EquipTrack is developed by a dedicated team of individuals passionate about creating useful software. (More details about the team can be added here).
            </p>
            {/* Placeholder for team member cards if needed */}
        </section>
      </div>
    </PageContainer>
  );
}

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow border text-center">
      <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
