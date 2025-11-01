import { useState, useEffect } from "react";
import { FaShoppingCart, FaUsers, FaBox, FaRupeeSign, FaArrowUp, FaArrowDown, FaStar } from "react-icons/fa";
import AdminLayout from "../../components/Layouts/AdminLayout";

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: [],
    recentOrders: [],
    bestSellingProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const [productsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!productsRes.ok || !ordersRes.ok) throw new Error("Failed to fetch data");

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      const products = productsData.products || productsData || [];
      const orders = ordersData.orders || ordersData || [];

      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const totalCustomers = new Set(orders.map((o) => o.user?._id)).size;

      const lowStockProducts = products.filter((p) => p.stock < 10).slice(0, 5);
      const bestSellingProducts = products.filter((p) => p.isBestSeller).slice(0, 5);
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setData({
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
        lowStockProducts,
        bestSellingProducts,
        recentOrders,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: <FaBox />,
      color: "text-blue-600",
      change: 12,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: <FaShoppingCart />,
      color: "text-green-600",
      change: 8,
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue}`,
      icon: <FaRupeeSign />,
      color: "text-purple-600",
      change: 15,
      trend: "up",
    },
    {
      title: "Total Customers",
      value: data.totalCustomers,
      icon: <FaUsers />,
      color: "text-yellow-600",
      change: 5,
      trend: "up",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-screen text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-gray-600 text-sm">{stat.title}</h2>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
              </div>
              <div
                className={`flex items-center mt-4 text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                <span className="ml-1">{stat.change}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders + Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 border">Order ID</th>
                    <th className="p-3 border">Customer</th>
                    <th className="p-3 border">Amount</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        No recent orders found
                      </td>
                    </tr>
                  ) : (
                    data.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-3 border">{order._id?.slice(-8)}</td>
                        <td className="p-3 border">{order.user?.name || "Guest"}</td>
                        <td className="p-3 border">₹{order.totalAmount || 0}</td>
                        <td className="p-3 border">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                        <td className="p-3 border">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
            {data.lowStockProducts.length === 0 ? (
              <p className="text-gray-500">No low stock products.</p>
            ) : (
              <ul className="divide-y">
                {data.lowStockProducts.map((p) => (
                  <li key={p._id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        {p.category} • ₹{p.price}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Top Selling */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          {data.bestSellingProducts.length === 0 ? (
            <p className="text-gray-500">No top selling products yet.</p>
          ) : (
            <ul className="divide-y">
              {data.bestSellingProducts.map((p, i) => (
                <li key={p._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      {i + 1}. {p.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{p.price} • Stock: {p.stock}
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold flex items-center">
                    <FaStar className="mr-1 text-yellow-500" /> Best Seller
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
