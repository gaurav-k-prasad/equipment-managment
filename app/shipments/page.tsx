
"use client";

import * as React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, Search, History, PlusCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// This is a mock API call. Replace with actual tracking API integration.
const mockFetchTrackingStatus = async (trackingNumber: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses = ["In Transit", "Out for Delivery", "Delivered", "Delayed", "Exception"];
      if (trackingNumber.startsWith("ERR")) resolve("Error: Invalid Tracking Number");
      else resolve(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 1500);
  });
};

const trackingSchema = z.object({
  trackingNumber: z.string().min(5, { message: "Tracking number must be at least 5 characters." }),
});
type TrackingFormValues = z.infer<typeof trackingSchema>;

interface TrackingResult {
  number: string;
  status: string;
  timestamp: Date;
}

export default function ShipmentsTrackingPage() {
  const [trackingResult, setTrackingResult] = React.useState<TrackingResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchHistory, setSearchHistory] = React.useState<TrackingResult[]>([]);

  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    defaultValues: { trackingNumber: "" },
  });
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("shippingSearchHistory");
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory).map((item: TrackingResult) => ({...item, timestamp: new Date(item.timestamp)})));
      }
    }
  }, []);

  const updateSearchHistory = (newResult: TrackingResult) => {
    const updatedHistory = [newResult, ...searchHistory.filter(item => item.number !== newResult.number)].slice(0, 5); // Keep last 5
    setSearchHistory(updatedHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("shippingSearchHistory", JSON.stringify(updatedHistory));
    }
  }

  const onSubmit: SubmitHandler<TrackingFormValues> = async (data) => {
    setIsLoading(true);
    setTrackingResult(null); 
    const status = await mockFetchTrackingStatus(data.trackingNumber);
    const newResult = { number: data.trackingNumber, status, timestamp: new Date() };
    setTrackingResult(newResult);
    updateSearchHistory(newResult);
    setIsLoading(false);
    form.reset();
  };

  return (
    <PageContainer
      title="Shipment Tracking & Management"
      description="Track external shipments and manage internal asset transfers."
      actions={
          <Button asChild>
            <Link href="/shipments/create-or-update"><PlusCircle className="mr-2 h-4 w-4"/>Log New Shipment</Link>
          </Button>
      }
    >
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Truck className="h-6 w-6 text-primary" /> Track External Package</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your tracking ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Searching..." : <><Search className="mr-2 h-4 w-4" /> Track Shipment</>}
                </Button>
              </form>
            </Form>

            {isLoading && (
              <div className="mt-6 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            )}

            {trackingResult && !isLoading && (
              <div className="mt-6 p-4 border rounded-md bg-muted/30">
                <h3 className="font-semibold text-lg">Tracking Result for: <span className="text-primary">{trackingResult.number}</span></h3>
                <p className="text-2xl font-bold py-2">{trackingResult.status}</p>
                <p className="text-xs text-muted-foreground">Last updated: {trackingResult.timestamp.toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><History className="h-5 w-5" /> Recent External Searches</CardTitle>
          </CardHeader>
          <CardContent>
            {searchHistory.length === 0 ? (
              <p className="text-muted-foreground">No recent searches.</p>
            ) : (
              <ul className="space-y-3">
                {searchHistory.map((item, index) => (
                  <li key={index} className="p-3 border rounded-md hover:bg-muted/20 cursor-pointer" onClick={() => { form.setValue("trackingNumber", item.number); form.handleSubmit(onSubmit)();}}>
                    <div className="flex justify-between items-center">
                        <p className="font-medium">{item.number}</p>
                        <Badge variant={item.status === "Delivered" ? "default" : "outline"}>{item.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Searched on: {item.timestamp.toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="font-headline">Internal Shipments/Transfers</CardTitle>
            <CardDescription>Log and track the movement of assets within the organization or to external parties.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">List of internal shipments/asset transfers will appear here. (Feature under construction)</p>
            {/* Placeholder for internal shipments table */}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

