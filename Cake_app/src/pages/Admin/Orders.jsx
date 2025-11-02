import { useState, useEffect } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const orderStatuses = [
    { value: "pending", label: "Pending", color: "bg-orange-500" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
    { value: "preparing", label: "Preparing", color: "bg-purple-500" },
    { value: "ready", label: "Ready", color: "bg-cyan-500" },
    { value: "delivered", label: "Delivered", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  ];

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("Admin token missing!");

      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      const ordersData = data.orders || data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Search Orders
  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const t = term.toLowerCase();
    const filtered = orders.filter(
      (o) =>
        o._id?.toLowerCase().includes(t) ||
        o.user?.name?.toLowerCase().includes(t) ||
        o.user?.email?.toLowerCase().includes(t)
    );
    setFilteredOrders(filtered);
  };

  // ✅ Update Order Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated!");
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* ✅ Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
            <h2 className="text-sm text-gray-600">Total Orders</h2>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
            <h2 className="text-sm text-gray-600">Pending Orders</h2>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow text-center">
            <h2 className="text-sm text-gray-600">Delivered Orders</h2>
            <p className="text-2xl font-bold">{deliveredCount}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow text-center">
            <h2 className="text-sm text-gray-600">Total Revenue</h2>
            <p className="text-2xl font-bold">₹{totalRevenue}</p>
          </div>
        </div>

        {/* ✅ Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Order Management</h1>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="border px-3 py-2 rounded-md w-72 focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* ✅ Table */}
        {loading ? (
          <div className="text-center mt-10 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2 px-4 border-b">Order ID</th>
                  <th className="py-2 px-4 border-b">Customer</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">City</th>
                  <th className="py-2 px-4 border-b text-right">Amount</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{order._id}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="font-semibold">
                          {order.user?.name || "Guest"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || "No Email"}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.shippingAddress?.phone || "-"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.shippingAddress?.city || "-"}
                      </td>
                      <td className="py-2 px-4 border-b text-right">
                        ₹{order.totalPrice || 0}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`text-white text-xs px-2 py-1 rounded ${
                            orderStatuses.find(
                              (s) => s.value === order.status
                            )?.color || "bg-gray-400"
                          }`}
                        >
                          {orderStatuses.find(
                            (s) => s.value === order.status
                          )?.label || order.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <select
                          className="border rounded-md px-2 py-1 text-sm"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          {orderStatuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
              <h2 className="text-lg font-bold mb-4">
                Order Details - {selectedOrder._id}
              </h2>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><strong>Name:</strong> {selectedOrder.user?.name || "Guest"}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || "-"}</p>
                <p><strong>City:</strong> {selectedOrder.shippingAddress?.city || "-"}</p>
                <p><strong>Total:</strong> ₹{selectedOrder.totalPrice}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod || "N/A"}</p>
                <p className="col-span-2">
                  <strong>Address:</strong>{" "}
                  {selectedOrder.shippingAddress?.address || "Not provided"}
                </p>
                <div className="col-span-2">
                  <strong>Products:</strong>
                  <ul className="list-disc ml-6">
                    {selectedOrder.orderItems?.map((p, i) => (
                      <li key={i}>
                        {p.quantity}× {p.name} — ₹{p.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
