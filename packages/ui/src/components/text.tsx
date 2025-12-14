import { cn } from "../utils/cn";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export const Text = ({ className, loading, children, ...restProps }: Props) => {
  return (
    <p
      className={cn(loading && "skeleton-line self-start block", className)}
      {...restProps}
    >
      {children}
    </p>
  );
};
