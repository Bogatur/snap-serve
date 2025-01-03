import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const calculateRevenueByKey = (data) => {
  const timeRevenue = {};

  // Verinin üst düzeydeki döngüsü
  Object.entries(data).forEach(([dateKey, dateData]) => {
    // her bir ürün grubu üzerinde iterasyon yapıyoruz (örn. "-dwaf3", "-fsegse")
    Object.entries(dateData).forEach(([productKey, orders]) => {
      // her bir ürün üzerinde iterasyon yapıyoruz
      orders.forEach((order) => {
        const revenue = parseFloat(order.productPrice) * parseInt(order.quantity); // Ürün kazancı hesaplanıyor
        
        // Eğer daha önce bu tarihte kazanç varsa, onu topluyoruz
        if (timeRevenue[dateKey]) {
          timeRevenue[dateKey] += revenue;
        } else {
          timeRevenue[dateKey] = revenue;
        }
      });
    });
  });

  return timeRevenue;
};

const TimeLineChart = ({ data }) => {
  const timeRevenue = calculateRevenueByKey(data);

  // Çizgi grafiği için veri seti oluşturuluyor
  const chartData = {
    labels: Object.keys(timeRevenue), // Zaman etiketleri (date key)
    datasets: [
      {
        label: 'Kazanç', // Grafikteki etiket
        data: Object.values(timeRevenue), // Hesaplanan kazançlar
        borderColor: '#FF6384',
        borderWidth: 2,
        fill: false, // Alanı doldurmak istemiyoruz
      },
    ],
  };

  return <Line data={chartData} />;
};

export default TimeLineChart;
