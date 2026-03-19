import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  thonColor?: "dark" | "light";
};

const BrandWordmark = ({ className, thonColor = "dark" }: BrandWordmarkProps) => {
  return (
    <span className={cn("brand-wordmark", className)}>
      <span className="text-[#f97316]">Zaya</span>
      <span className={thonColor === "light" ? "text-white" : "text-[#111111]"}>Thon</span>
    </span>
  );
};

export default BrandWordmark;
