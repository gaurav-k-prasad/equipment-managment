
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Package, User, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = typeof params.assignmentId === "string" ? params.assignmentId : "";

  // Mock data for now
  const assignment = { 
    id: assignmentId, 
    assetName: "Dell XPS 15 (SN: DXPS15-007)",
    assetId: "asset-123",
    assignedToName: "Jane Doe (Employee)",
    assignedToId: "user-456",
    assignmentDate: "2024-06-01",
    expectedReturnDate: "2024-12-01",
    status: "Active",
    notes: "Loaned for Project Alpha. Includes charger and mouse."
  };
  const loading = false;

  if (loading) {
    return <PageContainer title="Loading Assignment..."><p>Loading...</p></PageContainer>;
  }
  if (!assignment) {
    return <PageContainer title="Assignment Not Found"><p>Could not find assignment details.</p></PageContainer>;
  }

  return (
    <PageContainer 
        title={`Assignment: ${assignment.assetName} to ${assignment.assignedToName}`}
        description={`Details for assignment ID: ${assignmentId}`}
        actions={
            <div className="flex gap-2">
                <Button onClick={() => router.push(`/assignments/create-or-update?id=${assignmentId}`)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
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
                    <CardTitle className="font-headline text-2xl">Asset: <Link href={`/assets/${assignment.assetId}`} className="text-primary hover:underline">{assignment.assetName}</Link></CardTitle>
                    <CardDescription>Assigned to: <Link href={`/asset-holders/${assignment.assignedToId}`} className="text-primary hover:underline">{assignment.assignedToName}</Link></CardDescription>
                </div>
                 <Badge variant={assignment.status === "Active" ? "default" : "outline"} className="text-sm px-3 py-1">{assignment.status}</Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem icon={<CalendarDays className="w-5 h-5 text-primary"/>} label="Assignment Date" value={assignment.assignmentDate} />
                <InfoItem icon={<CalendarDays className="w-5 h-5 text-primary"/>} label="Expected Return Date" value={assignment.expectedReturnDate || "N/A"} />
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{assignment.notes || "No notes provided."}</p>
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
// Basic Link for now, can be NextLink later
const Link = ({href, children, className}: {href:string, children: React.ReactNode, className?:string}) => <a href={href} className={className}>{children}</a>;

