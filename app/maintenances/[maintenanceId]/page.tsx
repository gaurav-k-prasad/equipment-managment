
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Package, CalendarDays, Wrench, User, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const maintenanceId = typeof params.maintenanceId === "string" ? params.maintenanceId : "";

  // Mock data for now
  const maintenanceLog = { 
    id: maintenanceId, 
    assetName: "Projector Epson-3000 (SN: EPSON-P002)",
    assetId: "asset-789",
    maintenanceDate: "2024-05-20",
    maintenanceType: "Repair",
    description: "Replaced faulty lamp unit. Cleaned lenses and filters. Tested output.",
    cost: "150.00",
    performedBy: "AV Tech Services Inc.",
    notes: "Lamp was flickering. Unit is now fully functional."
  };
  const loading = false;

  if (loading) {
    return <PageContainer title="Loading Maintenance Log..."><p>Loading...</p></PageContainer>;
  }
  if (!maintenanceLog) {
    return <PageContainer title="Maintenance Log Not Found"><p>Could not find maintenance log details.</p></PageContainer>;
  }

  return (
    <PageContainer 
        title={`Maintenance Log for: ${maintenanceLog.assetName}`}
        description={`Details for maintenance ID: ${maintenanceId}`}
        actions={
            <div className="flex gap-2">
                <Button onClick={() => router.push(`/maintenances/create-or-update?id=${maintenanceId}`)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
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
                    <CardTitle className="font-headline text-2xl">Asset: <Link href={`/assets/${maintenanceLog.assetId}`} className="text-primary hover:underline">{maintenanceLog.assetName}</Link></CardTitle>
                    <CardDescription>Maintenance ID: {maintenanceLog.id}</CardDescription>
                </div>
                 <Badge variant="outline" className="text-sm px-3 py-1">{maintenanceLog.maintenanceType}</Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem icon={<CalendarDays className="w-5 h-5 text-primary"/>} label="Maintenance Date" value={maintenanceLog.maintenanceDate} />
                <InfoItem icon={<Wrench className="w-5 h-5 text-primary"/>} label="Type" value={maintenanceLog.maintenanceType} />
                <InfoItem icon={<User className="w-5 h-5 text-primary"/>} label="Performed By" value={maintenanceLog.performedBy || "N/A"} />
                <InfoItem icon={<DollarSign className="w-5 h-5 text-primary"/>} label="Cost" value={maintenanceLog.cost ? `$${maintenanceLog.cost}` : "N/A"} />
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description of Work</h3>
                <p className="whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{maintenanceLog.description}</p>
            </div>
            {maintenanceLog.notes && (
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</h3>
                    <p className="whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{maintenanceLog.notes}</p>
                </div>
            )}
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
const Link = ({href, children, className}: {href:string, children: React.ReactNode, className?:string}) => <a href={href} className={className}>{children}</a>;
