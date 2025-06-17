"use client";

import * as React from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { ScanLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ScanEquipmentPage() {
  const { toast } = useToast();

  const handleScanStart = () => {
    // Placeholder for actual scanning logic
    // For now, we'll just show a toast
    toast({
      title: "Scan Initiated",
      description: "Camera would open here to scan equipment.",
    });
  };

  return (
    <PageContainer
      title="Scan Equipment"
      description="Use your device's camera to scan equipment barcodes or QR codes."
    >
      <Card className="shadow-lg max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-center gap-2">
            <ScanLine className="h-8 w-8 text-primary" />
            Ready to Scan
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <p className="text-center text-muted-foreground">
            Click the button below to activate your camera and scan an equipment tag.
            Ensure you have granted camera permissions.
          </p>
          <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center border border-dashed">
            <p className="text-muted-foreground">Camera preview would appear here</p>
          </div>
          <Button onClick={handleScanStart} size="lg" className="w-full">
            <ScanLine className="mr-2 h-5 w-5" /> Start Scanning
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
