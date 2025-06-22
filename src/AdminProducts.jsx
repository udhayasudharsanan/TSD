import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc
} from "firebase/firestore";
import { toast } from "react-toastify";
import Top from "./Top";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const addProduct = async () => {
  if (!form.title || !form.price || !form.image) {
    toast.error("Please fill required fields");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...form,
      price: Number(form.price),
      rating: {
        rate: Math.floor(Math.random() * 3) + 3, // optional default 3–5
        count: Math.floor(Math.random() * 100) + 1
      },
      createdAt: new Date().toISOString(), // optional
    });

    toast.success("Product added!");
    console.log("Firestore ID (used for deletion):", docRef.id);

    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      image: ""
    });

    fetchProducts();
  } catch (error) {
    toast.error("Failed to add product");
    console.error(error.message);
  }
};




 const deleteProduct = async (id) => {
  if (typeof id !== "string" || id.length < 10) {
    toast.error("Invalid Firestore ID");
    console.warn("Invalid ID:", id);
    return;
  }

  try {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted");
    fetchProducts();
  } catch (error) {
    toast.error("Failed to delete");
    console.error("Delete error:", error.message);
  }
};







  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
    <Top />
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Manage Products</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product title"
            className="border p-2 rounded"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded col-span-full"
          ></textarea>
        </div>
        <button
          onClick={addProduct}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>

      {products.map((prod) => (
  <div key={prod.id} className="border p-5 mb-5 backdrop-blur-md rounded bg-white shadow ">
    <img
      src={prod.image}
      alt={prod.title}
      className="h-40 w-full object-cover rounded mb-2"
    />
    <h4 className="font-bold">{prod.title}</h4>
    <p>₹{prod.price}</p>
    <p className="text-sm text-gray-600">{prod.category}</p>
    
    <button
      onClick={() => deleteProduct(prod.id)}
      className="mt-2 text-red-600 hover:underline"
    >
      Delete
    </button>
  </div>
))}

    </div>
    </>
  );
}

export default AdminProducts;
