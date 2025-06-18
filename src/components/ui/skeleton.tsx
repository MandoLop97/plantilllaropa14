
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted animate-skeleton-hue",
        "after:content-[''] after:absolute after:inset-0",
        "after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        "after:bg-[length:200%_100%] after:animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

// Skeleton responsivo para anchos adaptativos
function ResponsiveSkeleton({
  className,
  mobileWidth = "w-full",
  tabletWidth = "sm:w-auto",
  desktopWidth = "lg:w-auto",
  height = "h-4",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  height?: string;
}) {
  return (
    <Skeleton
      className={cn(
        height,
        mobileWidth,
        tabletWidth,
        desktopWidth,
        className
      )}
      {...props}
    />
  )
}

export { Skeleton, ResponsiveSkeleton }
