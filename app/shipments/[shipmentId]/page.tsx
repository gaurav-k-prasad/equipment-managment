
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Package, MapPin, User, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useShipment } from "@/hooks/useShipment"; // Example hook

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = typeof params.shipmentId === "string" ? params.shipmentId : "";
  // const { shipment, loading, error } = useShipment(shipmentId); // Example usage

  // Mock data for now
  const shipment = { 
    id: shipmentId, 
    assets: ["Laptop XYZ-123", "Monitor ABC-456"], 
    shipmentDate: "2024-07-15", 
    origin: "Warehouse A",
    destination: "Client X - Site B",
    carrier: "FedEx",
    trackingNumber: "FX1234567890",
    status: "In Transit", // Example statuses: Pending, In Transit, Delivered, Delayed
    shippedBy: "Logistics Team",
    receivedBy: "",
    notes: "Fragile items, handle with care."
  };
  const loading = false;

  if (loading) {
    return <PageContainer title="Loading Shipment Details..."><p>Loading...</p></PageContainer>;
  }
  if (!shipment) {
    return <PageContainer title="Shipment Not Found"><p>Could not find shipment details.</p></PageContainer>;
  }
  
  const getStatusBadgeVariant = (status: string) => {
    if (status === "Delivered") return "default"; // Greenish
    if (status === "In Transit") return "secondary"; // Bluish/Greyish
    if (status === "Pending") return "outline"; // Yellowish
    if (status === "Delayed") return "destructive"; // Reddish
    return "default";
  };

  return (
    <PageContainer 
        title={`Shipment ID: ${shipmentId}`}
        description="Detailed information about the asset shipment."
        actions={
            <div className="flex gap-2">
                <Button onClick={() => router.push(`/shipments/create-or-update?id=${shipmentId}`)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                <Button variant="destructive" onClick={() => alert("Delete action placeholder")}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
            </div>
        }
    >
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline text-2xl">Shipment: {shipmentId}</CardTitle>
                    <CardDescription>Tracking: {shipment.trackingNumber || "N/A"}</CardDescription>
                </div>
                 <Badge variant={getStatusBadgeVariant(shipment.status)} className="text-sm px-3 py-1">{shipment.status}</Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem icon={<Package className="w-5 h-5 text-primary"/>} label="Asset(s)" value={shipment.assets.join(", ")} />
                <InfoItem icon={<CalendarDays className="w-5 h-5 text-primary"/>} label="Shipment Date" value={shipment.shipmentDate} />
                <InfoItem icon={<Truck className="w-5 h-5 text-primary"/>} label="Carrier" value={shipment.carrier || "N/A"} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <InfoItem icon={<MapPin className="w-5 h-5 text-primary"/>} label="Origin" value={shipment.origin} />
                <InfoItem icon={<MapPin className="w-5 h-5 text-primary"/>} label="Destination" value={shipment.destination} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                 <InfoItem icon={<User className="w-5 h-5 text-primary"/>} label="Shipped By" value={shipment.shippedBy} />
                 <InfoItem icon={<User className="w-5 h-5 text-primary"/>} label="Received By" value={shipment.receivedBy || "Pending"} />
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{shipment.notes || "No notes provided."}</p>
            </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}
function InfoItem({icon, label, value}: InfoItemProps) {
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p>{value}</p>
            </div>
        </div>
    )
}
