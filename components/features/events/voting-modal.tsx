'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {NomineeProps} from "@/components/features/events/index";
import {CheckCircle2, Copy, Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState, useEffect} from "react";

interface VotingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nominee: NomineeProps;
}

const VotingModal = (
  {
    open,
    setOpen,
    nominee,
  }: VotingModalProps) => {

  const votingSteps = [
    "Dial *920*401#",
    "Enter nominee code: {nomineeCode}",
    "Enter Number of Votes",
    "Confirm your vote",
    "Wait for SMS confirmation"
  ];
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(nominee?.nomineeCode);
    setCopied(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[95vh]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-center">
            How to Vote
          </DialogTitle>
          <DialogDescription className="text-center">
            Follow these simple steps to cast your vote
          </DialogDescription>
        </DialogHeader>

        {/* Nominee Code Highlight */}
        <div className="text-center py-2 px-4 bg-muted rounded-card border-2 border-primary/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Nominee Code
          </p>
          <div className="flex items-center justify-center gap-4">
            <p className="text-2xl font-bold text-primary">
              {nominee?.nomineeCode}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary"/>
              ) : (
                <Copy className="h-4 w-4 text-primary"/>
              )}
            </Button>
          </div>
        </div>

        {/* Voting Steps */}
        <div className="space-y-2 py-2">
          {votingSteps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm leading-relaxed">
                  {step.includes("{nomineeCode}")
                    ? step.replace("{nomineeCode}", nominee?.nomineeCode)
                    : step
                  }
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground/40 flex-shrink-0 mt-1"/>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-accent border border-accent-foreground/20 p-2 rounded-card">
          <p className="text-xs text-accent-foreground text-center">
            💡 Make sure you have sufficient account balance before voting
          </p>
        </div>

        <Button
          variant="default"
          className="w-full mt-2"
          onClick={() => setOpen(false)}
        >
          Got it!
        </Button>

        <DialogHeader className="sr-only">
          <DialogTitle>Voting Instructions</DialogTitle>
          <DialogDescription>
            Step-by-step guide to vote for {nominee?.fullName}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default VotingModal;