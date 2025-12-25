'use client';

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NominateButtonProps {
  event: string;
  category?: string;
  label?: string;
}

const NominateButton = (
  {
                          event,
                          category,
                          label = "Nominate",
                        }: NominateButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams({
      event,
      ...(category && { category }),
    });

    router.push(`/nominations?${params.toString()}`);
  };

  return (
    <Button variant="secondary" onClick={handleClick} className="flex gap-2">
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default NominateButton;
