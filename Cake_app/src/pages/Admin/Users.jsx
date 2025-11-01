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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      if (searchText) params.append("search", searchText);
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`http://localhost:5000/api/users?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", role: "", status: "" });
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : `http://localhost:5000/api/users`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Operation failed");

      alert(editingUser ? "User updated successfully" : "User added successfully");
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });
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
    { title: "Active Users", value: users.filter(u => u.status === "active").length, color: "bg-green-500" },
    { title: "Admin Users", value: users.filter(u => u.role === "admin").length, color: "bg-yellow-500" },
    { title: "Customers", value: users.filter(u => u.role === "customer").length, color: "bg-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-4">
        {/* ✅ Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {userStats.map((stat, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-white shadow ${stat.color}`}
            >
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ✅ Filters and Header */}
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
            />
            <select
              className="px-3 py-2 border rounded-lg"
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">Filter by role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Filter by status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => {
                setShowModal(true);
                resetForm();
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Add User
            </button>
          </div>
        </div>

        {/* ✅ Table */}
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="bg-blue-50 border border-blue-300 text-blue-600 px-4 py-3 rounded-lg text-center">
            No Users Found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
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
                    <th key={h} className="text-left px-4 py-2 text-sm font-semibold text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{u._id.slice(-6)}</td>
                    <td className="px-4 py-2 text-sm">{u.name}</td>
                    <td className="px-4 py-2 text-sm">{u.email}</td>
                    <td className="px-4 py-2 text-sm">{u.phone || "N/A"}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          u.role === "admin" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          u.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      {u.totalOrders || 0}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      ₹{u.totalSpent || 0}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setFormData(u);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => (window.location = `mailto:${u.email}`)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:underline text-sm"
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

        {/* ✅ Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingUser ? `Edit User - ${editingUser.name}` : "Add New User"}
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
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">Select Role</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingUser ? "Update User" : "Add User"}
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
