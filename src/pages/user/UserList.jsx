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
import { Base_Url, NoImage, UserImage } from "@/config/BaseUrl";
import CreateUserDialog from "@/components/createUserDialog/CreateUserDialog";
import EditUserDialog from "@/components/editUserDialog/EditUserDialog";
import ErrorLoader from "@/components/loader/ErrorLoader";
import Loader from "@/components/loader/Loader";
import moment from "moment";
import useApiToken from "@/components/common/UseToken";
import TaskDialog from "../task/ImageTask";
import ImageDialog from "./ImageDialog";

const UserList = () => {
  const token = useApiToken();
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-user-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.user;
    },
  });

  // State for users table
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  // Define columns for the users table
  const columns = [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    // {
    //   accessorKey: "user_image",
    //   header: "Image",
    //   cell: ({ row }) => {
    //     const [isLoading, setIsLoading] = useState(true);
    //     const userImageUrl = row.getValue("user_image");

    //     const handleImageLoad = () => {
    //       setIsLoading(false);
    //     };

    //     if (!userImageUrl) {
    //       return (
    //         <img
    //           src={NoImage}
    //           alt="User"
    //           className="rounded-full w-12 h-12 object-cover"
    //           onLoad={handleImageLoad}
    //           style={{ display: isLoading ? "none" : "block" }}
    //         />
    //       );
    //     }

    //     return (
    //       <div className="flex items-center justify-center relative">
    //         {isLoading && (
    //           <div className="absolute flex items-center justify-center">
    //             <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
    //           </div>
    //         )}

    //         <img
    //           src={`${UserImage}/${userImageUrl}`}
    //           alt="User"
    //           className="rounded-full w-12 h-12 object-cover"
    //           onLoad={handleImageLoad}
    //           style={{ display: isLoading ? "none" : "block" }}
    //         />
    //       </div>
    //     );
    //   },
    // },

    {
      accessorKey: "user_image",
      header: "Image",
      cell: ({ row }) => {
        const [isLoading, setIsLoading] = useState(true);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const userImageUrl = row.getValue("user_image");
        const userName = row.getValue("name");

        const handleImageLoad = () => {
          setIsLoading(false);
        };

        const handleImageClick = () => {
          if (userImageUrl) {
            setIsDialogOpen(true);
          }
        };

        return (
          <>
            <div className="flex items-center justify-center relative">
              {isLoading && (
                <div className="absolute flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              )}

              <img
                src={userImageUrl ? `${UserImage}/${userImageUrl}` : NoImage}
                alt="User"
                className="rounded-full w-12 h-12 object-cover cursor-pointer"
                onLoad={handleImageLoad}
                onClick={handleImageClick}
                style={{ display: isLoading ? "none" : "block" }}
              />
            </div>

            {/* TaskDialog Component */}
            {isDialogOpen && (
              <ImageDialog
                imageUrl={`${UserImage}/${userImageUrl}`}
                label={userName}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            )}
          </>
        );
      },
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "last_login",
      header: "Last Login",
      cell: ({ row }) => {
        const lastLogin = row.original.last_login;

        return (
          <div>{lastLogin ? moment(lastLogin).format("DD-MM-YYYY") : "-"}</div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
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
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const userId = row.original.id;

        return (
          <div className="flex flex-row">
            <EditUserDialog onSuccess={refetch} userId={userId} />
          </div>
        );
      },
    },
  ];

  // Create the table instance for users
  const table = useReactTable({
    data: user || [],
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
  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <Loader data="User" />
      </Layout>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Layout>
        <ErrorLoader onSuccess={refetch} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full p-4 ">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          User List
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

          <CreateUserDialog onSuccess={refetch} />
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
            Total User : &nbsp;
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

export default UserList;
