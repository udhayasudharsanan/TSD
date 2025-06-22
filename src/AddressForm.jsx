import { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import Top from "./Top";

function AddressForm({ onSubmit }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.uid) {
      const addressRef = doc(db, "addresses", user.uid);
      await setDoc(addressRef, formData);
    }

    onSubmit(formData); // Pass to Checkout or parent
  };

  return (
    <>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      {["name", "phone", "street", "city", "state", "zip"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save & Continue
      </button>
    </form>
    </>
  );
}

export default AddressForm;
