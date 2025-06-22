import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Top from "./Top";
function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = new URLSearchParams(location.search).get("payment_id");
  toast.success("Payment Successful!");
  return (
    <>
    <Top />
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful</h2>
      <p className="text-lg">Thank you for your purchase!</p>
      <p className="text-gray-700 mt-2">Payment ID: <strong>{paymentId}</strong></p>
      
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate("/my-orders")}
          className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          View Orders
        </button>
      </div>
    </div>
    </>
  );
}

export default PaymentSuccess;
