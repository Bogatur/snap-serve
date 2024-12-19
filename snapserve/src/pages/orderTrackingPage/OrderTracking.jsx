import React, { useEffect, useState } from "react";
import './OrderTracking.css';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu";
import { fetchTablesAndOrders, settleUp } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";


function OrderTracking (){
    
  
    const { user, username, companyKey, logout } = useAuth();
    const [tables, setTables] = useState([]);
    

    useEffect(() => {
      const loadTablesAndOrders = async () => {
        const tablesData = await fetchTablesAndOrders(companyKey);
       // setTables(tablesData);
        const tablesWithOrders = tablesData.filter(table => table.orders.length > 0);
        setTables(tablesWithOrders);
      };
  
      loadTablesAndOrders();
    }, [companyKey]);

    useEffect(() => {
    

    },[])


    function mergeProductsFromOrders(orders) {
      const productMap = {};
    
      // Tüm siparişlerdeki ürünleri gez
      orders.forEach((order) => {
        order.products.forEach((product) => {
          // Ürün zaten map'te varsa miktarını artır
          if (productMap[product.productName]) {
            productMap[product.productName].quantity += product.quantity;
            productMap[product.productName].totalPrice += product.totalPrice;
          } else {
            // Ürün daha önce eklenmediyse, yeni bir giriş ekle
            productMap[product.productName] = {
              productName: product.productName,
              quantity: product.quantity,
              productPrice: product.productPrice,
              totalPrice: product.totalPrice,
            };
          }
        });
      });
    
      // Birleştirilmiş ürünleri bir diziye dönüştür
      return Object.values(productMap);
    }


  const handleSettleUp = async (tableKey) => {
    try {
      await settleUp(companyKey, tableKey);
  
    } catch (err) {
        alert(err);
      }
  };


    return (
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
    // Siparişlerdeki ürünleri birleştiren fonksiyonu burada çağırıyoruz
    const mergedProducts = mergeProductsFromOrders(table.orders);

    return (

      
      
 <div key={table.tableKey} className="order-container">

    
        <div className="container-top-part">
                                <img src={`${process.env.PUBLIC_URL}/order-photo.png`} alt="order-photo" />
                                <p>{table.tableId}</p>
                            </div>
        {table.orders.length > 0 ? (
  (() => {
    // Tüm siparişlerdeki ürünleri birleştir
    const productMap = {};
    let totalAmount = 0;
    // Tüm siparişlerdeki ürünleri gez
    table.orders.forEach((order) => {
      order.products.forEach((product) => {
        // Ürün zaten map'te varsa, miktarını artır
        if (productMap[product.productName]) {
          productMap[product.productName].quantity += product.quantity;
          productMap[product.productName].totalPrice += product.totalPrice;
        } else {
          // Ürün daha önce eklenmediyse, yeni bir giriş ekle
          productMap[product.productName] = {
            productName: product.productName,
            quantity: product.quantity,
            productPrice: product.productPrice,
            totalPrice: product.totalPrice,
          };
        }
      });

      totalAmount += parseFloat(order.totalAmount) || 0;
    });




    // Birleştirilmiş ürünleri bir diziye dönüştür
    const mergedProducts = Object.values(productMap);

    return (

      <div className="container-bottom-part">
      <div className="container-edit-area">
          <p>Orders</p>
          <button className="edit-icon-button"><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" /></button>
      </div>
      <hr/>
  
        
          {mergedProducts.map((product, index) => (
               <div className="order-detail">
            
              <p>{product.quantity} x {product.productName}</p>
              <p>{product.productPrice} TL</p>
            
              </div>
          ))}
   
      <hr/>
      <div className="order-total-info">
          <p>Total:</p>
          <p>{totalAmount}</p>
      </div>
      <hr/>
      <button className="settle-up-button" onClick={() => handleSettleUp(table.tableKey)}>Settle Up</button>
  </div>

  
    );
  })()
) : (
  <p>No orders found for this table.</p>
)}
          </div>
        )})
  ) : (
        <p>No tables found.</p>
      )}
    </div>
    
                   
                    </div>            
            
            </div>

    )
}
export default OrderTracking
