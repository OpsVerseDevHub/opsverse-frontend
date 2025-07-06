import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: string;
  width?: string;
  rounded?: boolean;
}

export default function Skeleton({
  height = "h-4",
  width = "w-full",
  rounded = false,
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${height} ${width} ${rounded ? "rounded-full" : "rounded-md"} ${className}`}
      {...props}
    />
  );
}
