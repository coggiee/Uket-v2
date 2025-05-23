import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uket/ui/components/ui/table";
import PaginationControls from "../../../../../../components/pagination-controls";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  pageCount: number;
}

export default function UserDataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  setPageIndex,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    sortDescFirst: false,
    initialState: {
      sorting: [
        {
          id: "id",
          desc: false, // sort by name in descending order by default
        },
      ],
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize: 10,
      },
    },
    state: {
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="relative">
      <main className="flex grow flex-col gap-8 rounded-lg bg-white shadow-sm min-h-[564px]">
        <section className="px-3 pb-6 pr-14 pt-3">
          <Table>
            <TableHeader className="[&_tr]:border-none">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="text-center text-sm font-normal text-[#8989A1]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-none"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className="p-3 text-center text-base font-medium text-desc"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-desc"
                  >
                    내역이 없어요
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </main>
      <PaginationControls
        currentPage={pageIndex}
        totalPages={pageCount}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
