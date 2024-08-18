import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="w-96">
      <Skeleton className="w-36 h-8" />
      <Skeleton className="w-80 h-4 mt-2" />
      <Skeleton className="w-96 h-12 mt-12" />
      <Skeleton className="w-96 h-12 mt-4" />
      <Skeleton className="w-96 h-12 mt-8" />
    </div>
  );
}
export default Loading;
