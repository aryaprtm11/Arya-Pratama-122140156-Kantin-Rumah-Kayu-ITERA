import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const IncomeChart = ({ orders = [] }) => {
  // Fungsi untuk memformat mata uang
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Fungsi untuk format currency yang lebih pendek di axis
  const formatShortCurrency = (value) => {
    if (value === 0) return 'Rp 0';
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}K`;
    }
    return `Rp ${value}`;
  };

  // Fungsi untuk mendapatkan penghasilan per hari dalam bulan ini
  const getDailyIncome = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter orders untuk bulan ini saja
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.create_at);
      return orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear &&
             order.status !== 'cancelled';
    });

    // Buat objek untuk menyimpan penghasilan per hari
    const dailyData = {};
    
    // Inisialisasi data untuk setiap hari dalam bulan ini
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Dapatkan tanggal hari ini
    const today = now.getDate();
    
    // Hanya tampilkan 7 hari sebelum hari ini dan 2 hari setelahnya
    const startDay = Math.max(1, today - 7);
    const endDay = Math.min(daysInMonth, today + 2);
    
    // Inisialisasi data hanya untuk range hari yang akan ditampilkan
    for (let i = startDay; i <= endDay; i++) {
      const dateStr = i.toString().padStart(2, '0');
      dailyData[dateStr] = 0;
    }

    // Hitung penghasilan per hari
    thisMonthOrders.forEach(order => {
      const orderDate = new Date(order.create_at);
      const day = orderDate.getDate();
      if (day >= startDay && day <= endDay) {
        const dateStr = day.toString().padStart(2, '0');
        dailyData[dateStr] = (dailyData[dateStr] || 0) + order.total_harga;
      }
    });

    // Konversi ke format yang dibutuhkan oleh recharts
    const chartData = Object.entries(dailyData).map(([day, total]) => ({
      name: day,
      penghasilan: total
    }));

    return chartData;
  };

  const data = getDailyIncome();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Grafik Penghasilan Harian ({currentMonth} {currentYear})
      </h2>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 50,
              bottom: 30
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              label={{ 
                value: 'Tanggal', 
                position: 'insideBottom', 
                offset: -20
              }}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              tickFormatter={formatShortCurrency}
              tick={{ fontSize: 12 }}
              width={80}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Penghasilan"]}
              labelFormatter={(label) => `Tanggal ${label}`}
              contentStyle={{ fontSize: '12px' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="penghasilan"
              name="Penghasilan"
              stroke="#4ade80"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeChart; 