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


const Statistics = () => {

  const [activeTab, setActiveTab] = useState("Income Tracking");

  function createData(name, productCategory, calories, fat) {
    return { name, productCategory, calories, fat};
  }

  const rows = [
    createData('Frozen yoghurt', 'dessert', 159, 6.0),
    createData('Ice cream sandwich', 'dessert', 237, 9.0),
    createData('Eclair','dessert', 262, 16.0),
    createData('Cupcake', 'dessert', 305, 3.7),
    createData('Gingerbread', 'dessert', 356, 16.0),
    createData('Frozen yoghurt', 'dessert', 159, 6.0),
    createData('Ice cream sandwich', 'dessert', 237, 9.0),
    createData('Eclair','dessert', 262, 16.0),
    createData('Cupcake', 'dessert', 305, 3.7),
    createData('Gingerbread', 'dessert', 356, 16.0),
    createData('Frozen yoghurt', 'dessert', 159, 6.0),
    createData('Ice cream sandwich', 'dessert', 237, 9.0),
    createData('Eclair','dessert', 262, 16.0),
    createData('Cupcake', 'dessert', 305, 3.7),
    createData('Gingerbread', 'dessert', 356, 16.0),
    createData('Frozen yoghurt', 'dessert', 159, 6.0),
    createData('Ice cream sandwich', 'dessert', 237, 9.0),
    createData('Eclair','dessert', 262, 16.0),
    createData('Cupcake', 'dessert', 305, 3.7),
    createData('Gingerbread', 'dessert', 356, 16.0),
  ];

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
                <p>Showing Daily Income Results</p>
                <button className='statistics-filter'>Filter</button>
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
                    {rows.map((row) => (
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
                    <div className='revenue-bar'> $150000</div>
                    <p>Total Daily Income</p>
                  </div>
                </div>
              </div>
            </div>}
            {activeTab === "Detailed Statistics" && 
            
            <div>
                <button className='graph-filter-button'>
                  Filter Button Area
                </button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
