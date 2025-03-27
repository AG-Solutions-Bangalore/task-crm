import Layout from "@/components/Layout";

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, ChevronDown, Edit, Loader2, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Base_Url } from "@/config/BaseUrl";
import CreateTask from "./CreateTask";
import Loader from "@/components/loader/Loader";
import ErrorLoader from "@/components/loader/ErrorLoader";

const AllTaskList = () => {
  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-task-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.task;
    },
  });

  // State for users table
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate()

  // Define columns for the users table
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "project_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("project_name")}</div>,
    },
    {
      accessorKey: "task_title",
      header: "Task",
      cell: ({ row }) => <div>{row.getValue("task_title")}</div>,
    },
    {
      accessorKey: "from_name",
      header: "From",
      cell: ({ row }) => <div>{row.getValue("from_name")}</div>,
    },
    {
      accessorKey: "to_name",
      header: "To",
      cell: ({ row }) => <div>{row.getValue("to_name")}</div>,
    },
    {
      accessorKey: "task_desc",
      header: "Desc",
      cell: ({ row }) => <div>{row.getValue("task_desc")}</div>,
    },
    {
      accessorKey: "task_created",
      header: "created",
      cell: ({ row }) => <div>{row.getValue("task_created")}</div>,
    },
    {
      accessorKey: "task_due_date",
      header: "Due",
      cell: ({ row }) => <div>{row.getValue("task_due_date")}</div>,
    },
    {
      accessorKey: "task_priority",
      header: "Priority",
      cell: ({ row }) => <div>{row.getValue("task_priority")}</div>,
    },
    {
      accessorKey: "task_status",
      header: "Status",
      cell: ({ row }) => <div>{row.getValue("task_status")}</div>,
    },
   
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const taskId = row.original.id;

        return (
          <div className="flex flex-row">
            {/* <EditUserDialog onSuccess={refetch} userId={userId} /> */}
          </div>
        );
      },
    },
  ];

  // Create the table instance for users
 const table = useReactTable({
     data: task || [],
     columns,
     onSortingChange: setSorting,
     onColumnFiltersChange: setColumnFilters,
     getCoreRowModel: getCoreRowModel(),
     getPaginationRowModel: getPaginationRowModel(),
     getSortedRowModel: getSortedRowModel(),
     getFilteredRowModel: getFilteredRowModel(),
     onColumnVisibilityChange: setColumnVisibility,
     onRowSelectionChange: setRowSelection,
     state: {
       sorting,
       columnFilters,
       columnVisibility,
       rowSelection,
     },
     initialState: {
       pagination: {
         pageSize: 7,
       },
     },
   });

  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <Loader/>
      </Layout>
    );
  }

  // Render error state
  if (isError) {
    return ( 
      <Layout>
      <ErrorLoader onSuccess={refetch}/>
      </Layout>
    );
  }
  return (
   <Layout>
   <div className="w-full p-4 ">
                <div className="flex text-left text-2xl text-gray-800 font-[400]">
                  Task List
                </div>
                {/* searching and column filter  */}
                <div className="flex items-center py-4">
                  <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search user..."
                      value={table.getState().globalFilter || ""}
                      onChange={(event) => table.setGlobalFilter(event.target.value)}
                      className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
              
                  {/* <CreateTask onSuccess={refetch} /> */}
                </div>
                {/* table  */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                               className=""
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* row slection and pagintaion button  */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Total Tasks : &nbsp;
                    {table.getFilteredRowModel().rows.length}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
   </Layout>
  )
}

export default AllTaskList