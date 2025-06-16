import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  mobileExpanded: boolean
  setMobileExpanded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  expanded: true,
  setExpanded: () => {},
  mobileExpanded: false,
  setMobileExpanded: () => {},
})

interface SidebarProviderProps {
  children: React.ReactNode
  defaultExpanded?: boolean
}

function SidebarProvider({
  children,
  defaultExpanded = true,
}: SidebarProviderProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [mobileExpanded, setMobileExpanded] = React.useState(false)
  const isMobile = useMobile()
  
  // Reset mobile expansion when switching between mobile and desktop
  React.useEffect(() => {
    if (!isMobile) {
      setMobileExpanded(false)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, mobileExpanded, setMobileExpanded }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded, mobileExpanded } = useSidebar()
  const isMobile = useMobile()

  return (
    <aside
      className={cn(
        "h-screen border-r bg-sidebar text-sidebar-foreground shadow-lg transition-all ease-in-out duration-300",
        isMobile
          ? mobileExpanded
            ? "w-[280px] translate-x-0 fixed top-0 left-0 z-30"
            : "w-[280px] -translate-x-full fixed top-0 left-0 z-30"
          : expanded
          ? "w-[280px] relative"
          : "w-[60px] relative",
        className
      )}
      {...props}
    />
  )
}

type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  const { expanded } = useSidebar()
  const isMobile = useMobile()

  return (
    <div
      className={cn(
        "flex h-16 items-center px-4 gap-2 border-b",
        className
      )}
      {...props}
    />
  )
}

type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>

function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      className={cn("flex flex-col gap-1 overflow-auto h-[calc(100vh-8rem)]", className)}
      {...props}
    />
  )
}

type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={cn("flex items-center p-2 mt-auto border-t", className)}
      {...props}
    />
  )
}

type SidebarGroupProps = React.HTMLAttributes<HTMLDivElement>

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div 
      className={cn("pb-4", className)}
      {...props}
    />
  )
}

type SidebarGroupLabelProps = React.HTMLAttributes<HTMLDivElement>

function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const { expanded } = useSidebar()
  const isMobile = useMobile()

  if (!expanded && !isMobile) {
    return null
  }

  return (
    <div
      className={cn("px-4 py-2 text-xs font-medium text-sidebar-foreground/60", className)}
      {...props}
    />
  )
}

type SidebarGroupContentProps = React.HTMLAttributes<HTMLDivElement>

function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

type SidebarMenuProps = React.HTMLAttributes<HTMLDivElement>

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <div
      className={cn("space-y-1 px-2", className)}
      {...props}
    />
  )
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
}

function SidebarMenuItem({
  active,
  className,
  ...props
}: SidebarMenuItemProps) {
  return (
    <div
      className={cn(className)}
      {...props}
    />
  )
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  active?: boolean
  icon?: LucideIcon
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ active, icon: Icon, asChild = false, className, children, ...props }, ref) => {
    const { expanded } = useSidebar()
    const isMobile = useMobile()

    if (asChild) {
      return (
        <Button
          ref={ref}
          variant="ghost"
          className={cn(
            "w-full justify-start font-normal", 
            active && "bg-sidebar-accent text-sidebar-accent-foreground bg-gradient-to-r from-primary/10 to-accent/10 font-medium",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      )
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal",
          !expanded && !isMobile && "justify-center",
          active && "bg-sidebar-accent text-sidebar-accent-foreground bg-gradient-to-r from-primary/10 to-accent/10 font-medium",
          className
        )}
        {...props}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {(expanded || isMobile) && children}
      </Button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

type SidebarTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { expanded, setExpanded, mobileExpanded, setMobileExpanded } = useSidebar()
  const isMobile = useMobile()

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("hidden lg:flex", className)}
      onClick={() => setExpanded(!expanded)}
      {...props}
    >
      <MenuIcon className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
