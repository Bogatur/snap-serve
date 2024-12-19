import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';
import '../createMenuPage/CreateMenu.css';
import { addTable, deleteTable, getCompanyData } from "../../services/companyService";
import { QRCodeCanvas } from 'qrcode.react';
import './generateQrPage.css';
import Header from "../../components/header/Header";
import SideMenu from "../../components/sidemenu/SideMenu";



const baseURL = "http://localhost:3000/mobilemenu";

function GenerateQr (){
  const { user, username, companyKey, logout } = useAuth();
    console.log(user ? user.displayName : "empty")

    const navigate = useNavigate();

    const handleLogoutRedirect = () => {
        logout();
        navigate('/login'); // Login sayfasına yönlendir
    };

    const [tables, setTables] = useState([]);

    const addNewTable = async() => {
      addTable(companyKey); // firebase add
    //  setTables([...tables, { id: tableCounter }]);
    //  setTableCounter(tableCounter + 1);
    };
  
    const deleteATable = (key) => {
        deleteTable(key, companyKey);
   //   setTables(tables.filter(table => table.id !== id));
    };


    const[companyData, setCompanyData] = useState();

    useEffect(() => {
        const fetchCompany = async () => {
          try {
            const companyData = await getCompanyData(companyKey);
            setCompanyData(companyData);

            const tables = Object.entries(companyData.tables).map(([key, value]) => ({
                tableKey : key,
                tableID: value.tableID,
                tableName: value.tableName,
                tableQRBase64Data: value.tableQRBase64Data
              }));
      


          setTables(tables);
          } catch (error) {
            console.error('Şirket verisi alınırken hata oluştu:', error);
          }
        };
    
        if( companyKey) {
          fetchCompany();
        }
    
      }, [companyKey]);


      const [showModal, setShowModal] = useState(false); // Modal'ın görünür olup olmadığını kontrol eden state
      const [qrData, setQrData] = useState(''); // QR kodu verisi


        // Modal'ı açmak için butona tıklanıldığında çağrılan fonksiyon
  const handleOpenModal = (tableKey) => {
 
    setQrData(baseURL+"?cid="+companyKey+"&tid="+tableKey); // QR kodu için URL verisini ayarlıyoruz
    setShowModal(true); // Modal'ı açıyoruz
  };

  // Modal'ı kapatmak için fonksiyon
  const handleCloseModal = () => {
    setShowModal(false); // Modal'ı kapatıyoruz
  };

  useEffect(() => {
    console.log(" a public path: " + process.env.PUBLIC_URL);
  },[]);


    return (
      <>
      <Header />
      {companyData != null ? (
      <div className="profile-page">
        <SideMenu />
        <div className="current-profile-page">
            <div className="page-info-text">
              <h5>Create Tables & QR Codes</h5>
              <button onClick={addNewTable}>Add Table</button>
            </div>
            <div>
                <div className="table-container">
                    {tables.map(table => (
                      <div className="tables" key={table.tableID}>
                        <div className="table-top-part">
                          <img src={`${process.env.PUBLIC_URL}/table-photo.png`} alt="table-photo" />
                          <button className="delete-icon"onClick={() => deleteATable(table.tableKey)}><img src={`${process.env.PUBLIC_URL}/Delete.png`} alt="delete-icon" /></button>
                        </div>
                        <div className="table-bottom-part">
                          <h5>{companyData.menuName}</h5>
                          <p>Table No: {table.tableID}</p>
                          <button onClick={() => handleOpenModal(table.tableKey, companyKey)}>Get QR Code</button>
                        </div>
                      </div>
                     ))}
                </div>
            </div>
        </div>
             {/* Modal Gösterimi */}
      {showModal && tables && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <p>{qrData}</p>
            <QRCodeCanvas value={qrData} size={256} />  {/*qr code ürettiğimiz kısım */}
            <button onClick={handleCloseModal}>Kapat</button>
          </div>
        </div>
      )}

      </div>
    ) : (<h2>Yükleniyor..</h2>)}
    </>
  );
}
// Basit modal stilleri
const modalStyles = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const modalContentStyles = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  };

export default GenerateQr