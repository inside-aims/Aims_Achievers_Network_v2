"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Hash, Search, ScanLine, AlertCircle, Info, CheckCircle, SwitchCamera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScanResult } from "./index";
import { SAMPLE_SCAN_RESULTS, verifyTicketCode } from "./mock-data";
import ScanResultPanel from "./scan-result-panel";

type EventScanViewProps = {
  eventId: string;
  eventTitle: string;
};

type Tab = "camera" | "manual";

type ScanLogEntry = {
  code: string;
  type: ScanResult["type"];
  scannedAt: string;
};

const EventScanView = ({ eventId, eventTitle }: EventScanViewProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("camera");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [reentryGenerated, setReentryGenerated] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set());
  const [scanLog, setScanLog] = useState<ScanLogEntry[]>([]);
  const [simulateIndex, setSimulateIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const eventSamples = SAMPLE_SCAN_RESULTS.filter(
    (r) => !r.ticket || r.ticket.eventId === eventId
  );

  useEffect(() => {
    if (activeTab !== "camera") {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }

    let cancelled = false;

    async function initCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera not supported in this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraError(null);
      } catch {
        if (!cancelled) {
          setCameraError("Camera access denied. Allow camera permission and reload.");
        }
      }
    }

    initCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [activeTab, facingMode]);

  function recordResult(result: ScanResult) {
    setScanResult(result);
    setScanCount((prev) => prev + 1);
    setReentryGenerated(false);
    if (result.ticket) {
      setScanLog((prev) =>
        [
          { code: result.ticket!.ticketCode, type: result.type, scannedAt: result.scannedAt },
          ...prev,
        ].slice(0, 10)
      );
    }
    if (result.type === "success" && result.ticket) {
      setUsedCodes((prev) => new Set([...prev, result.ticket!.ticketCode]));
    }
  }

  function handleSimulateScan() {
    const sample = eventSamples[simulateIndex % eventSamples.length];
    setSimulateIndex((prev) => prev + 1);
    const code = sample.ticket?.ticketCode ?? "INVALID-SIM";
    recordResult(verifyTicketCode(eventId, code, usedCodes));
  }

  function handleManualVerify() {
    if (!manualCode.trim()) return;
    recordResult(verifyTicketCode(eventId, manualCode.trim(), usedCodes));
    setManualCode("");
  }

  function handleGenerateReentry() {
    setReentryGenerated(true);
    alert("New QR code generated! The old code has been invalidated. In production, this sends a new QR to the attendee's email.");
  }

  function handleDismiss() {
    setScanResult(null);
    setManualCode("");
    setReentryGenerated(false);
  }

  return (
    <div id="event-scan-view">
      {/* Branded header bar */}
      <div className="bg-primary text-primary-foreground feature-no py-5 border-b border-primary/20">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.15em] font-medium text-primary-foreground/50">
              Now Scanning
            </p>
            <h1 className="text-lg md:text-xl font-bold leading-tight mt-0.5 truncate">
              {eventTitle}
            </h1>
          </div>

          {/* Scan counter */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-primary-foreground/10 ring-1 ring-inset ring-primary-foreground/20 rounded-xl px-4 py-2.5 min-w-[72px] text-center">
            <span className="text-2xl font-bold tabular-nums leading-none">{scanCount}</span>
            <span className="text-[11px] text-primary-foreground/50 mt-0.5 uppercase tracking-wide">
              scanned
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="feature">
        <section className="flex flex-col gap-6 max-w-xl mx-auto">

          {/* Segment control tab switcher */}
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab("camera")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-150",
                activeTab === "camera"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Camera className="h-4 w-4" />
              Camera
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-150",
                activeTab === "manual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Hash className="h-4 w-4" />
              Manual Entry
            </button>
          </div>

          {/* Camera tab */}
          {activeTab === "camera" && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-foreground aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "w-full h-full object-cover opacity-80",
                    cameraError && "hidden"
                  )}
                />

                {/* Scan overlay */}
                {!cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Dim vignette */}
                    <div className="absolute inset-0 bg-foreground/40" />
                    {/* Clear scan zone with corner brackets */}
                    <div className="relative z-10 w-52 h-52">
                      <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-secondary rounded-tl" />
                      <span className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-secondary rounded-tr" />
                      <span className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-secondary rounded-bl" />
                      <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-secondary rounded-br" />
                      {/* Scan line */}
                      <span className="absolute inset-x-3 top-1/2 h-px bg-secondary/70 animate-pulse rounded-full" />
                    </div>
                  </div>
                )}

                {/* Camera error state */}
                {cameraError && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-12 px-6 text-center text-primary-foreground">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10">
                      <AlertCircle className="h-8 w-8 text-primary-foreground/50" />
                    </div>
                    <p className="text-sm text-primary-foreground/60 max-w-xs">{cameraError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => {
                        setCameraError(null);
                        setActiveTab("manual");
                        setTimeout(() => setActiveTab("camera"), 50);
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Live indicator */}
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full px-3 py-1 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Flip camera button */}
                {!cameraError && (
                  <button
                    onClick={() =>
                      setFacingMode((f) => (f === "environment" ? "user" : "environment"))
                    }
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground shadow-sm hover:bg-background transition-colors"
                    aria-label="Switch camera"
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Button onClick={handleSimulateScan} className="w-full h-11 gap-2" variant="secondary">
                  <ScanLine className="h-4 w-4" />
                  Simulate QR Scan
                </Button>
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Info className="h-3 w-3 shrink-0" />
                  Live QR decoding activates when connected to the database.
                </p>
              </div>
            </div>
          )}

          {/* Manual entry tab */}
          {activeTab === "manual" && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Enter Ticket Code</p>
                <p className="text-xs text-muted-foreground">
                  Type the code printed on the attendee&apos;s ticket.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. FAST-DEMO01"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                    className="pl-9 h-11 font-mono"
                    autoCapitalize="characters"
                  />
                </div>
                <Button
                  onClick={handleManualVerify}
                  disabled={!manualCode.trim()}
                  className="h-11 gap-1.5 shrink-0"
                >
                  <Search className="h-4 w-4" />
                  Verify
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Demo:{" "}
                <span className="font-mono text-foreground">FAST-DEMO01</span> (valid) ·{" "}
                <span className="font-mono text-foreground">FAST-DEMO02</span> (used) ·{" "}
                <span className="font-mono text-foreground">FBNE-DEMO01</span> (other event)
              </p>
            </div>
          )}

          {/* Scan result */}
          {scanResult && (
            <ScanResultPanel
              result={scanResult}
              onGenerateNewQR={handleGenerateReentry}
              onDismiss={handleDismiss}
            />
          )}

          {/* Re-entry confirmation */}
          {reentryGenerated && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-4">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">New QR code sent</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The previous code is now invalid. Only the new code grants entry.
                </p>
              </div>
            </div>
          )}

          {/* Session scan log */}
          {scanLog.length > 0 && (
            <details className="group">
              <summary className="text-xs text-muted-foreground cursor-pointer list-none flex items-center gap-1.5 select-none py-1">
                <span className="group-open:hidden">▶</span>
                <span className="hidden group-open:inline">▼</span>
                Session log · {scanLog.length} scan{scanLog.length !== 1 ? "s" : ""}
              </summary>
              <div className="mt-3 rounded-xl border border-border divide-y divide-border overflow-hidden">
                {scanLog.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-card text-xs gap-3">
                    <span className="font-mono text-muted-foreground truncate">{entry.code}</span>
                    <ScanLogBadge type={entry.type} />
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>
      </div>
    </div>
  );
};

function ScanLogBadge({ type }: { type: ScanResult["type"] }) {
  const config = {
    success: "bg-green-500/10 text-green-700",
    already_used: "bg-amber-500/10 text-amber-700",
    invalid: "bg-red-500/10 text-red-700",
    cancelled: "bg-red-500/10 text-red-700",
  } as const;

  const label = {
    success: "Valid",
    already_used: "Used",
    invalid: "Invalid",
    cancelled: "Cancelled",
  } as const;

  return (
    <span className={cn("shrink-0 rounded-full px-2 py-0.5 font-medium", config[type])}>
      {label[type]}
    </span>
  );
}

export default EventScanView;
