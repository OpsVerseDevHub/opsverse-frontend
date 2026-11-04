import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?:  string;
  width?:   string;
  rounded?: boolean;
}

export default function Skeleton({
  height = "h-4",
  width  = "w-full",
  rounded = false,
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${height} ${width} ${rounded ? "rounded-full" : "rounded-lg"} ${className}`}
      {...props}
    />
  );
}
