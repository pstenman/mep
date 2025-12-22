import { forwardRef } from "react";
import { Button } from "@mep/ui";
import { cn } from "@mep/ui";
import { Loader2, type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mep/ui";

interface DynamicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  tooltip: string;
  size?: "icon" | "sm" | "default" | "lg";
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  loading?: boolean;
  iconClassName?: string;
  buttonClassName?: string;
  tooltipDelay?: number;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  tooltipAlign?: "start" | "center" | "end";
}

export const DynamicButton = forwardRef<HTMLButtonElement, DynamicButtonProps>(
  (
    {
      icon: Icon,
      tooltip,
      size = "sm",
      variant = "outline",
      loading = false,
      iconClassName = "",
      buttonClassName = "",
      tooltipDelay = 0,
      tooltipSide = "top",
      tooltipAlign = "center",
      disabled,
      ...props
    },
    ref,
  ) => {
    const button = (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={buttonClassName}
        disabled={disabled}
        {...props}
      >
        {loading ? (
          <Loader2
            size={
              size === "icon" ? "size-4" : size === "sm" ? "size-4" : "size-5"
            }
            className={cn(
              "animate-spin",
              size === "icon" ? "size-4" : size === "sm" ? "size-4" : "size-5",
              iconClassName,
            )}
          />
        ) : (
          Icon && (
            <Icon
              size={size === "icon" ? 16 : size === "sm" ? 16 : 20}
              className={cn(
                size === "icon"
                  ? "icon-sm"
                  : size === "sm"
                    ? "icon-sm"
                    : "icon-lg",
                iconClassName,
              )}
            />
          )
        )}
      </Button>
    );
    return (
      <TooltipProvider>
        <Tooltip delayDuration={tooltipDelay}>
          {disabled ? (
            <TooltipTrigger>
              <span className="inline-flex">{button}</span>
            </TooltipTrigger>
          ) : (
            <TooltipTrigger asChild>{button}</TooltipTrigger>
          )}
          <TooltipContent side={tooltipSide} align={tooltipAlign}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
