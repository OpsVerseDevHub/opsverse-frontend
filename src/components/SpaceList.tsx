import { useSpaceStore } from "../state/spaceStore";

interface SpaceListProps {
  isOpen: boolean;
}

export default function SpaceList({ isOpen }: SpaceListProps) {
  const { spaces, activeSpace, setActiveSpace } = useSpaceStore();

  return (
    <div className="flex flex-col gap-1">
      {spaces.map((space) => (
        <button
          key={space}
          onClick={() => setActiveSpace(space)}
          className={`flex items-center px-4 py-2 text-sm rounded ${
            activeSpace === space ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white mr-3 ${
            colorForSpace(space)
          }`}>
            {space[0]}
          </div>
          {isOpen && <span>{space}</span>}
        </button>
      ))}
      <button className="flex items-center px-4 py-2 text-sm text-blue-500 hover:underline mt-2">
        + Add Space
      </button>
    </div>
  );
}

function colorForSpace(space: string) {
  const map: Record<string, string> = {
    Marketing: "bg-green-500",
    Product: "bg-red-500",
    Engineering: "bg-yellow-500",
    Design: "bg-blue-500",
    Finance: "bg-purple-500",
    HR: "bg-orange-500",
  };

  return map[space] || "bg-gray-400";
}

