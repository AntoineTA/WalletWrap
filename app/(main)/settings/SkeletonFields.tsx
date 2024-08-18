import { Skeleton } from "@/components/ui/skeleton";

function SkeletonFields() {
  return (
    <div className="mt-4 flex flex-col gap-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
export default SkeletonFields;
