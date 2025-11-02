// import React, { useState } from "react";
// import axios from "axios";

// const AdminAddProduct = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     image: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("description", formData.description);
//       data.append("price", formData.price);
//       data.append("category", formData.category);
//       if (formData.image) {
//         data.append("image", formData.image);
//       }

//       const res = await axios.post("http://localhost:5000/api/products", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("✅ Product added successfully!");
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         category: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setMessage("❌ Failed to add product. Please check all fields.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//           Add New Product
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Product Name */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">
//               Product Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter product name"
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Enter product description"
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//               required
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">
//               Price (₹)
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="Enter price"
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//               required
//             />
//           </div>

//           {/* Category (Dropdown) */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">
//               Category
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
//               required
//             >
//               <option value="">Select category</option>
//               <option value="bestseller">Best Seller</option>
//               <option value="bakery">Bakery</option>
//               <option value="birthday">Birthday</option>
//               <option value="chocolate">Chocolate</option>
//               <option value="occasion">Occasion</option>
//             </select>
//           </div>

//           {/* Product Image */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">
//               Product Image
//             </label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//               className="w-full"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
//           >
//             {loading ? "Adding..." : "Add Product"}
//           </button>
//         </form>

//         {message && (
//           <p className="text-center mt-4 font-medium text-gray-700">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAddProduct;
