import { useState } from "react";

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  Loader2,
  Search
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const CompanyList = () => {
      const { toast } = useToast();
    const {
        data: company,
        isLoading,
        isError,
        refetch,
      } = useQuery({
        queryKey: ["company"],
        queryFn: async () => {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${Base_Url}/api/panel-fetch-company-list`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data.company;
        },
      });
       const [sorting, setSorting] = useState([]);
        const [columnFilters, setColumnFilters] = useState([]);
        const [columnVisibility, setColumnVisibility] = useState({});
        const [rowSelection, setRowSelection] = useState({});
        const navigate = useNavigate();
      
        // Define columns for the table
        const columns = [
          {
            accessorKey: "company_type",
            header: "Company Type",
            cell: ({ row }) => <div>{row.getValue("company_type")}</div>,
          },
          {
            accessorKey: "company_name",
            header: "Company",
            cell: ({ row }) => <div>{row.getValue("company_name")}</div>,
          },
      
          {
            accessorKey: "contract_no",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Contract No
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("contract_no")}</div>,
          },
          {
            accessorKey: "company_mobile",
            header: "Mobile",
            cell: ({ row }) => <div>{row.getValue("company_mobile")}</div>,
          },
          {
            accessorKey: "company_email",
            header: "Email",
            cell: ({ row }) => <div>{row.getValue("company_email")}</div>,
          },
          {
            accessorKey: "company_status",
            header: "Status",
            cell: ({ row }) => {
              const status = row.getValue("company_status");
      
              const statusColors = {
     
                Active: "bg-green-100 text-green-800",
                Inactive: "bg-red-100 text-red-800",
              };
      
              return (
                <span
                  className={`px-2 py-1 rounded text-xs ${statusColors[status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                  {status}
                </span>
              );
            },
          },
      
          {
            id: "actions",
            header: "Action",
            cell: ({ row }) => {
              const companyId = row.original.id;

      
              return (
                <div className="flex flex-row">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/company/view/${companyId}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                      </TooltipTrigger>
                      <TooltipContent>View Company</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                
                </div>
              );
            },
          },
        ];
      
        // Create the table instance
        const table = useReactTable({
          data: company || [],
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
      
        if (isLoading) {
            return (
             <Layout>
                <div className="flex justify-center items-center h-full">
                  <Button disabled>
                    <Loader2 className=" h-4 w-4 animate-spin" />
                    Loading Company List Data
                  </Button>
                </div>
                </Layout>
            );
          }
        
      
          if (isError) {
            return (
              <Layout>
                <Card className="w-full max-w-md mx-auto mt-10">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Error Fetching Company List Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => refetch()} variant="outline">
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
                </Layout>
            );
          }
    return (
        <Layout>
            <div className="w-full p-4 ">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Company List
        </div>
        {/* searching and column filter  */}
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search company..."
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
            Total Company : &nbsp;
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

export default CompanyList