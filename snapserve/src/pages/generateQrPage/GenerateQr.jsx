import React, { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../createMenuPage/CreateMenu.css';
import { addTable, deleteTable, getCompanyData } from "../../services/companyService";
import { QRCodeCanvas } from 'qrcode.react';
import './generateQrPage.css';
import Header from "../../components/header/Header";
import SideMenu from "../../components/sidemenu/SideMenu";

const baseURL = "http://localhost:3000/mobilemenu";

function GenerateQr (){
  const { user, companyKey, logout } = useAuth();
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [companyData, setCompanyData] = useState();
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTableKey, setSelectedTableKey] = useState(null);

  const addNewTable = async () => {
    await addTable(companyKey);
    // Optionally, fetch tables again to update state
  };

  const deleteATable = async (key) => {
    await deleteTable(key, companyKey);
    setTables(tables.filter(table => table.tableKey !== key)); // Update state
    setShowDeleteModal(false); // Close the modal
    setTimeout(() => {
      alert("Table deleted successfully");
    }, 300); // 300ms delay (you can adjust the delay)
  };

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyData(companyKey);
        setCompanyData(data);

        const tables = Object.entries(data.tables).map(([key, value]) => ({
          tableKey: key,
          tableID: value.tableID,
          tableName: value.tableName,
          tableQRBase64Data: value.tableQRBase64Data
        }));

        setTables(tables);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    if (companyKey) {
      fetchCompany();
    }
  }, [companyKey]);

  const handleOpenQrModal = (tableKey) => {
    setQrData(`${baseURL}?cid=${companyKey}&tid=${tableKey}`);
    setShowQrModal(true);
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
  };

  const handleOpenDeleteModal = (tableKey) => {
    setSelectedTableKey(tableKey);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

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
            <div className="table-area">
              <div className="table-container">
                {tables.map(table => (
                  <div className="tables" key={table.tableID}>
                    <div className="table-top-part">
                      <img src={`${process.env.PUBLIC_URL}/table-photo.png`} alt="table-photo" />
                      <button
                        className="delete-icon"
                        onClick={() => handleOpenDeleteModal(table.tableKey)}
                      >
                        <img src={`${process.env.PUBLIC_URL}/Delete.png`} alt="delete-icon" />
                      </button>
                    </div>
                    <div className="table-bottom-part">
                      <h5>{companyData.menuName}</h5>
                      <p>Table No: {table.tableID}</p>
                      <button onClick={() => handleOpenQrModal(table.tableKey)}>Get QR Code</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Modal */}
          {showQrModal && (
            <div className="modal-overlay">
              <div className="qr-modal-content">
                <p>{qrData}</p>
                <QRCodeCanvas  value={qrData} size={240} />
                <div className="qr-buttons">
                  <button className="qr-download-button">Download</button>
                  <button className="qr-cancel-button"onClick={handleCloseQrModal}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="delete-modal-content">
                <p className="delete-modal-text">Are you sure you want to delete this Table?</p>
                <div className="model-confirm-buttons">
                  <button
                    className="modal-save-confirm-button"
                    onClick={() => deleteATable(selectedTableKey)}
                  >
                    Delete
                  </button>
                  <button className="modal-delete-confirm-button" onClick={handleCloseDeleteModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
}

export default GenerateQr;