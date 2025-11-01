import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/Layouts/AdminLayout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // ✅ Filter and Search
  useEffect(() => {
    let filtered = products;
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [category, search, products]);

  // ✅ Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock);
    if (newProduct.image) formData.append("image", newProduct.image);

    try {
      const res = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts([...products, res.data]);
      setShowAddModal(false);
      setNewProduct({ name: "", price: "", category: "", stock: "", image: null });
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Manage Products</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md p-2 w-full sm:w-1/3"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md p-2 w-full sm:w-1/4"
          >
            <option value="All">All Categories</option>
            <option value="Cake">Cake</option>
            <option value="Bakery">Bakery</option>
            <option value="Sweets">Sweets</option>
          </select>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Image</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Price (₹)</th>
                  <th className="py-2 px-4 text-left">Stock</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td className="py-2 px-4">{p.name}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-2 px-4">₹{p.price}</td>
                      <td className="py-2 px-4">
                        {p.stock > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            In Stock ({p.stock})
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View Product Modal */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <button
                onClick={() => setShowViewModal(false)}
                className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add Product</h2>
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">Select Category</option>
                <option value="Cake">Cake</option>
                <option value="Bakery">Bakery</option>
                <option value="Sweets">Sweets</option>
              </select>
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                className="w-full mb-3"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
