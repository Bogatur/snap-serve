import React, { useEffect, useState } from "react";
import './OrderTracking.css';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu";
import { fetchTablesAndOrders, increaseProductQuantity, removeProduct, settleUp } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/Header";


function OrderTracking (){
    

    const { user, username, companyKey, logout } = useAuth();
    const [tables, setTables] = useState([]);
    

      // Modal'ın görünürlüğünü kontrol eden state
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  // Modal'ı açmak için kullanılan fonksiyon
  const openEditOrderModal = () => setIsEditOrderModalOpen(true);
  // Modal'ı kapatmak için kullanılan fonksiyon
  const closeEditOrderModal = () => setIsEditOrderModalOpen(false);

    // Inline CSS stilleri
    const modalStyle = {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  
    const modalContentStyle = {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      width: "300px",
      position: "relative",
    };
  

  // useEffect içinde Firebase'den verileri anlık olarak dinliyoruz
  useEffect(() => {
    // Firebase'den anlık verileri dinlemek için fetch fonksiyonunu çağırıyoruz
    fetchTablesAndOrders(companyKey, setTables);
  }, [companyKey]); // companyKey değiştiğinde yeniden çağrılır


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


    return ( <>  <Header/>
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
            orderKey: order.orderId,
            tableKey: table.tableKey
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
          <button className="edit-icon-button" onClick={openEditOrderModal}><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" /></button>
       {/* Modal penceresi */}
       {isEditOrderModalOpen && (
  <div style={modalStyle}>
    <div style={modalContentStyle}>
      <span onClick={closeEditOrderModal}>
        &times;
      </span>
      <h2>Modal Başlığı</h2>
      <p>Modal içerik buraya gelecek.</p>
      {mergedProducts.map((product, index) => (
        <div className="order-detail" key={product.productKey}>
          <p>{product.quantity} x {product.productName}</p>
          <p>{product.productPrice} TL</p>
          
          {/* Eksi butonu */}
          <button
            onClick={() => removeProduct(companyKey, product.tableKey, product.orderKey, product.productName)}
            style={{ marginRight: "10px" }}
          >
            -
          </button>

          {/* Artı butonu */}
          <button
            onClick={() => increaseProductQuantity(companyKey, product.tableKey, product.orderKey, product.productName)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
        </div>
      ))}
      <button
        onClick={closeEditOrderModal}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Kapat
      </button>
    </div>
  </div>
)}


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
            </>
    )
}
export default OrderTracking
