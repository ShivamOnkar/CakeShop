import { useState, useEffect } from "react";
import axios from "axios";
import ImageKit from "imagekit-javascript";
import AdminLayout from "../../components/Layouts/AdminLayout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    imageFile: null,
  });

  // ✅ API base
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // ✅ Auth headers
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/products`, {
          headers: { ...authHeaders() },
        });
        const list = Array.isArray(res.data?.products)
          ? res.data.products
          : res.data;
        setProducts(list);
        setFilteredProducts(list);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter + Search
  useEffect(() => {
    let filtered = products;
    if (category !== "All")
      filtered = filtered.filter((p) => p.category === category);
    if (search)
      filtered = filtered.filter((p) =>
        (p.name || "").toLowerCase().includes(search.toLowerCase())
      );
    setFilteredProducts(filtered);
  }, [category, search, products]);

  // ✅ Upload image to ImageKit
  const uploadImageToImageKit = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const authResponse = await axios.get(`${apiBase}/imagekit-auth`);
      const authData = authResponse.data;

      const imagekit = new ImageKit({
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
        authenticationEndpoint: `${apiBase}/imagekit-auth`,
      });

      const uploadResult = await imagekit.upload({
        file,
        fileName: `product_${Date.now()}_${file.name}`,
        token: authData.token,
        signature: authData.signature,
        expire: authData.expire,
      });

      console.log("✅ Image uploaded:", uploadResult);
      return uploadResult.url;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert("Image upload failed. Please check ImageKit setup.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ✅ Add new product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      let imageUrl = newProduct.imageUrl;

      if (newProduct.imageFile) {
        const uploadedUrl = await uploadImageToImageKit(newProduct.imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
        else {
          alert("Image upload failed. Product not saved.");
          return;
        }
      }

      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock,
        image: [{ url: imageUrl, alt: newProduct.name }], // ✅ Correct structure
      };

      const res = await axios.post(`${apiBase}/products`, productData, {
        headers: { ...authHeaders() },
      });

      const created = res.data?.product || res.data;
      setProducts([...products, created]);
      setFilteredProducts([...filteredProducts, created]);
      setShowAddModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
        imageFile: null,
      });

      alert("✅ Product added successfully!");
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product.");
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${apiBase}/products/${id}`, {
        headers: { ...authHeaders() },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-2xl font-semibold mb-4 sm:mb-0">
            Manage Products
          </h1>
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
            <option value="bestseller">Best Seller</option>
            <option value="bakery">Bakery</option>
            <option value="birthday">Birthday</option>
            <option value="chocolate">Chocolate</option>
            <option value="occasion">Occasion</option>
          </select>
        </div>

        {/* Table */}
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
                        {p.image ? (
                          <img
                            src={
                              Array.isArray(p.image)
                                ? p.image[0]?.url
                                : typeof p.image === "object"
                                ? p.image.url
                                : p.image
                            }
                            alt={p.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td className="py-2 px-4">{p.name}</td>
                      <td className="py-2 px-4 capitalize">{p.category}</td>
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
                          onClick={() => setSelectedProduct(p)}
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

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add Product</h2>

              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
                rows="3"
              ></textarea>
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">Select Category</option>
                <option value="bestseller">Best Seller</option>
                <option value="bakery">Bakery</option>
                <option value="birthday">Birthday</option>
                <option value="chocolate">Chocolate</option>
                <option value="occasion">Occasion</option>
              </select>
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
                }
                className="w-full mb-3"
              />

              {uploading && (
                <p className="text-blue-600 text-sm mb-2">Uploading image...</p>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {uploading ? "Uploading..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {selectedProduct.name}
              </h2>

              <img
                src={
                  Array.isArray(selectedProduct.image)
                    ? selectedProduct.image[0]?.url
                    : typeof selectedProduct.image === "object"
                    ? selectedProduct.image.url
                    : selectedProduct.image
                }
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded mb-3"
              />

              <p className="text-gray-700 mb-2">
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Price:</strong> ₹{selectedProduct.price}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Stock:</strong> {selectedProduct.stock}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description || "No description available."}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
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
