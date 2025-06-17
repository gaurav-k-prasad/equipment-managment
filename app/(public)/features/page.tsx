
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { CheckCircle, BarChart3, Users, Truck, Settings, ScanLine, Lock, Zap } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <CheckCircle className="w-8 h-8 text-primary mb-4" />,
    title: "Comprehensive Asset Tracking",
    description: "Maintain a detailed inventory of all your equipment, including purchase dates, warranty info, serial numbers, and custom fields.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Asset Tracking Diagram",
    aiHint: "inventory database"
  },
  {
    icon: <Users className="w-8 h-8 text-primary mb-4" />,
    title: "User & Location Assignment",
    description: "Assign assets to specific users, departments, or locations. Track who has what and where it's located.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "User Assignment Chart",
    aiHint: "organization chart"
  },
  {
    icon: <Settings className="w-8 h-8 text-primary mb-4" />,
    title: "Maintenance & Service Logs",
    description: "Schedule and log maintenance activities. Keep a complete service history for each asset to optimize upkeep and longevity.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Maintenance Log Interface",
    aiHint: "calendar schedule"
  },
  {
    icon: <Truck className="w-8 h-8 text-primary mb-4" />,
    title: "Shipment Tracking",
    description: "Integrate shipping information to track assets in transit. Know the status and location of equipment being moved.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Shipment Tracking Map",
    aiHint: "logistics map"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary mb-4" />,
    title: "Reporting & Analytics",
    description: "Generate insightful reports on asset utilization, maintenance costs, depreciation, and more to make informed decisions.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Analytics Dashboard",
    aiHint: "data charts"
  },
  {
    icon: <ScanLine className="w-8 h-8 text-primary mb-4" />,
    title: "Barcode & QR Code Scanning",
    description: "Quickly identify and update assets using your mobile device's camera to scan barcodes or QR codes.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Barcode Scanning",
    aiHint: "mobile scan"
  },
   {
    icon: <Zap className="w-8 h-8 text-primary mb-4" />,
    title: "Customizable Fields & Categories",
    description: "Tailor EquipTrack to your specific needs with custom fields, categories, and statuses for your assets.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Customization Interface",
    aiHint: "settings form"
  },
  {
    icon: <Lock className="w-8 h-8 text-primary mb-4" />,
    title: "Secure & Reliable",
    description: "Built on a robust and secure platform, ensuring your asset data is safe and accessible when you need it.",
    image: "https://placehold.co/500x300.png",
    imageAlt: "Security Shield",
    aiHint: "security icon"
  },
];

export default function FeaturesPage() {
  return (
    <PageContainer title="EquipTrack Features" className="py-12 md:py-16">
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">Powerful Tools for Asset Mastery</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the comprehensive suite of features EquipTrack offers to help you manage your physical assets efficiently and effectively.
        </p>
      </section>

      <div className="grid gap-12 lg:gap-16">
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.image}
            imageAlt={feature.imageAlt}
            aiHint={feature.aiHint}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
      
      <section className="mt-16 md:mt-24 text-center">
        <h2 className="text-3xl font-headline font-bold mb-6">And Much More...</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          EquipTrack is constantly evolving with new features and improvements based on user feedback. 
          Start managing your assets smarter today.
        </p>
      </section>
    </PageContainer>
  );
}

interface FeatureSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  aiHint: string;
  reverse?: boolean;
}

function FeatureSection({ icon, title, description, imageUrl, imageAlt, aiHint, reverse = false }: FeatureSectionProps) {
  return (
    <section className={`py-8 items-center grid md:grid-cols-2 gap-8 lg:gap-12 ${reverse ? 'bg-muted/30 md:rounded-xl md:p-8' : ''}`}>
      <div className={`md:order-${reverse ? 2 : 1}`}>
        <div className="mb-3">{icon}</div>
        <h2 className="text-2xl md:text-3xl font-headline font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
      </div>
      <div className={`relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl border md:order-${reverse ? 1 : 2}`}>
        <Image src={imageUrl} alt={imageAlt} layout="fill" objectFit="cover" data-ai-hint={aiHint} />
      </div>
    </section>
  );
}
