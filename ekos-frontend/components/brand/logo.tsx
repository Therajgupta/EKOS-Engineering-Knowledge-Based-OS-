import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  showText?: boolean;
  className?: string;
};

export function Logo({ size = 28, showText = true, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/ekos-logo.png"
        alt="EKOS"
        width={size}
        height={size}
        className="shrink-0"
        priority
      />
      {showText && (
        <span className="font-semibold text-zinc-100 tracking-tight">EKOS</span>
      )}
    </div>
  );
}
