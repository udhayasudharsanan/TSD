import { useNavigate } from "react-router-dom";
import Top from "./Top";
import HomeButton from "./HomeButton";

function Cart({ cartItems, removeCart, addToCart }) {
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price);
    return total + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  return (
    <>
      <Top />
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-900 text-center">Your Cart</h2>

        {cartItems.length === 0 ? (
          <>
            <p className="text-gray-600 text-center mt-4">Your cart is empty.</p>
            <p className="text-xl text-nowrap text-center mt-5">Try to add some products and come again.</p>
          </>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <div
                key={`${item.firebaseId}-${index}`}
                className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg mb-4 border"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-contain rounded"
                  />
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-lg font-semibold text-gray-700">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => removeCart(item.firebaseId)}
                        className="bg-gray-300 px-3 rounded"
                      >
                        –
                      </button>
                      <button
                          onClick={() => addToCart(item, 1)} 
                          className="bg-gray-300 px-3 rounded"
                        >
                          +
                    </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-right mt-4 flex flex-col items-center">
              <h3 className="text-lg font-bold">
                Total: ₹{totalPrice.toFixed(2)}
              </h3>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-2 rounded mt-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <HomeButton />
      </div>
    </>
  );
}

export default Cart;
