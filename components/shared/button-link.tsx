'use client';

import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";

interface Props {
  href?: string;
  label: string;
  icon?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}
const ButtonLink = ({href, label, onClick, disabled = false, icon = true}: Props) => {
  const router = useRouter();

  return(
    <Button
      className="flex w-full font-bold  h-10  transition-transform duration-500 ease-in-out hover:scale-x-105 "
      onClick={onClick ? onClick : () => router.push(`${href}`)}
      disabled={disabled}
    >
      {label}
      {icon && (
        <span> <ArrowRight/> </span>
      )}
    </Button>
  )
}
export default ButtonLink;