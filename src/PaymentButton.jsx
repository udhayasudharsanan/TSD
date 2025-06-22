import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useAuth } from "./AuthContext"; 

function PaymentButton({ amount, cartItems, clearCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.uid) {
        const docRef = doc(db, "addresses", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAddress(docSnap.data());
        }
      }
    };
    fetchAddress();
  }, [user]);

  const loadRazorpay = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return alert("Razorpay SDK failed to load.");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "Timple Saree Store",
      description: "Order Payment",
      prefill: {
        name: user?.displayName || "Guest User",
        email: user?.email || "guest@example.com",
        contact: address?.phone || "9000000000", // ✅ using Firestore phone
      },
      theme: { color: "#4f46e5" },

      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;
        try {
          await addDoc(collection(db, "orders"), {
            userId: user?.uid || "guest",
            name: user?.displayName || "Unknown",
            email: user?.email || "unknown@example.com",
            phone: address?.phone || "9000000000", // ✅ store phone too
            items: cartItems,
            total: amount,
            paymentId,
            status: "Success",
            deliveryStatus: "Pending",
            orderTime: new Date(),
          });

          clearCart();
          setTimeout(() => {
            navigate(`/payment-success?payment_id=${paymentId}`);
          }, 100);
        } catch (error) {
          console.error("Error storing order:", error);
          navigate("/payment-failure");
        }
      },

      modal: {
        ondismiss: function () {
          console.warn("Payment cancelled by user");
          navigate("/payment-failure");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="flex justify-center rounded-b-3xl">
      <button
        onClick={handlePayment}
        className="bg-indigo-800 w-40 text-white py-2 px-4 rounded-xl mt-4 hover:bg-indigo-900 transition"
      >
        Pay ₹{amount}
      </button>
    </div>
  );
}

export default PaymentButton;
