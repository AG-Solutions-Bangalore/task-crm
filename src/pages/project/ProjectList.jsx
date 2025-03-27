import Layout from "@/components/Layout";
<<<<<<< HEAD

=======
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
>>>>>>> 5c421563ea55967807d0b0abb70025809034b63f
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
import { Base_Url } from "@/config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, ChevronDown, Loader2, Search } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";
import ErrorLoader from "@/components/loader/ErrorLoader";
import Loader from "@/components/loader/Loader";

const ProjectList = () => {
  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-project-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.project;
    },
  });

  // State for users table
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

 
  const getProjectDetails = (project) => {
    const types = project.project_types?.split(',') || [];
    const dates = project.project_due_dates?.split(',') || [];
    const subStatuses = project.projectSub_statuses?.split(',') || [];
    
    const maxLength = Math.max(types.length, dates.length, subStatuses.length);
    const details = [];
    
    for (let i = 0; i < maxLength; i++) {
      details.push({
        type: types[i] || '-',
        date: dates[i] ? moment(dates[i]).format("DD-MM-YYYY") : '-',
        subStatus: subStatuses[i] || '-'
      });
    }
    
    return details;
  };

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
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("project_name")}</div>,
    },
    {
      accessorKey: "project_desc",
      header: "Desc",
      cell: ({ row }) => <div>{row.getValue("project_desc")}</div>,
    },
    {
      accessorKey: "project_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("project_status");
        return (
          <span
            className={status === "Active" ? "text-green-600" : "text-red-600"}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "project_details",
      header: "Project Details",
      cell: ({ row }) => {
        const details = getProjectDetails(row.original);
        return (
          <div className="space-y-1">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium">{detail.type}</span>
                <span>-</span>
                <span>{detail.date}</span>
                <span>-</span>
                <span className={detail.subStatus === "Confirmed" ? "text-green-600" : "text-red-600"}>
                  {detail.subStatus}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const projectId = row.original.id;
        return (
          <div className="flex flex-row">
            <EditProject projectId={projectId} onSuccess={refetch} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: project || [],
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
          Projects List
        </div>
        {/* searching and column filter  */}
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search project..."
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

          <CreateProject onSuccess={refetch} />
        </div>
        {/* table  */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="">
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
            Total Projects : &nbsp;
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
  );
};

export default ProjectList;