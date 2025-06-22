import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";



const statusSteps = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refund Initiated",
  "Refund Success",
];

const ARCHIVE_STATUSES = ["Delivered", "Refund Success"];
const AUTO_ARCHIVE_DAYS = 7;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showArchived, setShowArchived] = useState(false);

  const autoArchiveIfOld = async (order) => {
    if (!ARCHIVE_STATUSES.includes(order.deliveryStatus)) return;

    const updatedAt = order.statusUpdatedAt?.toDate
      ? order.statusUpdatedAt.toDate()
      : null;

    const now = new Date();
    const ageDays = updatedAt
      ? (now - updatedAt) / (1000 * 60 * 60 * 24)
      : 0;

    if (ageDays >= AUTO_ARCHIVE_DAYS && !order.archived) {
      await updateDoc(doc(db, "orders", order.id), { archived: true });
    }
  };

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));

      const ordersData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const order = { id: docSnap.id, ...docSnap.data() };

          await autoArchiveIfOld(order); // auto archive if needed

          return order;
        })
      );

      // Filter based on archived status
      const filteredOrders = showArchived
        ? ordersData.filter(order => order.archived)
        : ordersData.filter(order => !order.archived);

      setOrders(filteredOrders);

      // fetch user/address
      const uniqueUserIds = [...new Set(ordersData.map(o => o.userId))];
      const detailsMap = {};

      await Promise.all(
        uniqueUserIds.map(async userId => {
          try {
            const userDoc = await getDoc(doc(db, "users", userId));
            const addressDoc = await getDoc(doc(db, "addresses", userId));

            detailsMap[userId] = {
              name: userDoc.exists() ? userDoc.data().name || "Unknown" : "Unknown",
              address: addressDoc.exists() ? addressDoc.data() : { street: "N/A", city: "N/A", pincode: "N/A" },
            };
          } catch {
            detailsMap[userId] = {
              name: "Unknown",
              address: { street: "N/A", city: "N/A", pincode: "N/A" },
            };
          }
        })
      );

      setUserDetails(detailsMap);
    } catch (err) {
      toast.error("Failed to load orders");
      console.error("Order fetch error:", err.message);
    }
  };

  const isValidTransition = (currentStatus, newStatus) => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    const newIndex = statusSteps.indexOf(newStatus);
    return newIndex >= currentIndex;
  };

  const updateOrderStatus = async (orderId, newStatus, currentStatus, statusUpdatedAt) => {
    const now = new Date();
    const updatedAt = statusUpdatedAt?.toDate ? statusUpdatedAt.toDate() : null;

    const withinAllowedTime = updatedAt
      ? now - updatedAt < 2 * 60 * 1000
      : true;

    const isForward = isValidTransition(currentStatus, newStatus);

    if (!isForward && !withinAllowedTime) {
      toast.error("Cannot revert status after 2 minutes.");
      return;
    }

    try {
      await updateDoc(doc(db, "orders", orderId), {
        deliveryStatus: newStatus,
        statusUpdatedAt: Timestamp.now(),
      });
      toast.success("Status updated!");
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error.message);
      toast.error("Permission denied or failed!");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [showArchived]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <h2 className="text-3xl font-bold mb-4 text-indigo-800">All Orders</h2>

      <button
        onClick={() => setShowArchived(!showArchived)}
        className="mb-4 px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
      >
        {showArchived ? "Show Active Orders" : "Show Archived Orders"}
      </button>

      {orders.length === 0 ? (
        <p>No {showArchived ? "archived" : "active"} orders found.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            className={` p-4 mb-4 rounded-2xl shadow-2xl ${
              order.deliveryStatus === "Cancelled"
                ? "bg-red-100 border-red-600"
                : "bg-white"
            }`}
          >
            <p>
              <strong>User Name : </strong>{" "}
              {userDetails[order.userId]?.name || "Unknown"}
            </p>
            <p>
              <strong>Address : </strong>{" "}
              {[userDetails[order.userId]?.address?.street, userDetails[order.userId]?.address?.city, userDetails[order.userId]?.address?.state,userDetails[order.userId]?.address?.zip,userDetails[order.userId]?.address?.phone]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>
              <strong>Payment Id : </strong>
              {order.paymentId}
            </p>
            <p>
              <strong>Ordered At : </strong>{" "}
              {order.orderTime?.toDate
                ? order.orderTime.toDate().toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Status Updated At : </strong>{" "}
              {order.statusUpdatedAt?.toDate
                ? order.statusUpdatedAt.toDate().toLocaleString()
                : "N/A"}
            </p>
            
            <div className="flex gap-2 mt-2 flex-wrap">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 border p-2 rounded">
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity} | ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
            </div>
            
            <p>
              <strong>Status : </strong>{" "}
              <span className="font-semibold">{order.deliveryStatus}</span>
            </p>
            <p>
              <strong>Total : </strong> ₹{order.total}
            </p>


            <div className="flex flex-wrap gap-2 mt-3">
              {statusSteps.map(status => (
                <button
                  key={status}
                  onClick={() =>
                    updateOrderStatus(
                      order.id,
                      status,
                      order.deliveryStatus,
                      order.statusUpdatedAt
                    )
                  }
                  className={`px-3 py-1 text-sm rounded-lg border transition-all duration-150 ${
                    order.deliveryStatus === status
                      ? "bg-indigo-700 text-white"
                      : status === "Cancelled"
                      ? "bg-red-400 hover:bg-red-300"
                      : status.toLowerCase().includes("refund")
                      ? "bg-yellow-400 hover:bg-yellow-300"
                      : "bg-gray-500 text-white hover:bg-indigo-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
