import React, { useEffect, useState } from 'react';
import { database, ref, get } from '../../firebase';
import { Bar, Pie, Line, Doughnut, Radar } from 'react-chartjs-2'; // Chart.js Pie grafik için
import { useAuth } from '../../context/AuthContext';
import SideMenu from '../../components/sidemenu/SideMenu';
import Header from '../../components/header/Header';
import { Chart as ChartJS, CategoryScale, RadialLinearScale
    , LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const { companyKey } = useAuth();
  
  // State'ler
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productSales, setProductSales] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState('lastMonth'); // default tarih aralığı

  // Firebase'den veriyi çekme
  const fetchSalesData = async () => {
    try {
      const salesRef = ref(database, `companies/${companyKey}/salesStatistics`);
      const snapshot = await get(salesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSalesData(data);
      } else {
        console.log('No sales data found.');
      }
    } catch (error) {
      console.error('Error fetching sales data: ', error);
    }
  };

  // Tarih aralığına göre veriyi filtreleme
  const filterSalesByDateRange = (dateRange) => {
    let filtered = [];
    const now = new Date();
    const currentDate = now.getTime();
    let startDate;

    switch (dateRange) {
      case 'lastWeek':
        startDate = currentDate - 7 * 24 * 60 * 60 * 1000; // Son 1 hafta
        break;
      case 'lastMonth':
        startDate = currentDate - 30 * 24 * 60 * 60 * 1000; // Son 1 ay
        break;
      case 'lastYear':
        startDate = currentDate - 365 * 24 * 60 * 60 * 1000; // Son 1 yıl
        break;
      default:
        startDate = 0; // Tüm veriyi al
        break;
    }

    Object.keys(salesData).forEach((dateKey) => {
      if (new Date(dateKey).getTime() >= startDate) {
        const dailySales = salesData[dateKey];
        Object.keys(dailySales).forEach((tableKey) => {
          filtered = [...filtered, ...dailySales[tableKey]];
        });
      }
    });

    return filtered;
  };

  // Ürünleri ve kazancı hesaplama
  const calculateSalesStats = (sales) => {
    let totalRevenue = 0;
    let productSales = {};

    sales.forEach((sale) => {
      totalRevenue += parseFloat(sale.productPrice) * sale.quantity;
      if (productSales[sale.productName]) {
        productSales[sale.productName].quantity += sale.quantity;
        productSales[sale.productName].revenue += parseFloat(sale.productPrice) * sale.quantity;
      } else {
        productSales[sale.productName] = {
          quantity: sale.quantity,
          revenue: parseFloat(sale.productPrice) * sale.quantity,
        };
      }
    });

    return { totalRevenue, productSales };
  };

  const prepareProductSalesByQuantityChart = () => {
    const labels = Object.keys(productSales);
    const quantities = labels.map((label) => productSales[label].quantity);
  
    return {
      labels: labels,
      datasets: [
        {
          data: quantities,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
        },
      ],
    };
  };


const prepareRadarChartData = () => {
    const labels = Object.keys(productSales);
    const quantities = labels.map((label) => productSales[label].quantity);
    const revenues = labels.map((label) => productSales[label].revenue);
  
    return {
      labels: labels,
      datasets: [
        {
          label: 'Satış Miktarı',
          data: quantities,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Toplam Kazanç',
          data: revenues,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareRevenueDistributionChart = () => {
    const labels = Object.keys(productSales);
    const revenues = labels.map((label) => productSales[label].revenue);
  
    return {
      labels: labels,
      datasets: [
        {
          data: revenues,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
        },
      ],
    };
  };


  const prepareTopSellingProductsChart = () => {
    // Ürünleri kazançlara göre sıralıyoruz
    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1].revenue - a[1].revenue) // Kazanca göre azalan sırayla
      .slice(0, 5); // İlk 5 ürünü al
  
    const labels = sortedProducts.map((product) => product[0]); // Ürün adları
    const revenues = sortedProducts.map((product) => product[1].revenue); // Ürün kazançları
  
    return {
      labels: labels,
      datasets: [
        {
          label: 'Top 5 Best-Selling Products',
          data: revenues,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };



  // Pie Chart için verileri hazırlama
  const preparePieChartData = () => {
    const labels = Object.keys(productSales);
    const revenues = labels.map((label) => productSales[label].revenue);
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Total Revenue',
          data: revenues,
          backgroundColor: [
            '#FF6384', // Kırmızı
            '#36A2EB', // Mavi
            '#FFCE56', // Sarı
            '#4BC0C0', // Turkuaz
            '#FF9F40', // Turuncu
            '#C9CBCF', // Gri
          ], // Her dilime farklı renkler
          hoverOffset: 4,
        },
      ],
    };
  };

  const prepareDailyRevenueChart = () => {
    // Günlük kazançları topluyoruz
    const dailyRevenue = {};
  
    Object.keys(salesData).forEach((dateKey) => {
      const dailySales = salesData[dateKey];
      let totalDailyRevenue = 0;
  
      Object.keys(dailySales).forEach((tableKey) => {
        dailySales[tableKey].forEach((sale) => {
          totalDailyRevenue += parseFloat(sale.productPrice) * sale.quantity;
        });
      });
  
      dailyRevenue[dateKey] = totalDailyRevenue;
    });
  
    // Veriyi tarihlerle sıralayıp kazançları alıyoruz
    const labels = Object.keys(dailyRevenue);
    const revenues = labels.map((dateKey) => dailyRevenue[dateKey]);
  
    return {
      labels: labels,
      datasets: [
        {
          label: 'Günlük Kazanç',
          data: revenues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
  };

  // UseEffect Hook: Firebase'den verileri çekmek ve gerekli hesaplamaları yapmak
  useEffect(() => {
    fetchSalesData();
  }, [companyKey]);

  useEffect(() => {
    const filteredSales = filterSalesByDateRange(selectedDateRange);
    const { totalRevenue, productSales } = calculateSalesStats(filteredSales);
    setTotalRevenue(totalRevenue);
    setProductSales(productSales);
    setFilteredData(filteredSales);
  }, [selectedDateRange, salesData]);

  // Tarih aralığı seçimi
  const handleDateRangeChange = (e) => {
    setSelectedDateRange(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="profile-page">
        <SideMenu />
        <div className="current-profile-page">
          <h1>Sales Statistics</h1>

          <div>
            <label>Select Date Range: </label>
            <select onChange={handleDateRangeChange} value={selectedDateRange}>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>

          {/* Pie Chart */}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
      
            <div style={{ flex: 1}}>
                <Pie data={preparePieChartData()}   />
            </div>


            <div style={{ flex: 1}}>
                <h3>En Çok Satan Ürünler (Top 5 Best-Selling Products)</h3>
                <Bar data={prepareTopSellingProductsChart()} options={{ responsive: true }} />
            </div>

            </div>


            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ flex: 1}}>
                <h3> Günlük Kazanılan Para (Line Chart)</h3>
                <Line data={prepareDailyRevenueChart()} options={{ responsive: true }} />
            </div>

            <div style={{ flex: 1}}>
          <h3>Ürünlerin Miktarına Göre Satışları</h3>
          <Pie data={prepareProductSalesByQuantityChart()} options={{ responsive: true }} />
</div>


</div>
          <h3> Ürünlerin Kazançlarına Göre Dağılım</h3>
        <Doughnut data={prepareRevenueDistributionChart()} options={{ responsive: true }} />

        <h3>Ürün Satış Miktarları ve Kazançları (Radar Chart)</h3>
        <Radar data={prepareRadarChartData()} options={{ responsive: true }} />

          {/* List of products and sales */}
          <h3>Product Sales</h3>
          <ul>
            {Object.keys(productSales).map((productName) => (
              <li key={productName}>
                {productName}: {productSales[productName].quantity} sold, Total Revenue: ${productSales[productName].revenue.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Statistics;
