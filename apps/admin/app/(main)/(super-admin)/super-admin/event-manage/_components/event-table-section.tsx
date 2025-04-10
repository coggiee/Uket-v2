"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/components/ui/badge";
import { cn } from "@ui/lib/utils";
import { useQueryAdminEventInfoList } from "@uket/api/queries/admin-event-info";
import { Content } from "@uket/api/types/admin-event";
import { useMemo } from "react";
import StatusSelector from "../../../../../../components/status-selector";
import { useEventManageParams } from "../../../../../../hooks/use-event-manage-params";
import EventTable from "./event-table";
import EventTypeFilter, { EventType } from "./event-type-filter";

export type Entry = Content;

export const columns = (
  pageIndex: number,
  selectedEventType: EventType,
  setSelectedEventType: (value: EventType) => void,
): ColumnDef<Entry>[] => [
  {
    id: "rowNumber",
    header: "번호",
    cell: ({ row }) => {
      return (pageIndex - 1) * 10 + row.index + 1;
    },
  },
  {
    accessorKey: "eventName",
    header: "행사명",
  },
  {
    accessorKey: "organizationName",
    header: "주최명",
  },
  {
    accessorKey: "eventType",
    header: () => (
      <div className="flex justify-center">
        <EventTypeFilter
          value={selectedEventType}
          onSelect={setSelectedEventType}
        />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="rounded-lg border border-[#8989A1] px-1 py-px">
          {row.original.eventType === "FESTIVAL" ? "축제" : "공연"}
        </div>
      );
    },
  },
  {
    accessorKey: "eventDate",
    header: "행사 날짜",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.eventStartDate} ~ {row.original.eventEndDate}
        </div>
      );
    },
  },
  {
    accessorKey: "ticketingStartDateTime",
    header: "티켓 오픈 날짜",
  },
  {
    accessorKey: "registrationStatus",
    header: "행사 등록 상태",
    cell: ({ row }) => {
      const uketEventRegistrationId = row.original.uketEventRegistrationId;
      const registationStatus = row.original.registrationStatus;
      const eventName = row.original.eventName;

      return (
        <div className="flex justify-center">
          <StatusSelector
            isTicket={false}
            key={uketEventRegistrationId}
            id={uketEventRegistrationId}
            status={registationStatus}
            name={eventName}
            page={pageIndex}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "eventInfo",
    header: () => <div>행사 정보</div>,
    cell: ({ row }) => {
      const registrationStatus = row.original.registrationStatus;
      const isEditable = ["검수 진행", "검수 완료"].includes(
        registrationStatus,
      );

      const style = isEditable
        ? "bg-[#F0EDFD] text-brand hover:bg-[#F0EDFD]"
        : "bg-[#F2F2F2] text-[#CCCCCC] cursor-not-allowed";

      const content = isEditable ? "수정하기" : "수정 불가";

      return (
        <Badge
          className={cn(
            "h-8 w-28 justify-center rounded-lg text-base cursor-pointer font-medium",
            style,
          )}
        >
          {content}
        </Badge>
      );
    },
  },
];

export default function EventTableSection() {
  const { page, eventType, updateQuery } = useEventManageParams();

  const { data } = useQueryAdminEventInfoList({
    page,
  });

  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (eventType === "ALL") return data.timezoneData;
    return data.timezoneData.filter(entry => entry.eventType === eventType);
  }, [data, eventType]);

  const pageCount = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData]);

  return (
    <section className="flex flex-col gap-3">
      <EventTable
        columns={columns(page, eventType, newType =>
          updateQuery({ eventType: newType }),
        )}
        data={filteredData}
        pageIndex={page}
        setPageIndex={newPage => updateQuery({ page: newPage })}
        pageCount={pageCount || 1}
      />
    </section>
  );
}
