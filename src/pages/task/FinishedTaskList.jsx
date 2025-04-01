import useApiToken from "@/components/common/UseToken";
import Layout from "@/components/Layout";
import ErrorLoader from "@/components/loader/ErrorLoader";
import Loader from "@/components/loader/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Base_Url, TaskImage } from "@/config/BaseUrl";
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
  MessageCircleMore,
  Search,
  View,
} from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import TaskDialog from "./ImageTask";

const FinishedTaskList = () => {
  const token = useApiToken();
  const navigate = useNavigate();
  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-task-finish-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.task;
    },
  });

  // State for table
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
  const userType = useSelector((state) => state.auth.user_type);
  const projectTypesWithCounts = useMemo(() => {
    if (!task) return [];

    const typeCounts = task.reduce((acc, t) => {
      acc[t.project_type] = (acc[t.project_type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
    }));
  }, [task]);

  const totalTaskCount = useMemo(() => {
    if (!task) return 0;
    return task.length;
  }, [task]);

  const filteredTasks = useMemo(() => {
    if (!task) return [];
    if (projectTypeFilter === "all") return task;
    return task.filter((t) => t.project_type === projectTypeFilter);
  }, [task, projectTypeFilter]);

  const statusColors = {
    Pending: "bg-yellow-400 text-black", // Brighter Yellow for readability
    Approved: "bg-blue-500 text-white", // Blue
    "In Process": "bg-teal-500 text-white", // Teal (more distinct than cyan)
    Cancel: "bg-red-600 text-white", // Darker Red for better contrast
    Completed: "bg-green-500 text-white", // Green
    Finish: "bg-green-700 text-white", // Darker Green to differentiate from Completed
    default: "bg-gray-500 text-white", // Slightly darker Gray for better visibility
  };

  const columns = [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
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
      accessorKey: "project_type",
      header: "Project Type",
      cell: ({ row }) => <div>{row.getValue("project_type")}</div>,
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

      cell: ({ row }) => (
        <div
          className="col-span-3 px-3 py-2 text-sm resize-none overflow-hidden   w-72"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {row.getValue("task_desc")}
        </div>
      ),
    },

    {
      accessorKey: "task_created",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("task_created");
        return <div>{date ? moment(date).format("DD-MM-YYYY") : "N/A"}</div>;
      },
    },
    {
      accessorKey: "task_due_date",
      header: "Due",
      cell: ({ row }) => {
        const date = row.getValue("task_due_date");
        return <div>{date ? moment(date).format("DD-MM-YYYY") : "N/A"}</div>;
      },
    },
    {
      accessorKey: "task_priority",
      header: "Priority",
      cell: ({ row }) => <div>{row.getValue("task_priority")}</div>,
    },

    {
      accessorKey: "task_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("task_status");

        return (
          <span
            className={`rounded-md px-2 py-1 text-sm resize-none overflow-hidden  ${
              statusColors[status] || statusColors.default
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
        const taskId = row.original.id;
        const taskImg = row.original.task_img;
        const imageUrl = taskImg ? `${TaskImage}${taskImg}` : null;
        return (
          <div className="flex flex-row">
            {/* {userType === 2 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`transition-all duration-200 hover:bg-blue-50`}
                      onClick={() =>
                        navigate(`/task-create-comment/${taskId}`, {
                          state: {
                            label: "Create Comment",
                            comment: true,
                          },
                        })
                      }
                    >
                      <MessageCircleMore
                        className={`h-4 w-4 transition-all duration-200 hover:text-blue-500`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Comment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`transition-all duration-200 hover:bg-blue-50`}
                    onClick={() =>
                      navigate(`/task-view-task/${taskId}`, {
                        state: {
                          label: "View Task",
                          comment: true,
                        },
                      })
                    }
                  >
                    <View
                      className={`h-4 w-4 transition-all duration-200 hover:text-blue-500`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TaskDialog imageUrl={imageUrl} label="Task Image" />

            {/* <EditTask onSuccess={refetch} taskId={taskId} /> */}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredTasks || [],
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
        <Loader data="Task" />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <ErrorLoader onSuccess={refetch} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full p-4">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Finished Task List
        </div>

        <div className="flex flex-col md:flex-row items-center py-4 gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search finished tasks..."
              value={table.getState().globalFilter || ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
            />
          </div>

          <div className="flex gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
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

            <CreateTask onSuccess={refetch} />
          </div>
        </div>
        <div className=" mb-2 overflow-x-auto">
          <Tabs
            value={projectTypeFilter}
            onValueChange={setProjectTypeFilter}
            className="w-full"
          >
            <TabsList className="flex w-full justify-between md:justify-start gap-2">
              <TabsTrigger
                value="all"
                className="flex-1 md:flex-initial whitespace-nowrap"
              >
                All Projects
                <Badge variant="secondary" className="ml-2">
                  {totalTaskCount}
                </Badge>
              </TabsTrigger>
              {projectTypesWithCounts.map(({ type, count }) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="flex-1 md:flex-initial whitespace-nowrap"
                >
                  {type}
                  <Badge variant="secondary" className="ml-2">
                    {count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="bg-gray-50">
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
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} task(s)
          </div>
          <div className="flex gap-2">
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

export default FinishedTaskList;
