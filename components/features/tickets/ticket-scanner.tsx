"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Camera, Hash, Search } from "lucide-react";
import { ScanResult } from "./index";
import { SAMPLE_SCAN_RESULTS } from "./mock-data";
import ScanResultPanel from "./scan-result-panel";

// QR Scanner UI for organizers to verify tickets at the venue
const TicketScanner = () => {
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [reentryGenerated, setReentryGenerated] = useState(false);

  // Simulate scanning by cycling through sample scan results
  function handleSimulateScan() {
    const resultIndex = scanCount % SAMPLE_SCAN_RESULTS.length;
    setScanResult(SAMPLE_SCAN_RESULTS[resultIndex]);
    setScanCount((prev) => prev + 1);
    setReentryGenerated(false);
  }

  // Simulate manual code lookup
  function handleManualLookup() {
    if (!manualCode.trim()) return;

    // Find matching sample result or show invalid
    const matchingResult = SAMPLE_SCAN_RESULTS.find(
      (r) => r.ticket?.ticketCode.toLowerCase() === manualCode.toLowerCase()
    );

    setScanResult(
      matchingResult ?? {
        type: "invalid",
        ticket: null,
        message: "No ticket found for this code. Please check and try again.",
        scannedAt: new Date().toISOString(),
      }
    );
    setReentryGenerated(false);
  }

  // Simulate re-entry QR generation
  function handleGenerateNewQR() {
    setReentryGenerated(true);
    // In production this would call a mutation to invalidate old code
    // and generate a new one
    alert("New QR code generated! The old code has been invalidated. In production, this sends a new QR to the attendee's email.");
  }

  function handleDismiss() {
    setScanResult(null);
    setManualCode("");
    setReentryGenerated(false);
  }

  return (
    <div className="space-y-6">
      {/* Scanner viewport (simulated) */}
      <div className="relative rounded-xl border-2 border-dashed border-primary/20 bg-muted/50 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4 gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-10 w-10 text-primary/60" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Camera Scanner
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-xs">
              Point the camera at a ticket QR code to scan. In production, this area shows the live camera feed.
            </p>
          </div>

          {/* Simulate scan button */}
          <Button
            variant="default"
            onClick={handleSimulateScan}
            className="gap-2"
          >
            <ScanLine className="h-4 w-4" />
            Simulate Scan
          </Button>
        </div>

        {/* Scan counter */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm gap-1">
            <ScanLine className="h-3 w-3" />
            {scanCount} scanned
          </Badge>
        </div>
      </div>

      {/* Manual code entry */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Manual Code Entry</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter ticket code manually"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
              className="pl-9"
            />
          </div>
          <Button
            onClick={handleManualLookup}
            disabled={!manualCode.trim()}
            className="shrink-0 gap-1"
          >
            <Search className="h-4 w-4" />
            Verify
          </Button>
        </div>
      </div>

      {/* Scan result */}
      {scanResult && (
        <ScanResultPanel
          result={scanResult}
          onGenerateNewQR={handleGenerateNewQR}
          onDismiss={handleDismiss}
        />
      )}

      {/* Re-entry confirmation */}
      {reentryGenerated && (
        <div className="rounded-md border border-green-500/20 bg-green-500/5 px-4 py-3">
          <p className="text-sm text-green-700 font-medium">
            New QR code has been generated and sent to the attendee&apos;s email.
          </p>
          <p className="text-xs text-green-600/70 mt-1">
            The previous QR code is now invalid. Only the new code will work for re-entry.
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketScanner;
