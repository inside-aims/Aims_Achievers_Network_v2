import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {NomineeProps} from "@/components/features/events/index";
import Image from "next/image";
import {Phone, Copy} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface VotingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nominee: NomineeProps;
  event: string;
  category: string;
  votingNumber?: string;
}

const InfoModal = (
  {
    open,
    setOpen,
    nominee,
    event,
    category,
    votingNumber = "1977"
  }: VotingModalProps) => {

  const votingSteps = [
    "Dial *920*401#",
    "Enter nominee code: {nomineeCode}",
    "Enter Number of Votes",
    "Confirm your vote",
    "Wait for SMS confirmation"
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const pathname = window.location.origin

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 max-h-[95vh] overflow-hidden flex flex-col">

        <div className="grid md:grid-cols-2 gap-0 overflow-y-auto">
          {/* Left Section - Nominee Info */}
          <div className="bg-primary p-6 md:p-8 flex flex-col items-center justify-center text-center text-primary-foreground">
            <div className="mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold mb-1 uppercase tracking-wide">
                {event}
              </h2>
            </div>

            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 md:mb-6 border-4 border-primary-foreground/20">
              <Image
                src={nominee.imageUrl}
                alt={nominee.fullName}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">{nominee.fullName}</h3>
            <p className="text-sm opacity-90">{category}</p>
          </div>

          {/* Right Section - Voting Instructions */}
          <div className="bg-background p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary"/>
              <span className="text-2xl md:text-3xl font-bold">{votingNumber}</span>
            </div>

            <div className="flex-1">
              <h4 className="text-xs md:text-sm font-semibold text-muted-foreground mb-4 md:mb-6 uppercase tracking-wide">
                How to Vote
              </h4>

              <div className="space-y-4 md:space-y-5">
                {votingSteps.map((step, index) => (
                  <div key={index} className="flex gap-3 md:gap-4">
                    <span
                      className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs md:text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-xs md:text-sm pt-0.5">
                      {step.includes("{nomineeCode}")
                        ? step.replace("{nomineeCode}", nominee.nomineeCode)
                        : step
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
              <h5 className="text-xs font-semibold text-muted-foreground mb-2 md:mb-3 uppercase tracking-wide">
                Nominee Profile
              </h5>
              <div className="flex items-center justify-between bg-muted px-3 md:px-4 py-2 md:py-3 rounded-md">
                <Link
                  href={`${pathname}/${nominee.nomineeCode}`}
                  className="text-xs md:text-sm text-primary hover:underline truncate"
                >
                  {pathname}/nominee/{nominee.nomineeCode}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8"
                  onClick={() => copyToClipboard(`${pathname}/nominee/${nominee.nomineeCode}`)}
                >
                  <Copy className="h-3 w-3 md:h-4 md:w-4"/>
                </Button>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full mt-4 md:mt-6"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>Vote for {nominee.fullName}</DialogTitle>
          <DialogDescription>
            Follow the instructions to vote for this nominee
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;