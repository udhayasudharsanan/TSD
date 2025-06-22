import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import Top from "./Top";
import HomeButton from "./HomeButton";

import { getDoc } from "firebase/firestore";

const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);


  useEffect(() => {
  const fetchOrders = async () => {
    if (!user) return;

    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userOrders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(userOrders);
    setLoading(false);

    // Fetch user details
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const addressDoc = await getDoc(doc(db, "addresses", user.uid));
    setUserDetails({
      name: userDoc.exists() ? userDoc.data().name || "Customer" : "Customer",
      address: addressDoc.exists() ? addressDoc.data() : {
        street: "N/A",
        city: "N/A",
        state: "N/A",
        zip: "N/A"
      }
    });
  };

  fetchOrders();
}, [user]);


  const cancelOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { deliveryStatus: "Cancelled" });
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, deliveryStatus: "Cancelled" } : order
      )
    );
  };

  const renderProgressBar = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex-1 h-2 rounded-full bg-red-500"></div>
          <div className="flex-1 h-2 rounded-full bg-red-500"></div>
          <div className="flex-1 h-2 rounded-full bg-red-500"></div>
          <div className="flex-1 h-2 rounded-full bg-red-500"></div>
        </div>
      );
    }

    const currentStep = steps.indexOf(status || "Pending");
    return (
      <div className="flex items-center space-x-2 mt-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full ${
              index <= currentStep ? "bg-green-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    );
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <>
      <Top />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white shadow-md rounded p-4 mb-6 border ${
                order.deliveryStatus === "Cancelled" ? "border-red-400" : "border-gray-200"
              }`}
            >
              <h3 className="font-semibold mb-2 text-lg text-green-700">
                Payment ID: {order.paymentId || "Cash on Delivery"}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Order Date: {new Date(order.orderTime?.seconds * 1000).toLocaleString()}
              </p>
              <p className="text-sm font-semibold text-indigo-700 mb-2">
                Status: {order.deliveryStatus || "Pending"}
              </p>

              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between border-b py-1 text-sm"
                >
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <p className="text-right font-semibold mt-3 text-green-800">
                Total: ₹{order.total.toFixed(2)}
              </p>

              {renderProgressBar(order.deliveryStatus)}

              {order.deliveryStatus === "Cancelled" && order.paymentId && (
                <p className="text-red-600 mt-2 font-semibold">Refund will be processed soon.</p>
              )}

              {order.deliveryStatus === "Cancelled" && !order.paymentId && (
                <p className="text-yellow-600 mt-2 font-semibold">COD order — no refund required.</p>
              )}

            {(order.deliveryStatus || "Pending") === "Pending" && (

                <button
                  onClick={() => cancelOrder(order.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))
        )}

        <div className="flex justify-center mt-6">
          <Link to="/user-info" className="bg-indigo-800 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Back to Profile
          </Link>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
      <HomeButton />
    </div>
    </>
  );
}

export default MyOrders;
