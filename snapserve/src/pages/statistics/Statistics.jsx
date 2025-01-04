import React, { useEffect, useState } from 'react';
import { database, ref, get } from '../../firebase';
import { Bar, Pie, Line, Doughnut, Radar } from 'react-chartjs-2'; // Chart.js Pie grafik için
import { useAuth } from '../../context/AuthContext';
import SideMenu from '../../components/sidemenu/SideMenu';
import Header from '../../components/header/Header';
import { Chart as ChartJS, CategoryScale, RadialLinearScale
    , LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

    import Table from '@mui/material/Table';
    import TableBody from '@mui/material/TableBody';
    import TableCell from '@mui/material/TableCell';
    import TableContainer from '@mui/material/TableContainer';
    import TableHead from '@mui/material/TableHead';
    import TableRow from '@mui/material/TableRow';
    import Paper from '@mui/material/Paper';

import './Statistics.css';
import ProductPieChart from './ProductPieChart';
import CategoryPieChart from './CategoryPieChart';
import TimeLineChart from './TimeLineChart';


// Tarihleri karşılaştırabilmek için yardımcı fonksiyonlar
const getStartOfDay = (date) => new Date(date.setHours(0, 0, 0, 0)).getTime();
const getStartOfMonth = (date) => new Date(date.setDate(1)).getTime();
const getStartOfYear = (date) => new Date(date.setMonth(0, 1)).getTime();

// Son 7 gün için başlangıç tarihini alıyoruz
const getStartOfLast7Days = (date) => {
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 7);  // 7 gün öncesini hesaplıyoruz
  return getStartOfDay(startDate); // 7 gün öncesini gece yarısı olarak alıyoruz
};

const getStartOfLast30Days = (date) => {
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 30);  // 30 gün öncesini hesaplıyoruz
  return getStartOfDay(startDate); // 30 gün öncesini gece yarısı olarak alıyoruz
};

// Son 365 gün için başlangıç tarihini alıyoruz
const getStartOfLast365Days = (date) => {
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 365); // 365 gün öncesini hesaplıyoruz
  return getStartOfDay(startDate); // İlk günü gece yarısı olarak alıyoruz
};


const Statistics = () => {
  const { user, username, companyKey, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Income Tracking");
  const [salesData, setSalesData] = useState([]);


  const [filterTitle, setFilterTitle] = useState("Daily");


  // Veriyi zaman dilimine göre filtreleme fonksiyonu
const filterSalesData = (salesData, timePeriod) => {
  const currentTime = new Date();
  let startTime;

  

  switch (timePeriod) {
    case 'daily':
      startTime = getStartOfDay(new Date(currentTime)); // Son 1 gün
      setFilterTitle("Daily");
      break;
    case 'weekly':
      startTime = getStartOfLast7Days(new Date(currentTime)); // Son 7 gün
      setFilterTitle("Weekly");
      break;
    case 'monthly':
      startTime = getStartOfLast30Days(new Date(currentTime)); // Son 1 ay
      setFilterTitle("Monthly");
      break;
    case 'yearly':
      startTime = getStartOfLast365Days(new Date(currentTime)); // Son 1 yıl
      setFilterTitle("Yearly");
      break;
    default:
      startTime = 0; // Herhangi bir zaman dilimi girilmezse
  }

  // Filtrelenmiş verileri döndürme
  const filteredData = {};
  
  // Veriyi her gün için kontrol et
  for (const [dateKey, orders] of Object.entries(salesData)) {
    if (new Date(dateKey).getTime() >= startTime) {
      filteredData[dateKey] = orders;
    }
  }
  return filteredData;
};


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

  useEffect(() => {
    if(companyKey) {
      fetchSalesData();
    }

  }, [companyKey]);


  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    if (salesData) {
      // İlk başta veriyi günlük olarak filtreliyoruz
      const dailyData = filterSalesData(salesData, 'daily');
      setFilteredData(dailyData);
    }
  }, [salesData]);

    // Butonlar veya kullanıcı etkileşimi ile zaman dilimini değiştirme
    const handleTimePeriodChange = (timePeriod) => {
      const newFilteredData = filterSalesData(salesData, timePeriod);
      setFilteredData(newFilteredData);
    };

  // Döngü ile veriyi işle
let rowsA = []; // Sonuçları saklamak için bir dizi
const resulta = [
  createData('Frozen yoghurt', 'dessert', 159, 6.0)
];

const [result, setResult] = useState([]);
const [totalPrice, setTotalPrice] = useState();


useEffect(() => {
  const newResult = [];
  let total = 0;

  for (const [dateKey, orders] of Object.entries(filteredData)) {
    for (const [orderKey, products] of Object.entries(orders)) {
      products.forEach(product => {
        const { productName, productPage, productPrice, quantity } = product;

        const price = parseFloat(productPrice);

        if (isNaN(price)) {
          console.error('Geçersiz fiyat veya miktar:', { price });
          return;
        }
      
        total += price * quantity;
  
        const existingProduct = newResult.find(item => item.name === productName && item.productCategory === productPage);

        if (existingProduct) {
          existingProduct.calories += quantity;
          existingProduct.fat += price * quantity;
        } else {
          // Sonuç dizisine yeni ürün ekliyoruz
          newResult.push(createData(productName, productPage, quantity, price * quantity));
        }
      });
    }
  }

  // Veriyi state'e ekliyoruz
  setTotalPrice(total);
  setResult(newResult);
  

},[filteredData])

  function createData(name, productCategory, calories, fat) {
    return { name, productCategory, calories, fat};
  }

  const [activeTabIndex, setActiveTabIndex] = useState(0); // Aktif tab'ı tutacak state

  const handleTabClick = (index) => {
    setActiveTabIndex(index); // Tıklanan tab'a geçiş yap

    if(index == 0){
      handleTimePeriodChange('daily');

    }else if(index == 1){
      handleTimePeriodChange('weekly');

    }else if(index == 2){
      handleTimePeriodChange('monthly');
    }else{
      handleTimePeriodChange('yearly')
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <SideMenu />
        <div className="current-profile-page">
          <nav className="statistics-sub-menu">
            <a
              href="#Income Tracking"
              className={activeTab === "Income Tracking" ? "statistics-active-tab" : ""}
              onClick={() => setActiveTab("Income Tracking")}
            >
              Income Tracking
            </a>
            <a
              href="#Detailed Statistics"
              className={activeTab === "Detailed Statistics" ? "statistics-active-tab" : ""}
              onClick={() => setActiveTab("Detailed Statistics")}
            >
              Detailed Statistics
            </a>
          </nav>
          {/* İçerik Bölümü */}
          <div className="statistics-tab-content">
            {activeTab === "Income Tracking" && 
            <div>
         
              <div className='income-tracking-filter-area'>
                <p>Showing Income Results</p>
                <div className="statistics-income-filter-tabs">
                  <button
                    className={activeTabIndex === 0 ? "active" : ""}
                    onClick={() => handleTabClick(0)}
                  >
                    Daily
                  </button>
                  <button
                    className={activeTabIndex === 1 ? "active" : ""}
                    onClick={() => handleTabClick(1)}
                  >
                    Weekly (Last 7 days)
                  </button>
                  <button
                    className={activeTabIndex === 2 ? "active" : ""}
                    onClick={() => handleTabClick(2)}
                  >
                    Monthly
                  </button>
                  <button
                    className={activeTabIndex === 3 ? "active" : ""}
                    onClick={() => handleTabClick(3)}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <div className='income-tracking-bg'>
                <div className='income-details-container'>
                  <div className='list-of-product-sold'>
                                <TableContainer className='table-container' sx={{
                                  width:"100%",
                                  maxHeight: 500,
                                  minHeight: 500,
                                  boxShadow: "rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;", // Gölge ayarı
                                }}  component={Paper}>
                <Table sx={{}} stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '38%' }}>Product Name</TableCell>
                      <TableCell sx={{ width: '28%' }} align="left">Product Category</TableCell>
                      <TableCell sx={{ width: '17%' }} align="left">
                        Sales Amount
                      </TableCell>
                      <TableCell sx={{ width: '17%' }} align="left">
                        Revenue &nbsp;($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell sx={{ width: '38%' }}>{row.name}</TableCell>
                        <TableCell sx={{ width: '28%' }} align="left">
                          {row.productCategory}
                        </TableCell>
                        <TableCell sx={{ width: '17%' }} align="left">
                          {row.calories}
                        </TableCell>
                        <TableCell sx={{ width: '17%' }} align="left">
                          {row.fat}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
                  </div>
                  <div className='total-revenue-container'>
                    <p>28.12.2024</p>
                    <div className='revenue-bar'>${totalPrice}</div>
                    <p>Total {filterTitle} Revenue</p>
                  </div>
                </div>
              </div>
            </div>}
            {activeTab === "Detailed Statistics" && 
            
            <div>
               {/* <button className='graph-filter-button'>
                  Filter Button Area
                </button> */}

                {
  filteredData &&

                <div style={{paddingTop: "15px"}}>
   <div className="statistics-income-filter-tabs">
                  <button
                    className={activeTabIndex === 0 ? "active" : ""}
                    onClick={() => handleTabClick(0)}
                  >
                    Daily
                  </button>
                  <button
                    className={activeTabIndex === 1 ? "active" : ""}
                    onClick={() => handleTabClick(1)}
                  >
                    Weekly (Last 7 days)
                  </button>
                  <button
                    className={activeTabIndex === 2 ? "active" : ""}
                    onClick={() => handleTabClick(2)}
                  >
                    Monthly
                  </button>
                  <button
                    className={activeTabIndex === 3 ? "active" : ""}
                    onClick={() => handleTabClick(3)}
                  >
                    Yearly
                  </button>
                </div>
      <div className='chart-style-st' >
      <h2 className='chart-titles'>Income per Product</h2>
      <ProductPieChart data={filteredData} />
      </div>
      <div className='chart-style-st' >
      <h2 className='chart-titles'>Income per Category</h2>
      <CategoryPieChart data={filteredData} />
      </div>
      <div className='chart-style-st' >
      <h2 className='chart-titles'>{filterTitle} Income</h2>

      <TimeLineChart data={filteredData} timeUnit={filterTitle == " Daily" ? "daily" : filterTitle == "Monthly" ? "month" : "year" } />
      </div>


    </div>
    }
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
