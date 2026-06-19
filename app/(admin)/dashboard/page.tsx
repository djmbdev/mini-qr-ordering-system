"use client";

import { SearchForm } from "@/components/ui/search-form";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  User,
  ShoppingCart,
  Clock,
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  Pencil,
  XCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  formatCurrency,
  formatDate,
  formatOrderItemsSummary,
  trimToDigits,
} from "@/lib/utils";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderItemView {
  product: {
    name: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: number;
  totalAmount: number;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt?: string | null;
  items?: OrderItemView[];
}

const ITEMS_PER_PAGE = 5;

const FILTER_LABELS: Record<string, string> = {
  all: "All Orders",
  pending: "Pending",
  completed: "Completed",
};

const getStatusBadgeClassName = (status: string) =>
  status === "completed"
    ? "bg-green-100 text-green-700 border-transparent hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
    : "bg-yellow-100 text-yellow-700 border-transparent hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";

const COLUMN_WIDTHS = {
  id: "w-[10%]",
  items: "w-[25%]",
  amount: "w-[13%]",
  status: "w-[13%]",
  date: "w-[17%]",
  action: "w-[22%]",
};

const HEADER_CELL_CLASS = "text-left align-middle px-4";
const DATA_CELL_CLASS = "text-left align-middle px-4";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const isMobile = useIsMobile();

  // Update confirm payment status change dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  // View order dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Test purposes only, dialog state for deleting a single order
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Test purposes only, dialog state for deleting all orders
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState<string | null>(null);

  // Merge duplicate line items by product into one row, summing quantities and price since price is captured per-line at order time
  const mergedViewItems = useMemo(() => {
    if (!viewOrder?.items) {
      return [];
    }

    const merged = new Map<
      string,
      { name: string; imageUrl: string; quantity: number; price: number }
    >();

    for (const item of viewOrder.items) {
      const key = item.product.name;
      const existing = merged.get(key);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.set(key, {
          name: item.product.name,
          imageUrl: item.product.imageUrl,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }

    return Array.from(merged.values());
  }, [viewOrder]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.orderNumber.toString().includes(searchQuery.toLowerCase()),
      );
    }

    const sorted = [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.orderNumber - b.orderNumber
        : b.orderNumber - a.orderNumber,
    );

    return sorted;
  }, [activeTab, orders, searchQuery, sortDirection]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );
  const currentPageSafe = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (currentPageSafe - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const openConfirmDialog = (order: Order) => {
    setSelectedOrder(order);
    setDialogError(null);
    setDialogOpen(true);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const openViewDialog = (order: Order) => {
    setViewOrder(order);
    setViewDialogOpen(true);
  };

  const handleUpdateFromView = () => {
    if (!viewOrder) {
      return;
    }
    setViewDialogOpen(false);
    openConfirmDialog(viewOrder);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedOrder) {
      return;
    }

    const nextStatus =
      selectedOrder.status === "pending" ? "completed" : "pending";

    setDialogLoading(true);
    setDialogError(null);

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setDialogError(errorData?.error ?? "Failed to update order");
        return;
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order,
        ),
      );
      // Keep the open view dialog in sync, reflects the new status
      setViewOrder((prev) =>
        prev && prev.id === updatedOrder.id
          ? { ...prev, ...updatedOrder }
          : prev,
      );
      setDialogOpen(false);
      toast.success(
        `Order #${updatedOrder.orderNumber} marked as ${updatedOrder.status}`,
      );
    } catch (error) {
      console.error("Failed to update order:", error);
      setDialogError("Failed to update order");
    } finally {
      setDialogLoading(false);
    }
  };

  // Test purposes only, deletes a single order via the DELETE endpoint
  const handleConfirmDelete = async () => {
    if (!orderToDelete) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/orders/${orderToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setDeleteError(errorData?.error ?? "Failed to delete order");
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderToDelete.id),
      );
      setDeleteDialogOpen(false);
      toast.success(`Order #${orderToDelete.orderNumber} deleted`);
    } catch (error) {
      console.error("Failed to delete order:", error);
      setDeleteError("Failed to delete order");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Test purposes only, deletes all orders via the DELETE endpoint
  const handleConfirmDeleteAll = async () => {
    setDeleteAllLoading(true);
    setDeleteAllError(null);

    try {
      const response = await fetch("/api/orders", { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setDeleteAllError(errorData?.error ?? "Failed to delete orders");
        return;
      }

      setOrders([]);
      setCurrentPage(1);
      setDeleteAllDialogOpen(false);
      toast.success("All orders deleted");
    } catch (error) {
      console.error("Failed to delete orders:", error);
      setDeleteAllError("Failed to delete orders");
    } finally {
      setDeleteAllLoading(false);
    }
  };

  // Test purposes only, opens the confirm dialog for deleting a single order
  const openDeleteDialog = (order: Order) => {
    setOrderToDelete(order);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className={`${COLUMN_WIDTHS.id} ${HEADER_CELL_CLASS}`}>
          <button
            type="button"
            onClick={toggleSortDirection}
            className="inline-flex items-center gap-1 hover:text-foreground"
            aria-label={`Sort by order number, currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
          >
            Order #
            {sortDirection === "asc" ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
        </TableHead>
        <TableHead className={`${COLUMN_WIDTHS.items} ${HEADER_CELL_CLASS}`}>
          Items
        </TableHead>
        <TableHead className={`${COLUMN_WIDTHS.amount} ${HEADER_CELL_CLASS}`}>
          Amount
        </TableHead>
        <TableHead className={`${COLUMN_WIDTHS.status} ${HEADER_CELL_CLASS}`}>
          Status
        </TableHead>
        <TableHead className={`${COLUMN_WIDTHS.date} ${HEADER_CELL_CLASS}`}>
          Date
        </TableHead>
        <TableHead className={`${COLUMN_WIDTHS.action} ${HEADER_CELL_CLASS}`}>
          Action
        </TableHead>
      </TableRow>
    </TableHeader>
  );

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow className="border-b">
          <TableCell colSpan={6} className="text-center py-8">
            Loading orders...
          </TableCell>
        </TableRow>
      );
    }

    if (paginatedOrders.length === 0) {
      return (
        <TableRow className="border-b">
          <TableCell colSpan={6} className="text-center py-8">
            {searchQuery
              ? "No orders found matching your search"
              : "No orders found"}
          </TableCell>
        </TableRow>
      );
    }

    return paginatedOrders.map((order, index) => {
      const isCompleted = order.status === "completed";
      const isLastRow = index === paginatedOrders.length - 1;

      return (
        <TableRow
          key={order.id}
          className={isLastRow ? "border-b!" : "border-b"}
        >
          <TableCell className={`font-semibold text-sm ${DATA_CELL_CLASS}`}>
            {order.orderNumber}
          </TableCell>
          <TableCell className={`text-sm ${DATA_CELL_CLASS}`}>
            <span
              className="block max-w-55 truncate"
              title={formatOrderItemsSummary(order.items)}
            >
              {formatOrderItemsSummary(order.items)}
            </span>
          </TableCell>
          <TableCell className={`font-semibold ${DATA_CELL_CLASS}`}>
            {formatCurrency(order.totalAmount)}
          </TableCell>
          <TableCell className={DATA_CELL_CLASS}>
            <div className="flex flex-col gap-1">
              <Badge className={getStatusBadgeClassName(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </TableCell>
          <TableCell className={`text-sm ${DATA_CELL_CLASS}`}>
            {formatDate(order.createdAt)}
          </TableCell>
          <TableCell className="align-middle px-2">
            <div className="flex items-center justify-start gap-2">
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => openViewDialog(order)}
              >
                <Eye className="size-4" />
                View
              </Button>
              <Button
                size="sm"
                disabled={isCompleted}
                className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-700"
                onClick={() => openConfirmDialog(order)}
              >
                <Pencil className="size-4" />
                Update
              </Button>
              {/* Test purposes only, deletes a single order */}
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                onClick={() => openDeleteDialog(order)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderMobileOrders = () => {
    if (loading) {
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading orders...
        </div>
      );
    }

    if (paginatedOrders.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {searchQuery
            ? "No orders found matching your search"
            : "No orders found"}
        </div>
      );
    }

    return paginatedOrders.map((order) => {
      const isCompleted = order.status === "completed";

      return (
        <div key={order.id} className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Order #{order.orderNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge className={getStatusBadgeClassName(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          <p
            className="truncate max-w-72 text-sm text-muted-foreground"
            title={formatOrderItemsSummary(order.items)}
          >
            {formatOrderItemsSummary(order.items)}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">
              {formatCurrency(order.totalAmount)}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => openViewDialog(order)}
              >
                <Eye className="size-4" />
                View
              </Button>
              <Button
                size="sm"
                disabled={isCompleted}
                className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-700"
                onClick={() => openConfirmDialog(order)}
              >
                <Pencil className="size-4" />
                Update
              </Button>
              {/* Test purposes only, deletes a single order */}
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                onClick={() => openDeleteDialog(order)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <SearchForm
            placeholder="Search..."
            className="mx-auto w-full max-w-xl"
          />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border text-primary-foreground  bg-primary px-3 py-2 text-sm font-medium shadow-sm md:flex">
          <User className="size-4" />
          Admin
        </div>
      </header>

      <div className="flex flex-1  w-full flex-col gap-4 p-4 overflow-hidden max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total Orders Card */}
          <Card className="flex flex-col items-start justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <ShoppingCart className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </Card>

          {/* Pending Orders Card */}
          <Card className="flex flex-col items-start justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                <Clock className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </Card>

          {/* Completed Orders Card */}
          <Card className="flex flex-col items-start justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Orders Table Section */}
        <Card className="flex flex-col overflow-hidden flex-1 py-2">
          <div className="w-full flex flex-col flex-1">
            {/* Search and Filter Header */}
            <div className="flex flex-col gap-2 border-b p-4 pb-5 sm:flex-row sm:items-center">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search by order #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(trimToDigits(e.target.value))}
                  className="pl-3"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 sm:hidden"
                  onClick={toggleSortDirection}
                  aria-label={`Sort by order number, currently ${sortDirection === "asc" ? "ascending" : "descending"}`}
                >
                  {sortDirection === "asc" ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 flex flex-1 items-center gap-2 sm:flex-initial"
                    >
                      <Filter className="size-4" />
                      {FILTER_LABELS[activeTab]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        setActiveTab("all");
                        setCurrentPage(1);
                      }}
                    >
                      All Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setActiveTab("pending");
                        setCurrentPage(1);
                      }}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setActiveTab("completed");
                        setCurrentPage(1);
                      }}
                    >
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Test purposes only, clears all orders to reset the order limit cap */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950"
                  onClick={() => {
                    setDeleteAllError(null);
                    setDeleteAllDialogOpen(true);
                  }}
                  aria-label="Delete all orders"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="hidden overflow-auto sm:block">
              <Table className="">
                {renderTableHeader()}
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </div>

            <div className="divide-y sm:hidden">{renderMobileOrders()}</div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 mt-auto">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}{" "}
                of {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPageSafe === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={
                          currentPageSafe === page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="size-8"
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPageSafe === totalPages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* View order dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg flex max-h-[85vh] flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {viewOrder ? `Order #${viewOrder.orderNumber}` : "Order"}
            </DialogTitle>
            <DialogDescription>
              {viewOrder ? formatDate(viewOrder.createdAt, true) : ""}
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusBadgeClassName(viewOrder.status)}>
                  {viewOrder.status.charAt(0).toUpperCase() +
                    viewOrder.status.slice(1)}
                </Badge>
                {viewOrder.status === "completed" && viewOrder.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(viewOrder.updatedAt, true)}
                  </span>
                )}
              </div>

              <div className="rounded-md border overflow-auto max-h-[50vh]">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[46%] text-left align-middle">
                        Item
                      </TableHead>
                      <TableHead className="w-[14%] text-center align-middle">
                        Qty
                      </TableHead>
                      <TableHead className="w-[20%] text-right align-middle">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[20%] text-right align-middle">
                        Subtotal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mergedViewItems.length > 0 ? (
                      mergedViewItems.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="text-left">
                            <div className="flex min-w-0 items-center gap-3">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="size-15 rounded-md border object-cover shrink-0"
                              />
                              <span
                                className="min-w-0 flex-1 truncate"
                                title={item.name}
                              >
                                {item.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-sm text-muted-foreground py-4"
                        >
                          No items found for this order
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Total
                </span>
                <span className="text-base font-semibold">
                  {formatCurrency(viewOrder.totalAmount)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateFromView}
              disabled={viewOrder?.status === "completed"}
            >
              <Pencil className="size-4" />
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm payment status update dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm payment update</DialogTitle>
            <DialogDescription>
              {selectedOrder ? (
                <span>
                  Change payment status for{" "}
                  <strong>Order #{selectedOrder.orderNumber}</strong> from{" "}
                  <strong>{selectedOrder.status}</strong> to{" "}
                  <strong>
                    {selectedOrder.status === "pending"
                      ? "completed"
                      : "pending"}
                  </strong>
                  .
                </span>
              ) : (
                <span>Select an order to update.</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {dialogError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {dialogError}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleConfirmUpdate}
              disabled={dialogLoading || !selectedOrder}
            >
              <Pencil className="size-4" />
              {dialogLoading
                ? "Saving..."
                : selectedOrder?.status === "pending"
                  ? "Mark as Completed"
                  : "Mark as Pending"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test purposes only, confirm dialog for deleting a single order */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete order</DialogTitle>
            <DialogDescription>
              {orderToDelete ? (
                <span>
                  This deletes{" "}
                  <strong>Order #{orderToDelete.orderNumber}</strong> and its
                  items. This is a test utility for resetting the cart&apos;s
                  maximum of 10 orders during testing. This action cannot be
                  undone.
                </span>
              ) : (
                <span>Select an order to delete.</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {deleteError}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteLoading || !orderToDelete}
            >
              <Trash2 className="size-4" />
              {deleteLoading ? "Deleting..." : "Delete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test purposes only, confirm dialog for deleting a single order */}
      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all orders</DialogTitle>
            <DialogDescription>
              This deletes <strong>all {totalOrders} order(s)</strong> in the
              database. This is a test utility for resetting the cart&apos;s
              maximum of 10 orders during testing. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteAllError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {deleteAllError}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteAll}
              disabled={deleteAllLoading || totalOrders === 0}
            >
              <Trash2 className="size-4" />
              {deleteAllLoading ? "Deleting..." : "Delete All Orders"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster
        position={isMobile ? "top-center" : "bottom-left"}
        icons={{
          success: <CheckCircle2 className="size-4 text-green-500" />,
          error: <XCircle className="size-4 text-red-500" />,
        }}
      />
    </SidebarInset>
  );
}
