import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Top from "./Top";

function PaymentFailure() {
  const navigate = useNavigate();
toast.error("Something went wrong")
  return (
    <>
      <Top />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
      <p className="text-gray-700 mb-4">Something went wrong. Please try again later.</p>

      <button
        onClick={() => navigate("/cart")}
        className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
      >
        Go Back to Cart
      </button>
    </div>
    </>
  );
}

export default PaymentFailure;
