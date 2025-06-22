import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Top from "./Top";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3", "#9C27B0"];

function AdminAnalysis() {
  const [metrics, setMetrics] = useState({
    orderCount: 0,
    salesTotal: 0,
    productCount: 0,
    userCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
    orderStatusData: [],
    dailySalesData: []
  });

  const fetchMetrics = async () => {
    const ordersSnap = await getDocs(collection(db, "orders"));
    const usersSnap = await getDocs(collection(db, "users"));
    const productsSnap = await getDocs(collection(db, "products"));

    const orders = ordersSnap.docs.map(doc => doc.data());

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const delivered = orders.filter(o => o.deliveryStatus === "Delivered").length;
    const cancelled = orders.filter(o => o.deliveryStatus === "Cancelled").length;

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.deliveryStatus] = (acc[o.deliveryStatus] || 0) + 1;
      return acc;
    }, {});

    const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const dailyMap = {};
    orders.forEach(o => {
      const date = o.orderTime?.toDate?.().toLocaleDateString() || "Unknown";
      dailyMap[date] = (dailyMap[date] || 0) + o.total;
    });
    const dailySalesData = Object.entries(dailyMap).map(([date, total]) => ({ date, total }));

    setMetrics({
      orderCount: orders.length,
      salesTotal: totalSales,
      deliveredCount: delivered,
      cancelledCount: cancelled,
      userCount: usersSnap.size,
      productCount: productsSnap.size,
      orderStatusData,
      dailySalesData
    });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
     <>
     <Top />
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-indigo-100">
      
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-800">Admin Analytics Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <MetricCard title="Total Orders" value={metrics.orderCount} />
        <MetricCard title="Total Sales" value={`₹${metrics.salesTotal}`} />
        <MetricCard title="Delivered" value={metrics.deliveredCount} />
        <MetricCard title="Cancelled" value={metrics.cancelledCount} />
        <MetricCard title="Total Products" value={metrics.productCount} />
        <MetricCard title="Total Users" value={metrics.userCount} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-center mb-4">Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={metrics.orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {metrics.orderStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-center mb-4">Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center border hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-indigo-800">{value}</h3>
    </div>
  );
}

export default AdminAnalysis;
