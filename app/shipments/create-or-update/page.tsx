
"use client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
// import { useForm, Controller } from "react-hook-form";
// import * as z from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For asset/user selection
// import { DatePicker } from "@/components/ui/date-picker"; // Custom or shadcn date picker

export default function CreateOrUpdateShipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("id"); // If editing an existing shipment

  // const onSubmit = async (data) => {
  //   console.log("Shipment Data:", data);
  //   // Logic to save/update shipment
  //   router.push("/shipments");
  // };

  const pageTitle = shipmentId ? "Edit Shipment Log" : "Create New Shipment Log";

  return (
    <PageContainer title={pageTitle} description="Log details of an asset shipment or transfer.">
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">{pageTitle}</CardTitle>
            <CardDescription>Fill in the shipment details below.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* <Form {...form}> */}
            {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="asset" className="block text-sm font-medium mb-1 flex items-center"><Package className="w-4 h-4 mr-1"/>Asset(s) Shipped</label>
                        {/* Replace with a multi-select or tagging component for assets */}
                        <Input id="asset" placeholder="Select or enter asset IDs/names"/>
                    </div>
                    <div>
                        <label htmlFor="shipmentDate" className="block text-sm font-medium mb-1">Shipment Date</label>
                        <Input id="shipmentDate" type="date"/>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="origin" className="block text-sm font-medium mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1"/>Origin</label>
                        <Input id="origin" placeholder="e.g., Warehouse A, Office 101"/>
                    </div>
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1"/>Destination</label>
                        <Input id="destination" placeholder="e.g., Client Site, Office 202"/>
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="carrier" className="block text-sm font-medium mb-1">Carrier (Optional)</label>
                        <Input id="carrier" placeholder="e.g., FedEx, UPS, Internal"/>
                    </div>
                    <div>
                        <label htmlFor="trackingNumber" className="block text-sm font-medium mb-1">Tracking Number (Optional)</label>
                        <Input id="trackingNumber" placeholder="External tracking ID"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="shippedBy" className="block text-sm font-medium mb-1 flex items-center"><User className="w-4 h-4 mr-1"/>Shipped By (User/Department)</label>
                    <Input id="shippedBy" placeholder="Person or department initiating shipment"/>
                </div>
                 <div>
                    <label htmlFor="receivedBy" className="block text-sm font-medium mb-1 flex items-center"><User className="w-4 h-4 mr-1"/>Received By (Optional)</label>
                    <Input id="receivedBy" placeholder="Person or department receiving shipment"/>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <Textarea id="notes" placeholder="Any relevant notes about the shipment..." />
                </div>
                <Button type="submit">Save Shipment (Placeholder)</Button>
            </form>
            {/* </Form> */}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
