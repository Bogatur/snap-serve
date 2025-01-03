import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const calculateProductRevenue = (data) => {
  const productRevenue = {};

  Object.values(data).forEach((dateData) => {
    Object.values(dateData).forEach((order) => {
      order.forEach((item) => {
        const revenue = item.productPrice * item.quantity;

        // Toplam kazancı ürün adına göre grupla
        if (productRevenue[item.productName]) {
          productRevenue[item.productName] += revenue;
        } else {
          productRevenue[item.productName] = revenue;
        }
      });
    });
  });

  return productRevenue;
};

const ProductPieChart = ({ data }) => {
  const productRevenue = calculateProductRevenue(data);

  // Pasta grafiği verilerini hazırlama
  const chartData = {
    labels: Object.keys(productRevenue),
    datasets: [
      {
        label: 'Ürün Başına Kazanç',
        data: Object.values(productRevenue),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Renkler
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default ProductPieChart;
