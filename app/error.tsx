"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 font-sans">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif tracking-tight text-foreground">
            Something went wrong!
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            We encountered an unexpected error while processing your request. Our engineering team has been notified.
          </p>
        </div>

        <div className="w-full pt-4">
          <Button 
            onClick={() => reset()} 
            size="lg" 
            variant="default"
            className="w-full max-w-[200px] flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
