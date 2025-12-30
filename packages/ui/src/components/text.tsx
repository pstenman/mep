import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";

type Props = {
  className?: string;
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const Text = ({
  className,
  loading,
  asChild = false,
  children,
  ...restProps
}: Props) => {
  const Component = asChild ? Slot : "p";

  return (
    <Component
      className={cn(loading && "skeleton-line self-start block", className)}
      {...restProps}
    >
      {children}
    </Component>
  );
};
