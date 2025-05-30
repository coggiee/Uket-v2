import { HydrationBoundary } from "@uket/api";
import { prefetchAdminTicketList } from "@uket/api/queries/admin-ticket";
import { Skeleton } from "@uket/ui/components/ui/skeleton";
import { Suspense } from "react";
import NonAvailableSection from "../../../components/non-available-section";
import { checkUserAgent } from "../../../utils/check-user-agent";
import BookingManageSection from "./_components/booking-manage-section";

const LoadingFallback = () => (
  <div className="flex h-full flex-col gap-3">
    <div className="flex justify-between items-center">
      <Skeleton className="w-60 h-4" />
      <Skeleton className="w-60 h-8" />
    </div>
    <Skeleton className="w-full h-[800px]" />
    <div className="flex justify-center">
      <Skeleton className="h-6 w-60" />
    </div>
  </div>
);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const pageParam = (await searchParams).page;
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const isMobileDevice = await checkUserAgent();

  if (isMobileDevice) {
    return (
      <div className="flex h-full flex-col">
        <NonAvailableSection title="예매 내역 관리" />
      </div>
    );
  }

  const state = prefetchAdminTicketList(currentPage);

  return (
    <HydrationBoundary state={state}>
      <Suspense fallback={<LoadingFallback />}>
        <BookingManageSection />
      </Suspense>
    </HydrationBoundary>
  );
}
