import React, { useEffect, useState } from "react";
import './OrderTracking.css';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu";
import { fetchTablesAndOrders, increaseProductQuantity, removeProduct, settleUp } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/Header";

function OrderTracking () {
  const { user, username, companyKey, logout } = useAuth();
  const [tables, setTables] = useState([]);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay'i kontrol eden state
  const [selectedTableKey, setSelectedTableKey] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const openEditOrderModal = () => setIsEditOrderModalOpen(true);
  const closeEditOrderModal = () => setIsEditOrderModalOpen(false);

  const openOverlay = (tableKey, totalAmount) => {
    setSelectedTableKey(tableKey);
    setTotalAmount(totalAmount);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };


  useEffect(() => {
    fetchTablesAndOrders(companyKey, setTables);
  }, [companyKey]);

  function mergeProductsFromOrders(orders) {
    const productMap = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (productMap[product.productName]) {
          productMap[product.productName].quantity += product.quantity;
          productMap[product.productName].totalPrice += product.totalPrice;
        } else {
          productMap[product.productName] = {
            productName: product.productName,
            quantity: product.quantity,
            productPrice: product.productPrice,
            totalPrice: product.totalPrice,
          };
        }
      });
    });

    return Object.values(productMap);
  }

  const handleSettleUp = async () => {
    try {
      await settleUp(companyKey, selectedTableKey);
      closeOverlay();
      setTimeout(() => {
        alert("Settled Up successfully");
      }, 300); // 300ms delay (you can adjust the delay)
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>  
      <Header/>
      <div className="profile-page">
        <SideMenu />
        <div className="current-profile-page">
          <div className="page-info-text">
            <h5>Active Orders</h5>
            <button>Add Order Manually</button>
          </div>
          <div className="order-area">
            {tables.length > 0 ? (
              tables.map((table) => {
                const mergedProducts = mergeProductsFromOrders(table.orders);
                let totalAmount = 0;

                table.orders.forEach(order => {
                  totalAmount += parseFloat(order.totalAmount) || 0;
                });

                return (
                  <div key={table.tableKey} className="order-container">
                    <div className="container-top-part">
                      <img src={`${process.env.PUBLIC_URL}/order-photo.png`} alt="order-photo" />
                      <p>{table.tableId}</p>
                    </div>
                    {table.orders.length > 0 ? (
                      <div className="container-bottom-part">
                        <div className="container-edit-area">
                          <p>Orders</p>
                          <button className="edit-icon-button" onClick={openEditOrderModal}>
                            <img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" />
                          </button>
                          {isEditOrderModalOpen && (
                            <div className="modal-overlay">
                              <div className="edit-order-modal-overlay">
                                <span onClick={closeEditOrderModal}>&times;</span>
                                <h2>Modal Başlığı</h2>
                                <p>Modal içerik buraya gelecek.</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {mergedProducts.map((product) => (
                          <div className="order-detail" key={product.productName}>
                            <p className="product-name-count">{product.quantity} x {product.productName}</p>
                            <p className="p-total-price">${product.productPrice}</p>
                          </div>
                        ))}
                        <div className="order-total-info">
                          <p>Total:</p>
                          <p>${totalAmount}</p>
                        </div>
                        <button
                          className="settle-up-button"
                          onClick={() => openOverlay(table.tableKey, totalAmount)}
                        >
                          Settle Up
                        </button>
                      </div>
                    ) : (
                      <p>No orders found for this table.</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No tables found.</p>
            )}
          </div>   
        </div>
      </div>

      {/* Overlay Modal */}
      {isOverlayOpen && (
        <div className="modal-overlay">
          <div className="settleUp-modal-content">
            <h2>Are you sure you want to settle up the total amount of ${totalAmount} for this table?</h2>
            <div>
              <button
                onClick={handleSettleUp}
              >
                Settle Up
              </button>
              <button
                onClick={closeOverlay}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderTracking;
