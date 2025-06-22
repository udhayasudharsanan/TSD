import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

import Header from "./Header";
import Footer from "./Footer";
import Top from "./Top";
import HomeButton from "./HomeButton";
import { toast } from "react-toastify";

function SeperatePage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // ✅ Local quantity

  useEffect(() => {
    const fetchProduct = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const allProducts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
      }));
      const match = allProducts.find((p) => String(p.firebaseId) === String(id));
      setProduct(match || null);
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    setQuantity(val < 1 ? 1 : val);
  };

 // ✅ Already correct
const handleAddToCart = () => {
  if (!product) return;
  addToCart({ ...product, firebaseId: product.firebaseId }, quantity);
  toast.success(`${product.title} (x${quantity}) added to cart!`);
  setQuantity(1); // reset
};




  const renderStars = (rate) => {
    const fullStars = Math.floor(rate);
    const halfStar = rate - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex justify-center mt-2 text-yellow-500 text-lg">
        {"★".repeat(fullStars)}
        {halfStar && "⯪"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  if (!product) return <p className="text-center mt-20">Loading product...</p>;

  return (
    <>
      <Top />
      <Header />
      <div className="flex justify-center mt-10 mb-20 px-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-6">
          <img
            src={product.image}
            alt={product.title}
            className="w-64 h-64 object-contain mx-auto"
          />
          <h2 className="text-lg md:text-xl font-bold text-center mt-4">
            {product.title}
          </h2>
          {renderStars(product.rating?.rate || 0)}
          <p className="text-sm text-gray-600 text-center mt-2">
            {product.description}
          </p>
          <p className="text-center text-green-700 text-xl font-semibold mt-4">
            ₹ {product.price}
          </p>

          <div className="flex justify-center items-center gap-2 mt-4">
            <label htmlFor="qty" className="text-sm">Quantity:</label>
            <input
              id="qty"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
            />
          </div>

          <button
  className="bg-blue-900 hover:bg-blue-700 ml-24 mt-5 text-white px-6 py-2 rounded-lg shadow-md transition-all"
  onClick={handleAddToCart} // ✅ Correct

>
  Add to Cart
</button>


        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <HomeButton />
      </div>
      <Footer />
    </>
  );
}

export default SeperatePage;
