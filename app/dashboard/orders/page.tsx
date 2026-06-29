"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiLoader, 
  FiTrash2, 
  FiEye,
  FiRefreshCw,
  FiTruck,
  FiShoppingBag,
  FiCheck,
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiInfo,
  FiCalendar,
  FiDollarSign,
  FiCreditCard
} from "react-icons/fi";

// All available status options
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", description: "Order placed, waiting for approval", color: "bg-yellow-100 text-yellow-600", icon: FiClock },
  { value: "approved", label: "Approved", description: "Order approved, preparing for dispatch", color: "bg-blue-100 text-blue-600", icon: FiCheckCircle },
  { value: "processing", label: "Processing", description: "Order is being processed", color: "bg-purple-100 text-purple-600", icon: FiPackage },
  { value: "shipped", label: "Shipped", description: "Order has been shipped", color: "bg-indigo-100 text-indigo-600", icon: FiTruck },
  { value: "out_for_delivery", label: "Out for Delivery", description: "Order is on the way", color: "bg-cyan-100 text-cyan-600", icon: FiTruck },
  { value: "delivered", label: "Delivered", description: "Order has been delivered", color: "bg-green-100 text-green-600", icon: FiCheck },
  { value: "completed", label: "Completed", description: "Order completed successfully", color: "bg-emerald-100 text-emerald-600", icon: FiCheckCircle },
  { value: "cancelled", label: "Cancelled", description: "Order has been cancelled", color: "bg-red-100 text-red-600", icon: FiXCircle },
  { value: "refunded", label: "Refunded", description: "Order has been refunded", color: "bg-orange-100 text-orange-600", icon: FiRefreshCw },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch orders from database
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusParam = activeTab !== "all" ? `?status=${activeTab}` : "";
      const response = await fetch(`/api/orders${statusParam}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!orderId) {
      console.error("Order ID is missing!");
      alert("Error: Order ID not found");
      return;
    }

    try {
      setUpdatingStatus(true);
      
      console.log("Sending PUT request to ID:", orderId);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to update");

      alert("Order status updated!");
      fetchOrders();
      setShowStatusModal(false);
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'message' in err)
        ? (err as any).message
        : String(err);
      alert(msg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      await fetchOrders();
      setShowDeleteModal(false);
      setSelectedOrder(null);
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // View order details
  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusInfo = (status?: string) => {
    const statusInfo = STATUS_OPTIONS.find(s => s.value === status?.toLowerCase());
    return statusInfo || STATUS_OPTIONS[0];
  };

  const getStatusColor = (status?: string) => {
    return getStatusInfo(status).color;
  };

  const getStatusIcon = (status?: string) => {
    const Icon = getStatusInfo(status).icon;
    return <Icon />;
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatAmount = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getCustomerName = (order: any) => {
    return order.formData?.name || 
           order.customer || 
           order.formData?.fullName || 
           "Unknown Customer";
  };

  // Get available statuses for the order (excluding current)
  const getAvailableStatuses = (currentStatus?: string) => {
    return STATUS_OPTIONS.filter(s => s.value !== currentStatus?.toLowerCase());
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 text-sm">Manage your orders and deliveries</p>
        </div>
        <Link href="/orders/create">
          <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
            Create New Order
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", ...STATUS_OPTIONS.map(s => s.value)].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
              activeTab === tab
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tab === "all" ? "All Orders" : tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FiLoader className="animate-spin text-amber-500 text-3xl" />
          <span className="ml-3 text-gray-300">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-2 text-red-400 hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* No Orders State */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No orders found</p>
          <p className="text-gray-500 text-sm mt-2">Create a new order to get started</p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.orderStatus);
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {order.orderId || order._id?.toString().slice(-6) || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {getCustomerName(order)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {formatAmount(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2 ${statusInfo.color}`}>
                          {getStatusIcon(order.orderStatus)}
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1"
                          >
                            <FiEye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusModal(true);
                            }}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm inline-flex items-center gap-1"
                          >
                            <FiRefreshCw size={16} />
                            Status
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-700 font-medium text-sm inline-flex items-center gap-1"
                          >
                            <FiTrash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal with Complete Data */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiInfo className="text-blue-500" />
                  Complete Order Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiXCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Order Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FiPackage className="text-blue-500" />
                    Order Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Order ID</label>
                      <p className="text-gray-800 font-medium">{selectedOrder.orderId || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Status</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2 ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {getStatusIcon(selectedOrder.orderStatus)}
                        {getStatusInfo(selectedOrder.orderStatus).label}
                      </span>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Payment Method</label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <FiCreditCard className="text-gray-400" />
                        {selectedOrder.paymentMethod || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Order Date</label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FiUser className="text-green-500" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        {selectedOrder.formData?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        {selectedOrder.formData?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FiMapPin className="text-red-500" />
                    Delivery Address
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Division</label>
                      <p className="text-gray-800 capitalize">{selectedOrder.formData?.division || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">District</label>
                      <p className="text-gray-800 capitalize">{selectedOrder.formData?.district || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Thana/Upazila</label>
                      <p className="text-gray-800 capitalize">{selectedOrder.formData?.thana || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500">Detailed Address</label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <FiHome className="text-gray-400" />
                        {selectedOrder.formData?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Note */}
                {selectedOrder.formData?.note && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                      <FiInfo className="text-purple-500" />
                      Order Note
                    </h3>
                    <p className="text-gray-800">{selectedOrder.formData.note}</p>
                  </div>
                )}

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <FiDollarSign className="text-green-500" />
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Subtotal</label>
                      <p className="text-gray-800 font-medium">{formatAmount(selectedOrder.subtotal)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Delivery Charge</label>
                      <p className="text-gray-800 font-medium">{formatAmount(selectedOrder.deliveryCharge)}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500">Total Amount</label>
                      <p className="text-gray-900 font-bold text-lg">{formatAmount(selectedOrder.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                      <FiShoppingBag className="text-pink-500" />
                      Ordered Items ({selectedOrder.cartItems.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.cartItems.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                              <FiPackage className="text-pink-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.name || item.productName || "Item"}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-800">{formatAmount(item.price || 0)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiXCircle size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Current Status: <span className="font-semibold">{getStatusInfo(selectedOrder.orderStatus).label}</span>
            </p>
            <p className="text-gray-600 mb-4">
              Order #{selectedOrder.orderId || selectedOrder._id?.slice(-6)}
            </p>
            
            <div className="space-y-2 mb-6">
              {getAvailableStatuses(selectedOrder.orderStatus).map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateOrderStatus(selectedOrder._id, status.value)}
                  disabled={updatingStatus}
                  className="w-full px-4 py-3 rounded-lg text-left flex flex-col gap-1 hover:bg-gray-100 text-gray-700 border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 ml-1">{status.description}</p>
                </button>
              ))}
            </div>

            {updatingStatus && (
              <div className="flex items-center text-amber-600">
                <FiLoader className="animate-spin mr-2" />
                Updating status...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FiTrash2 className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Order</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete order #{selectedOrder.orderId || selectedOrder._id?.slice(-6)}? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrder(selectedOrder._id)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <div className="flex items-center">
                    <FiLoader className="animate-spin mr-2" />
                    Deleting...
                  </div>
                ) : (
                  "Delete Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}