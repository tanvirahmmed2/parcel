"use client";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, Filter, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { QA_MODAL } from "./CreateParcelModal"; 
import axios from "axios"; 
export default function ParcelTable({ initialData }) {
  const [data, setData] = useState(initialData || []);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const columns = [
    {
      accessorKey: "trackingId",
      header: "Tracking ID",
      cell: ({ row }) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{row.getValue("trackingId")}</span>,
    },
    {
      accessorKey: "receiverName",
      header: "Customer",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "district",
      header: "District",
    },
    {
      accessorKey: "codAmount",
      header: "COD",
      cell: ({ row }) => <span className="font-medium">৳{row.getValue("codAmount")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const val = row.getValue("status");
        let colors = "bg-slate-100 text-slate-700";
        if (val === "Delivered") colors = "bg-emerald-100 text-emerald-700";
        if (val === "Pending") colors = "bg-amber-100 text-amber-700";
        return <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors}`}>{val}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <button className="flex items-center gap-1 hover:text-black transition" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date <ArrowUpDown className="w-3 h-3" />
          </button>
        )
      },
      cell: ({ row }) => <span className="text-sm text-slate-500">{new Date(row.getValue("createdAt")).toLocaleDateString()}</span>,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });
  const refreshData = async () => {
    try {
      const res = await axios.get("/api/merchant/parcels");
      setData(res.data.parcels || []);
    } catch(e) {}
  };
  return (
    <div className="glass-panel rounded-2xl overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Order Management</h2>
          <p className="text-sm text-slate-500">View and manage dispatch statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={globalFilter ?? ""} 
              onChange={e => setGlobalFilter(e.target.value)} 
              placeholder="Search parcels..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left relative">
          <thead className="bg-slate-50/80 backdrop-blur text-slate-500 border-b border-slate-200 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 font-semibold whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-slate-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data?.length || 0)} of {data?.length || 0}
        </span>
        <div className="flex gap-2">
          <button 
            variant="outline" 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 text-sm font-medium"
          >
            Previous
          </button>
          <button 
            variant="outline" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
      {isModalOpen && <QA_MODAL onClose={() => setModalOpen(false)} onCreated={refreshData} />}
    </div>
  );
}
