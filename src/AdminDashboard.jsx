import { Link } from "react-router-dom";
import Top from "./Top";

function AdminDashboard() {
  return (
    <>
      <Top />
      <div className="p-8 min-h-screen bg-gradient-to-br from-white/70 to-indigo-100">
        <h2 className="text-3xl font-bold mb-6 text-indigo-800 text-center">Admin Dashboard</h2>

        <div className="flex flex-col gap-6 items-center">
          <Link
            to="/admin-orders"
            className="w-[80%] text-center text-2xl px-6 py-4 rounded-2xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg text-indigo-900 font-semibold hover:bg-indigo-600 hover:text-white transition"
          >
            Manage Orders
          </Link>

          <Link
            to="/admin-products"
            className="w-[80%] text-center text-2xl px-6 py-4 rounded-2xl backdrop-blur-3xl bg-white/30 border border-white/40 shadow-lg text-indigo-900 font-semibold hover:bg-green-600 hover:text-white transition"
          >
            Manage Products
          </Link>

          <Link
            to="/admin-users"
            className="w-[80%] text-center text-2xl px-6 py-4 rounded-2xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg text-indigo-900 font-semibold hover:bg-yellow-500 hover:text-white transition"
          >
            Manage Users
          </Link>

          <Link
            to="/admin-analysis"
            className="w-[80%] text-center text-2xl px-6 py-4 rounded-2xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg text-indigo-900 font-semibold hover:bg-yellow-500 hover:text-white transition"
          >
            Manage Analytics
          </Link>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
