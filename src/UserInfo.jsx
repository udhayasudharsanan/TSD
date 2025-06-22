import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";
import { FaPlane, FaLock, FaBoxOpen } from "react-icons/fa";
import Top from "./Top";
import Footer from "./Footer";
import HomeButton from "./HomeButton";
import { toast } from "react-toastify";

function UserInfo() {
  const { user } = useAuth();
  const [address, setAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.uid) {
        const docRef = doc(db, "addresses", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAddress(docSnap.data());
          setFormData(docSnap.data());
        }
      }
    };

    fetchAddress();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "addresses", user.uid), formData);
      setAddress(formData);
      toast.success("Address updated!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address.");
    }
  };

  return (
    <div>
      <Top />
      <div className="relative max-w-xl mx-auto mt-10">
        {/* Blurred background content */}
        <div className={`p-6 bg-white shadow-lg rounded-lg min-h-140 transition-all duration-300 ${isEditing ? "blur-sm pointer-events-none" : ""}`}>
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-900">My Profile</h2>
          
          <div className="mb-4">
            <p><strong>Name:</strong> {user?.displayName || "Guest"}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-lg">Saved Address</h3>
            {address ? (
              <>
                <p>{address.name}, {address.phone}</p>
                <p>{address.street}, {address.city}</p>
                <p>{address.state}, {address.zip}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded"
                >
                  Edit Address
                </button>
              </>
            ) : (
              <p className="text-gray-500">No saved address found.</p>
            )}
          </div>

          <div className="flex gap-4  mt-6">
            
            <Link to="/my-orders" className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded">
              View Orders
            </Link>
          </div>
        </div>

        {/* Edit Form Overlay */}
        {isEditing && (
          <div className="absolute top-0 left-0 w-full h-full z-10 bg-white bg-opacity-95 p-6 rounded-lg shadow-2xl flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-center text-indigo-800 mb-4">Edit Address</h3>
            <input name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded" placeholder="Name" />
            <input name="phone" value={formData.phone} onChange={handleChange} className="border p-2 rounded" placeholder="Phone" />
            <input name="street" value={formData.street} onChange={handleChange} className="border p-2 rounded" placeholder="Street" />
            <input name="city" value={formData.city} onChange={handleChange} className="border p-2 rounded" placeholder="City" />
            <input name="state" value={formData.state} onChange={handleChange} className="border p-2 rounded" placeholder="State" />
            <input name="zip" value={formData.zip} onChange={handleChange} className="border p-2 rounded" placeholder="Pincode" />

            <div className="flex gap-4 mt-3 justify-center">
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Why shop with us section */}
      <div className="mt-8 mx-4 bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">Why Shop With Us?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2 justify-center">
            <FaPlane className="animate-flight text-blue-500 text-xl" />
            <span>Fast Delivery All Over India</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaLock className="animate-pulse text-green-500 text-xl" />
            <span>100% Secure UPI Payments</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaBoxOpen className="animate-bounce text-yellow-500 text-xl" />
            <span>Easy Returns & Refunds</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <HomeButton />
      </div>
      <Footer />
    </div>
  );
}

export default UserInfo;
