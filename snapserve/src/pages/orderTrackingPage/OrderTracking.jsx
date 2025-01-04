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
  const [isSettleOverlayOpen, setSettleIsOverlayOpen] = useState(false); // Overlay'i kontrol eden state

  const [selectedTableKey, setSelectedTableKey] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null); // Active category state

  const openEditOrderModal = () => setIsEditOrderModalOpen(true);
  const closeEditOrderModal = () => setIsEditOrderModalOpen(false);
  

  const openSettleOverlay = (tableKey, totalAmount) => {
    setSelectedTableKey(tableKey);
    setTotalAmount(totalAmount);
    setSettleIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
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
      setSettleIsOverlayOpen(false)
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
            <button onClick={() => setIsOverlayOpen(true)}>Add Order Manually</button>
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

                          {/* edit order eklendi ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */}
                          {isEditOrderModalOpen && (
                              <div className="edit-order-comp">
                                <div className="add-order-overlay">
                                  <div className="close-button-area">
                                    <button onClick={closeEditOrderModal} className="order-overlay-close-button">&times;</button>
                                  </div>
                                  <div className="overlay-sides">
                                  <div className="add-order-left">
                                      <div className="edit-order-top-part">
                                        <p>Edit Order</p>
                                        <button className="edit-order-delete-button">
                                          <img className="edit-order-delete-img" src={`${process.env.PUBLIC_URL}/Delete.png`} alt="delete-icon" />
                                        </button>
                                      </div>
                                    <select>
                                      <option value="">Select Table</option>
                                      {tables.map((table) => (
                                        <option key={table.tableKey} value={table.tableKey}>{table.tableId}</option>
                                      ))}
                                    </select>
                                    <p className="add-item-text">Add Item</p>
                                    <div className="category">
                                      <h4 onClick={() => toggleCategory("mainDishes")}>Main Dishes</h4>
                                      {activeCategory === "mainDishes" && (
                                        <ul>
                                          <li>Pizza <button >+</button></li>
                                          <li>Doner <button>+</button></li>
                                          <li>Pasta <button>+</button></li>
                                        </ul>
                                      )}
                                    </div>
                                    <div className="category">
                                      <h4 onClick={() => toggleCategory("desserts")}>Desserts</h4>
                                      {activeCategory === "desserts" && (
                                        <ul>
                                          <li>Ice Cream <button>+</button></li>
                                          <li>Cake <button>+</button></li>
                                          <li>Pudding <button>+</button></li>
                                        </ul>
                                      )}
                                    </div>
                                    <div className="category">
                                      <h4 onClick={() => toggleCategory("drinks")}>Drinks</h4>
                                      {activeCategory === "drinks" && (
                                        <ul>
                                          <li>Cola <button>+</button></li>
                                          <li>Tea <button>+</button></li>
                                          <li>Water <button>+</button></li>
                                        </ul>
                                      )}
                                    </div>
                                    <div className="category">
                                      <h4 onClick={() => toggleCategory("snacks")}>Snacks</h4>
                                      {activeCategory === "snacks" && (
                                        <ul>
                                          <li>Chips <button>+</button></li>
                                          <li>Popcorn <button>+</button></li>
                                          <li>Nuts <button>+</button></li>
                                        </ul>
                                      )}
                                    </div>
                                  </div>
                                  <div className="add-order-right">
                                    <h4>Order Details</h4>
                                    <div className="order-details">
                                        <div className="order-item-continer">
                                          <div className="order-item-details">
                                            <p className="choosen-order-items">Pizza</p>
                                            <div className="arrange-order-item">
                                              <button className="mobile-product-remove-button"><p>-</p></button>
                                                <p>5</p> 
                                                <button className="mobile-product-add-button"><p>+</p></button>
                                            </div>
                                          </div>
                                          <div className="order-item-price">
                                            <p>$15</p>
                                          </div>
                                        </div>
                                    </div>
                                    <div className="order-total-fee">
                                      <p>Total Fee</p>
                                      <p>$50</p>
                                    </div>
                                    <button className="save-button">Save</button>
                                  </div>
                                  </div>
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
                          onClick={() => openSettleOverlay(table.tableKey, totalAmount)}
                        >
                          Complete Order
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
        <div className="add-order-comp">
          <div className="add-order-overlay">
            <div className="close-button-area">
              <button onClick={closeOverlay} className="order-overlay-close-button">&times;</button>
            </div>
            <div className="overlay-sides">
            <div className="add-order-left">
              <h4>Choose Table No</h4>
              <select>
                <option value="">Select Table</option>
                {tables.map((table) => (
                  <option key={table.tableKey} value={table.tableKey}>{table.tableId}</option>
                ))}
              </select>
              <p className="add-item-text">Add Item</p>
              <div className="category">
                <h4 onClick={() => toggleCategory("mainDishes")}>Main Dishes</h4>
                {activeCategory === "mainDishes" && (
                  <ul>
                    <li>Pizza <button >+</button></li>
                    <li>Doner <button>+</button></li>
                    <li>Pasta <button>+</button></li>
                  </ul>
                )}
              </div>
              <div className="category">
                <h4 onClick={() => toggleCategory("desserts")}>Desserts</h4>
                {activeCategory === "desserts" && (
                  <ul>
                    <li>Ice Cream <button>+</button></li>
                    <li>Cake <button>+</button></li>
                    <li>Pudding <button>+</button></li>
                  </ul>
                )}
              </div>
              <div className="category">
                <h4 onClick={() => toggleCategory("drinks")}>Drinks</h4>
                {activeCategory === "drinks" && (
                  <ul>
                    <li>Cola <button>+</button></li>
                    <li>Tea <button>+</button></li>
                    <li>Water <button>+</button></li>
                  </ul>
                )}
              </div>
              <div className="category">
                <h4 onClick={() => toggleCategory("snacks")}>Snacks</h4>
                {activeCategory === "snacks" && (
                  <ul>
                    <li>Chips <button>+</button></li>
                    <li>Popcorn <button>+</button></li>
                    <li>Nuts <button>+</button></li>
                  </ul>
                )}
              </div>
            </div>
            <div className="add-order-right">
              <h4>Order Details</h4>
              <div className="order-details">
                  <div className="order-item-continer">
                    <div className="order-item-details">
                      <p className="choosen-order-items">Pizza</p>
                      <div className="arrange-order-item">
                        <button className="mobile-product-remove-button"><p>-</p></button>
                         <p>5</p> 
                         <button className="mobile-product-add-button"><p>+</p></button>
                      </div>
                    </div>
                    <div className="order-item-price">
                      <p>$15</p>
                    </div>
                  </div>
              </div>
              <div className="order-total-fee">
                <p>Total Fee</p>
                <p>$50</p>
              </div>
              <button className="save-button">Save</button>
            </div>
            </div>
          </div>
        </div>
      )}

      {isSettleOverlayOpen && (
        <div className="modal-overlay">
          <div className="settleUp-modal-content">
            <h2>Are you sure you want to settle up the total amount of ${totalAmount} for this table?</h2>
            <div className="model-confirm-buttons">
              <button
                onClick={() => handleSettleUp()}
                className="modal-save-confirm-button"
              >
                Settle Up
              </button>
              <button
                onClick={() => setSettleIsOverlayOpen(false)}
                className="modal-delete-confirm-button"
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
