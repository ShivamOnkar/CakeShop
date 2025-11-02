import { useState, useEffect } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [searchText, filters]);

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (searchText) params.append("search", searchText);
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(
        `http://localhost:5000/api/users?${params}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", role: "", status: "" });
    setEditingUser(null);
  };

  // ✅ Edit user only (Add removed)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = {
      ...formData,
      role: formData.role === "user" ? "customer" : formData.role,
    };

    const url = `http://localhost:5000/api/users/${editingUser._id}`;
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedForm),
    });

    if (!response.ok) throw new Error("Operation failed");
    alert("User updated successfully");
    setShowModal(false);
    resetForm();
    fetchUsers();
  };

  // ✅ Delete user
  const handleDelete = async (userId, role) => {
    if (role === "admin") return; // prevent deleting admins
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const userStats = [
    { title: "Total Users", value: users.length, color: "bg-blue-500" },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      color: "bg-green-500",
    },
    {
      title: "Admin Users",
      value: users.filter((u) => u.role === "admin").length,
      color: "bg-yellow-500",
    },
    {
      title: "Customers",
      value: users.filter((u) => u.role === "customer").length,
      color: "bg-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen rounded-lg">
        {/* ✅ Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {userStats.map((stat, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-white shadow-md ${stat.color}`}
            >
              <h3 className="text-sm md:text-lg font-semibold">
                {stat.title}
              </h3>
              <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ✅ Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            User Management
          </h1>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">Filter by role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Filter by status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ✅ User Table */}
        {loading ? (
          <div className="text-center text-gray-600 py-8 text-lg">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="bg-blue-50 border border-blue-300 text-blue-600 px-4 py-3 rounded-lg text-center shadow-sm">
            No Users Found
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Phone",
                    "Role",
                    "Status",
                    "Join Date",
                    "Orders",
                    "Spent",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{u._id.slice(-6)}</td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.phone || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${
                          u.role === "admin" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${
                          u.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {u.totalOrders || 0}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ₹{u.totalSpent || 0}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setFormData(u);
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => (window.location = `mailto:${u.email}`)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.role)}
                        className={`text-red-600 hover:underline text-sm ${
                          u.role === "admin"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={u.role === "admin"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Edit Modal */}
        {showModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Edit User - {editingUser.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "email", "phone"].map((f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {f}
                    </label>
                    <input
                      type={f === "email" ? "email" : "text"}
                      name={f}
                      required={f !== "phone"}
                      value={formData[f] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [f]: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    required
                    value={
                      formData.role === "user" ? "customer" : formData.role
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
