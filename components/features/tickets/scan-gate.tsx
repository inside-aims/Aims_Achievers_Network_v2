"use client";

import { useState } from "react";
import { LockKeyhole, Unlock, Hash, CalendarDays, MapPin, Clock, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifyScanAccess } from "./mock-data";
import { cn } from "@/lib/utils";

type ScanGateProps = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  onUnlock: () => void;
};

const ScanGate = ({ eventId, eventTitle, eventDate, eventTime, venue, onUnlock }: ScanGateProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const valid = verifyScanAccess(eventId, code);
      setLoading(false);
      if (valid) {
        onUnlock();
      } else {
        setError(true);
      }
    }, 150);
  }

  return (
    <div id="scan-gate" className="min-h-[100dvh] flex flex-col">
      {/* Event hero — primary branded zone */}
      <div className="bg-primary text-primary-foreground feature-no py-14 md:py-18 flex flex-col items-center text-center gap-7">
        {/* Lock icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10 ring-1 ring-inset ring-primary-foreground/20">
          <LockKeyhole className="h-9 w-9 text-primary-foreground" />
        </div>

        {/* Title */}
        <div className="space-y-2 max-w-xs">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-primary-foreground/50">
            Authorized Staff Only
          </p>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{eventTitle}</h1>
        </div>

        {/* Event meta */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/60">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {eventDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {eventTime}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {venue}
          </span>
        </div>
      </div>

      {/* Form zone */}
      <div className="flex-1 bg-background feature-no py-10">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold">Scan Access Code</h2>
            <p className="text-sm text-muted-foreground">
              Enter the code provided by the event organizer to unlock the scanner.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter access code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={cn(
                  "pl-9 h-12 text-base",
                  error && "border-destructive focus-visible:ring-destructive/30"
                )}
                autoCapitalize="characters"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!code.trim() || loading}
              className="w-full h-12 gap-2 text-base"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Unlock className="h-5 w-5" />
              )}
              Unlock Scanner
            </Button>

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                <ShieldAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">
                  Invalid access code. Check with the event organizer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanGate;
