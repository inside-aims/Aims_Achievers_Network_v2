"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketType } from "./index";
import { cn } from "@/lib/utils";

interface TicketTypeCardProps {
  ticketType: TicketType;
  onSelect: () => void;
}

const TicketTypeCard = ({ ticketType, onSelect }: TicketTypeCardProps) => {
  const { name, description, pricePesewas, quantityTotal, quantitySold } = ticketType;

  const isSoldOut = quantityTotal !== -1 && quantitySold >= quantityTotal;
  const isUnlimited = quantityTotal === -1;
  const remaining = isUnlimited ? null : quantityTotal - quantitySold;
  const isLowStock = remaining !== null && remaining > 0 && remaining <= 20;
  const pctSold =
    isUnlimited || quantityTotal === 0
      ? 0
      : Math.round((quantitySold / quantityTotal) * 100);

  const priceDisplay =
    pricePesewas === 0 ? "Free" : `GH₵ ${(pricePesewas / 100).toFixed(2)}`;

  return (
    <div
      className={cn(
        "relative flex items-start gap-4 rounded-lg border pl-5 pr-4 py-4 transition-all",
        isSoldOut
          ? "border-border bg-muted/40 opacity-60"
          : "border-primary/15 bg-card hover:border-primary/40 hover:shadow-sm"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
          isSoldOut ? "bg-border" : "bg-primary"
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-bold">{name}</h4>
          {isSoldOut && (
            <Badge variant="secondary" className="text-[10px] px-1.5 h-4">
              Sold Out
            </Badge>
          )}
          {isLowStock && !isSoldOut && (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] px-1.5 h-4">
              Only {remaining} left
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>

        {!isUnlimited && !isSoldOut && quantityTotal > 0 && (
          <div className="mt-2.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/40 transition-all"
                style={{ width: `${pctSold}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {remaining} of {quantityTotal} remaining
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span
          className={cn(
            "text-base font-bold",
            isSoldOut ? "text-muted-foreground" : "text-primary"
          )}
        >
          {priceDisplay}
        </span>
        <Button
          size="sm"
          variant={isSoldOut ? "secondary" : "default"}
          onClick={onSelect}
          disabled={isSoldOut}
          className="h-7 text-xs px-3"
        >
          {isSoldOut ? "Sold Out" : "Get Ticket"}
        </Button>
      </div>
    </div>
  );
};

export default TicketTypeCard;
