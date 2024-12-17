import React, { useEffect, useState } from "react";
import './OrderTracking.css';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu";
import { fetchTablesAndOrders } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";


function OrderTracking (){
    
    const { user, username, companyKey, logout } = useAuth();
    const [tables, setTables] = useState([]);

    useEffect(() => {
      const loadTablesAndOrders = async () => {
        const tablesData = await fetchTablesAndOrders(companyKey);
        setTables(tablesData);
      };
  
      loadTablesAndOrders();
    }, [companyKey]);


    return (
            <div className="profile-page">
                <SideMenu />
                <div className="current-profile-page">
                    <div className="page-info-text">
                        <h5>Active Orders</h5>
                        <button>Add Order Manually</button>
                    </div>
                    <div className="order-area">

                    <div>
      <h1>Tables and Orders</h1>
      {tables.length > 0 ? (
        tables.map((table) => (
          <div key={table.tableKey} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
            <h2>Table: {table.tableId}</h2>
            {table.orders.length > 0 ? (
              table.orders.map((order) => (
                <div key={order.orderId} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px' }}>
                  <h3>Order ID: {order.orderId}</h3>
                  <p>Status: {order.status}</p>
                  <p>Created At: {order.createdAt}</p>
                  <h4>Products:</h4>
                  <ul>
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.productName} - {product.quantity} x {product.productPrice} TL = {product.totalPrice} TL
                      </li>
                    ))}
                  </ul>
                  <p><strong>Total Amount: {order.totalAmount} TL</strong></p>
                </div>
              ))
            ) : (
              <p>No orders found for this table.</p>
            )}
          </div>
        ))
      ) : (
        <p>No tables found.</p>
      )}
    </div>
    
                        <div className="order-container">
                            <div className="container-top-part">
                                <img src={`${process.env.PUBLIC_URL}/order-photo.png`} alt="order-photo" />
                                <p>Tablo NO</p>
                            </div>
                            <div className="container-bottom-part">
                                <div className="container-edit-area">
                                    <p>Orders</p>
                                    <button className="edit-icon-button"><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" /></button>
                                </div>
                                <hr/>
                                <div className="order-detail">
                                    <p>Order Name & Amount</p>
                                    <p>Price</p>
                                </div>
                                <hr/>
                                <div className="order-total-info">
                                    <p>Total:</p>
                                    <p>Total Price</p>
                                </div>
                                <hr/>
                                <button className="settle-up-button">Settle Up</button>
                            </div>
                        </div>
                    </div>            
                </div>
            </div>

    )
}
export default OrderTracking
