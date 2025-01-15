import { cn } from "../lib/utils";

export function ContainerWrapper({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-[120rem] mx-auto", className)}>{children}</div>
  );
}
