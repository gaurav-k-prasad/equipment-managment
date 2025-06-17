
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"; // Removed CalendarClock
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Badge } from "@/components/ui/badge";
import type { Equipment } from "@/types";
import { Timestamp } from "firebase/firestore";
// import { useAuth } from "@/context/AuthContext"; // No longer needed
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EquipmentTableProps {
  data: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipmentId: string) => void;
  onViewDetails?: (equipmentId: string) => void;
  isLoading?: boolean;
  columnVisibilityInitial?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onSelectionChange?: (selectedRows: Equipment[]) => void;
  enableRowSelection?: boolean;
}

export function EquipmentTable({
  data,
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
  columnVisibilityInitial: controlledVisibilityProp,
  onColumnVisibilityChange: onControlledVisibilityChange,
  onSelectionChange,
  enableRowSelection = false, // Default can be true now if desired, or controlled by parent
}: EquipmentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  // const { isAdmin } = useAuth(); // No longer needed

  const isVisibilityControlled = typeof onControlledVisibilityChange === 'function';
  
  const [uncontrolledVisibilityState, setUncontrolledVisibilityState] = React.useState<VisibilityState>(
    () => controlledVisibilityProp ?? {}
  );

  const currentColumnVisibility = isVisibilityControlled 
    ? (controlledVisibilityProp ?? {}) 
    : uncontrolledVisibilityState;

  const handleTableVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    const newVisibility = typeof updater === 'function' ? updater(currentColumnVisibility) : updater;
  
    if (isVisibilityControlled) {
      onControlledVisibilityChange(newVisibility);
    } else {
      setUncontrolledVisibilityState(newVisibility);
    }
  };
  
  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "N/A";
    try {
      return format(timestamp.toDate(), "PPP");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const isWarrantyExpiringSoon = (expiryDate: Timestamp | null | undefined): boolean => {
    if (!expiryDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date(new Date().setDate(today.getDate() + 30));
    return expiryDate.toDate() <= thirtyDaysFromNow && expiryDate.toDate() >= today;
  };

  const isWarrantyExpired = (expiryDate: Timestamp | null | undefined): boolean => {
    if (!expiryDate) return false;
    return expiryDate.toDate() < new Date();
  };

  const columns: ColumnDef<Equipment>[] = [
    ...(enableRowSelection ? [{
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }] : []),
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
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Equipment["status"];
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (status === "Available") variant = "default"; 
        else if (status === "In Use") variant = "secondary";
        else if (status === "Maintenance") variant = "outline"; 
        else if (status === "Retired") variant = "destructive";
        return <Badge variant={variant} className={cn(status === "Available" && "bg-green-500/20 text-green-700 border-green-500/30", status === "Maintenance" && "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" )}>{status}</Badge>;
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "serialNumber",
      header: "Serial Number",
      id: 'serialNumber',
    },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) => formatDate(row.getValue("purchaseDate")),
      id: 'purchaseDate',
    },
    {
      accessorKey: "warrantyExpiryDate",
      header: "Warranty Expiry",
      cell: ({ row }) => {
        const expiryDate = row.getValue("warrantyExpiryDate") as Timestamp | null;
        const expiringSoon = isWarrantyExpiringSoon(expiryDate);
        const expired = isWarrantyExpired(expiryDate);
        return (
          <div className="flex items-center gap-1">
            {formatDate(expiryDate)}
            {(expiringSoon || expired) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className={cn("h-4 w-4", expiringSoon && "text-yellow-500", expired && "text-destructive")} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{expired ? "Warranty Expired!" : "Warranty expiring soon!"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      id: 'warrantyExpiryDate',
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      id: 'assignedTo',
      cell: ({ row }) => row.getValue("assignedTo") || "N/A",
    },
    {
      accessorKey: "location",
      header: "Location",
      id: 'location',
      cell: ({ row }) => row.getValue("location") || "N/A",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const equipment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onViewDetails && (
                <DropdownMenuItem asChild>
                  <Link href={`/equipment/${equipment.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </Link>
                </DropdownMenuItem>
              )}
              {/* isAdmin check removed, actions always available */}
              <DropdownMenuItem onClick={() => onEdit(equipment)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(equipment.id)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleTableVisibilityChange,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: currentColumnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize: 10 }
    },
    enableRowSelection: enableRowSelection ?? false,
  });
  
  React.useEffect(() => {
    if (onSelectionChange && table) {
      const selectedEquipment = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedEquipment);
    }
  }, [rowSelection, onSelectionChange, table]); // table is a valid dependency here

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(data.map(item => item.category));
    return Array.from(categories);
  }, [data]);

  const uniqueStatuses = React.useMemo(() => {
    const statuses = new Set(data.map(item => item.status));
    return Array.from(statuses);
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-9"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-9">
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
                    {column.id === "serialNumber" ? "Serial Number" : 
                     column.id === "purchaseDate" ? "Purchase Date" :
                     column.id === "warrantyExpiryDate" ? "Warranty Expiry" :
                     column.id === "assignedTo" ? "Assigned To" :
                     column.id.replace(/([A-Z])/g, ' $1') 
                    }
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Category <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuCheckboxItem
                checked={!table.getColumn("category")?.getFilterValue()}
                onCheckedChange={() => table.getColumn("category")?.setFilterValue(undefined)}
              >
                All
              </DropdownMenuCheckboxItem>
            {uniqueCategories.map(category => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={(table.getColumn("category")?.getFilterValue() as string[] || []).includes(category)}
                onCheckedChange={(checked) => {
                  const currentFilter = table.getColumn("category")?.getFilterValue() as string[] || [];
                  if (checked) {
                    table.getColumn("category")?.setFilterValue([...currentFilter, category]);
                  } else {
                    table.getColumn("category")?.setFilterValue(currentFilter.filter(c => c !== category));
                  }
                }}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
                checked={!table.getColumn("status")?.getFilterValue()}
                onCheckedChange={() => table.getColumn("status")?.setFilterValue(undefined)}
              >
                All
              </DropdownMenuCheckboxItem>
            {uniqueStatuses.map(status => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={(table.getColumn("status")?.getFilterValue() as string[] || []).includes(status)}
                 onCheckedChange={(checked) => {
                  const currentFilter = table.getColumn("status")?.getFilterValue() as string[] || [];
                  if (checked) {
                    table.getColumn("status")?.setFilterValue([...currentFilter, status]);
                  } else {
                    table.getColumn("status")?.setFilterValue(currentFilter.filter(s => s !== status));
                  }
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        {enableRowSelection && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
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
  );
}
