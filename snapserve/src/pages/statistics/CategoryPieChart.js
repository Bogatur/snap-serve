import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const calculateCategoryRevenue = (data) => {
  const categoryRevenue = {};

  Object.values(data).forEach((dateData) => {
    Object.values(dateData).forEach((order) => {
      order.forEach((item) => {
        const revenue = item.productPrice * item.quantity;

        // Kategorilere göre toplam kazancı grupla
        if (categoryRevenue[item.productPage]) {
          categoryRevenue[item.productPage] += revenue;
        } else {
          categoryRevenue[item.productPage] = revenue;
        }
      });
    });
  });

  return categoryRevenue;
};

const CategoryPieChart = ({ data }) => {
  const categoryRevenue = calculateCategoryRevenue(data);

  // Pasta grafiği verilerini hazırlama
  const chartData = {
    labels: Object.keys(categoryRevenue),
    datasets: [
      {
        label: 'Kategori Başına Kazanç',
        data: Object.values(categoryRevenue),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default CategoryPieChart;
