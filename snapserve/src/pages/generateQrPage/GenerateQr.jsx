import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';
import '../createMenuPage/CreateMenu.css';
import { addTable, deleteTable, getCompanyData } from "../../services/companyService";
import { QRCodeCanvas } from 'qrcode.react';


function GenerateQr (){
    const { user, companyKey, logout } = useAuth();
    console.log(user ? user.displayName : "empty")

    const navigate = useNavigate();
    const handleLoginRedirect = () => {
        logout();
        navigate('/login'); // Login sayfasına yönlendir
    };

    const handleSignupRedirect = () => {
        logout();
        navigate('/signup'); // Login sayfasına yönlendir
    };

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
  const handleOpenModal = (item) => {
 
    setQrData("blablablbalbal.bla?id="+item); // QR kodu için URL verisini ayarlıyoruz
    setShowModal(true); // Modal'ı açıyoruz
  };

  // Modal'ı kapatmak için fonksiyon
  const handleCloseModal = () => {
    setShowModal(false); // Modal'ı kapatıyoruz
  };


    return (
      companyData != null ? (
      <div className="profile-page">
        <div className="profile-menu">
            <div className="user-info-container">
            <h3>PROFILE INFORMATION</h3>
            <div className="userinfo">
                <h4>XYZ Company</h4>
                <h5 className="username">{user ? user.displayName: "empty"}</h5>
                <img src="" alt="" />
            </div>
            </div>
            <div className="profile-navigation">
            <h5>GENERAL</h5>
            <button><Link to="/createmenü">Create Menü</Link></button>
            <button>Generate QR</button>
            <button>Order Tracking</button>
            <button>Statistics</button>
            <button onClick={handleLogoutRedirect}>Logout</button>
            <button onClick={handleLoginRedirect}>Go to Login</button>
            <button onClick={handleSignupRedirect}>Go to Signup</button>
            </div>
        </div>
        <div className="current-profile-page">
            <h5>Create Tables & QR Codes</h5>
            <hr />
            <div className="menu-container">
                <div className="menu-item-container">
                    <div className="menu-item add-item">
                    <button onClick={addNewTable}>Add Table</button>
                    <div>
                        {tables.map(table => (
                        <div key={table.tableID} style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '200px' }}>
                            <p>Masa No: {table.tableID}</p>
                            <button onClick={() => handleOpenModal(table.tableID)}>Get QR Code</button>
                            <button onClick={() => deleteATable(table.tableKey)}>Delete</button>
                        </div>
                        ))}
                    </div>
                </div>
                
            </div>

            </div>
        </div>
             {/* Modal Gösterimi */}
      {showModal && tables && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            
            <QRCodeCanvas value={qrData} size={256} /> {/* QR kodunu render ediyoruz */}
            <button onClick={handleCloseModal}>Kapat</button>
          </div>
        </div>
      )}
      </div>
    ) : (<h2>Yükleniyor..</h2>));
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