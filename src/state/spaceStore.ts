import { useState } from "react";

export function useSpaceStore() {
  const [activeSpace, setActiveSpace] = useState<string>("Marketing");

  const spaces = ["Marketing", "Product", "Engineering", "Design", "Finance", "HR"];

  return { spaces, activeSpace, setActiveSpace };
}
