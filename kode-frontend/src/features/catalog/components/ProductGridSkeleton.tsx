import { Skeleton } from '@/components/ui/skeleton';

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-4">
                    <Skeleton className="aspect-[3/4] w-full rounded-2xl bg-zinc-900" />
                    <div className="space-y-2 px-1">
                        <Skeleton className="h-4 w-1/3 bg-zinc-900" />
                        <Skeleton className="h-6 w-3/4 bg-zinc-900" />
                        <Skeleton className="h-5 w-1/2 bg-zinc-900" />
                    </div>
                </div>
            ))}
        </div>
    );
}
