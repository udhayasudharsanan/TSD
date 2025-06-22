import { useState , useEffect } from "react";
import AddressForm from "./AddressForm";
import PaymentButton from "./PaymentButton";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import Top from "./Top";
import HomeButton from "./HomeButton";

function Checkout({ cartItems ,setCartItems,clearCart}) {
   const [address, setAddress] = useState(null);
  const { user } = useAuth();

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) || 0) * item.quantity;
  }, 0);
  
  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.uid) {
        const addressRef = doc(db, "addresses", user.uid);
        const docSnap = await getDoc(addressRef);
        if (docSnap.exists()) {
          setAddress(docSnap.data());
        }
      }
    };

    fetchAddress();
  }, [user]);



  return (
    <>
    <Top />
    <div className="max-w-2xl mx-auto mt-8 p-4 shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-800">Checkout</h2>

      {!address ? (
        <AddressForm onSubmit={setAddress} />
      ) : (
        <>
          <div className="bg-white shadow-md p-4 rounded mb-4">
            <h3 className="font-semibold text-lg mb-2">Shipping To:</h3>
            <p>{address.name}, {address.phone}</p>
            <p>{address.street}, {address.city}</p>
            <p>{address.state}, {address.zip}</p>
          </div>

          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <p>{item.title} x {item.quantity}</p>
              <p>₹ {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <h3 className="text-right text-lg font-bold mt-4">
            Total: ₹{totalPrice.toFixed(2)}
          </h3>

          <PaymentButton 
            amount={totalPrice}
            cartItems={cartItems}
            clearCart={clearCart}
            setCartItems={setCartItems}
            
          />
        </>
      )}
    </div>
    <div className="fixed bottom-6 right-6 z-50">
      <HomeButton />
    </div>
    </>
  );
}

export default Checkout;
