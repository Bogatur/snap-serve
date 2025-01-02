import React, { useEffect, useState } from "react";
import './OrderTracking.css';
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu";
import { fetchTablesAndOrders, increaseProductQuantity, removeProduct, settleUp } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/Header";
import { useOrders } from "../../context/OrderContext";
import { fetchMenu } from "../../services/menuService";


function Ord (){
    

    const { user, username, companyKey, logout } = useAuth();
    const { tables, orders, addOrder, updateOrder, addToCart, removeFromCart, cart, setCart } = useOrders();
    const [selectedTableKey, setSelectedTableKey] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedOrderData, setUpdatedOrderData] = useState(null);
    const [menuData, setMenuData] = useState();

    const [activeCategory, setActiveCategory] = useState(null); // Active category state
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay'i kontrol eden state
  
    const [selectTableVisible, setSelectTableVisible] = useState(false);
    const toggleCategory = (category) => {
      setActiveCategory(activeCategory === category ? null : category);
    };

    const closeOverlay = () => {
      setIsOverlayOpen(false);
    };


    useEffect(() => {
      if(selectedTableKey){
        setSelectTableVisible(false);
      }else{
        setSelectTableVisible(true);
      }
    },[isOverlayOpen])
    const currentTime = Date.now();


      // Hangi menü sayfasının ürünlerinin açılacağını tutan durum
  const [openPage, setOpenPage] = useState(null);

  // Menü başlığına tıklanınca, ilgili ürünleri açmak veya kapamak için toggle fonksiyonu
  const togglePage = (page) => {
    setOpenPage((prev) => (prev === page ? null : page)); // Eğer aynı sayfaya tekrar tıklanırsa kapanır
  };

    useEffect(() => {
        // Async fonksiyon tanımlanıyor
        const fetchData = async () => {
          const menuData = await fetchMenu(companyKey);
          if (menuData !== null) {
            setMenuData(menuData);
          }
        };
      
        if(companyKey != null){
          fetchData(); // async fonksiyon çağrılıyor
        }
      
      }, [companyKey]); 


    const handleEditOrder = (tableKey) => {
        if(tableKey){
            setSelectedTableKey(tableKey);
            const tableOrders = orders[tableKey] ? orders[tableKey] : [];
            setUpdatedOrderData(tableOrders);
        }else{
            setSelectedTableKey();
        }

        setIsEditModalOpen(true);
    }


    const handleSettleUp = async () => {
   
        try {
    
          await settleUp(companyKey, selectedTableKey);
          setSettleIsOverlayOpen(false);
        } catch (err) {
            alert(err);
          }
      };
    
      const [totalAmount, setTotalAmount] = useState(0);
      const [isSettleOverlayOpen, setSettleIsOverlayOpen] = useState(false); // Overlay'i kontrol eden state


      const openSettleOverlay = (tableKey, totalAmount) => {
        setSelectedTableKey(tableKey);
        setTotalAmount(totalAmount);
        setSettleIsOverlayOpen(true);
      };

  const handleChangeSelectedTable = (event) => {
    const tableOrders = orders[event.target.value] ? orders[event.target.value] : [];
    setUpdatedOrderData(tableOrders);
    setSelectedTableKey(event.target.value);

 
  };

  useEffect(() => {
    if(selectedTableKey){
   
      const tableOrders = orders[selectedTableKey] ? orders[selectedTableKey] : [];
      setUpdatedOrderData(tableOrders);
  }
  },[selectedTableKey])


// Order veri yapısındaki ürün miktarını artırma
const handleIncreaseQuantity = (orderIndex, productIndex) => {
    // updatedOrderData'dan sırasıyla orderKey ve order almak için Object.entries kullan
    const updatedOrders = Object.entries(updatedOrderData); 
    const [orderKey, order] = updatedOrders[orderIndex];  // order ve key'e erişiyoruz
    
    // İlgili ürünü bul
    const product = order.products[productIndex];
    
    // Ürün miktarını artır
    product.quantity += 1;
  
    // State'i güncelle
    setUpdatedOrderData({
      ...updatedOrderData,
      [orderKey]: {
        ...order,
        products: [...order.products]
      }
    });
  };
  
  const handleDecreaseQuantity = (orderIndex, productIndex) => {
    // updatedOrderData'dan sırasıyla orderKey ve order almak için Object.entries kullan
    const updatedOrders = Object.entries(updatedOrderData);
    const [orderKey, order] = updatedOrders[orderIndex];  // order ve key'e erişiyoruz
    
    // İlgili ürünü bul
    const product = order.products[productIndex];
    
    // Eğer miktar 1'den büyükse, miktarı azalt
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      // Eğer miktar 1'se, ürünü sil
      order.products.splice(productIndex, 1); // productIndex'teki ürünü kaldır
  
    }
  
    // State'i güncelle
    setUpdatedOrderData({
      ...updatedOrderData,
      [orderKey]: {
        ...order,
        products: [...order.products]  // yeni products dizisini al
      }
    });
  };
  
  
  
  const handleSaveChanges = async () => {
  
    if (cart.length !== 0){
      addOrder(selectedTableKey, cart);
    }
    if (updatedOrderData && selectedTableKey) {
      // Her bir siparişi işlemek için async döngü kullanıyoruz
      for (const [key, order] of Object.entries(updatedOrderData)) {
  
        order.createdAt = new Date().toISOString(); // ISO formatında güncel tarih saat
        console.log("*************************************");
        console.log(key)
        console.log(order)
        console.log("---");
    
        console.log("*************************************");
        console.log("updated order:", JSON.stringify(order)); // order data'yı console'a yazdırıyoruz
        await updateOrder(selectedTableKey, key, order); // Firebase'e güncelleme işlemi
      }
      
      // İşlemler tamamlandıktan sonra modal'ı kapatıyoruz
      setIsEditModalOpen(false);
      closeOverlay();
    }
  };





    return ( <>  <Header/>
            <div className="profile-page">
           
                <SideMenu />
                <div className="current-profile-page">
                    <div className="page-info-text">
                        <h5>Active Orders</h5>
                        <button onClick={() => {setSelectedTableKey(null); setIsOverlayOpen(true);}}>Add Order Manually</button>
                    </div>
                    <div className="order-area">


                    {

Object.entries(orders) // Masalar üzerinden iterasyon
.sort(([tableKeyA, tableOrdersA], [tableKeyB, tableOrdersB]) => {
  const ordersA = Object.values(tableOrdersA);
  const ordersB = Object.values(tableOrdersB);

  const latestOrderA = ordersA.length > 0 ? ordersA.reduce((latest, current) =>
    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
  ) : null;

  const latestOrderB = ordersB.length > 0 ? ordersB.reduce((latest, current) =>
    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
  ) : null;

  if (!latestOrderA) return 1;
  if (!latestOrderB) return -1;

  return new Date(latestOrderB.createdAt) - new Date(latestOrderA.createdAt);
})
.map(([tableKey, tableOrders]) => {
  const sortedOrders = Object.entries(tableOrders)
    .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt));

  const totalPrice = sortedOrders.reduce((orderSum, [orderKey, order]) => {
      // Her siparişteki ürünlerin fiyatlarını topluyoruz
      const orderTotal = order.products.reduce((sum, product) => {
        const price = Number(product.productPrice) * Number(product.quantity); // Sayıya dönüştürme
        return sum + price; // Sayıları topluyoruz
      }, 0); // Başlangıç değeri 0
  
      return orderSum + orderTotal; // Siparişlerin toplamını topluyoruz
    }, 0); 
 
  return (
          
     (sortedOrders.length !== 0 &&
 <div key={tableKey} className="order-container">{/* Masa container'ı */}


<div className="container-top-part">
                                <img src={`${process.env.PUBLIC_URL}/order-photo.png`} alt="order-photo" />
                                <p>{tables.find(table => table.tableKey === tableKey).tableID}</p>
                            </div>



                            <div className="container-edit-area">
<p>Orders</p>
          <button className="edit-icon-button" onClick={() => {setSelectedTableKey(tableKey); setIsOverlayOpen(true);}}><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" /></button>
    
</div>
<div className="container-bottom-part">
      {
      sortedOrders.map(([orderKey, order]) => {
        
          // `createdAt` zamanını milisaniyeye çeviriyoruz
          const createdAtTime = new Date(order.createdAt).getTime();
          const timeDifference = currentTime - createdAtTime;
  
          // 1 dakika = 60000 milisaniye, 1 dakikadan az ise animasyonu uyguluyoruz
          const isLessThanOneMinute = timeDifference < 60000;


        return (
            
           <div>
  




         <div
            key={order.orderId}
            style={isLessThanOneMinute ? { animation: 'fadeOutBackground 5s forwards'} : {}}
            className="fade-background" // Sipariş container'ı
          >
        
          {order.products.map((product, index) => (
         
<div className="order-detail">
            
<p>{product.quantity} x {product.productName}</p>
<p>{product.productPrice} TL</p>

</div>
          ))}
        </div>
</div>

        )
})}
 
<div className="order-total-info">
          <p>Total:</p>
          <p>
  {
  totalPrice
  }
</p>
      </div>

      <button className="settle-up-button"   onClick={() => openSettleOverlay(tableKey, totalAmount)}>Settle Up</button>
</div>
    </div>
));
})
}
              

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
              {
                selectTableVisible && 
                <div>
                  <h4>Choose Table No</h4>
                  <select value={selectedTableKey} onChange={handleChangeSelectedTable}>
                    <option value="">Select Table</option>
                    {
  tables && tables.map((table) => (
    <option value={table.tableKey}>{table.tableID}</option>
  ))}
                  </select>
                </div>
              }
             
              <p className="add-item-text">Add Item</p>
              {menuData && Object.entries(menuData).map(([pageKey, pageValue]) => (
  <div key={pageKey}>  {/* Ana div'e key ekledim */}
    <div className="category">
      <h4 onClick={() => toggleCategory(pageValue.menuPageName)}>
        {pageValue.menuPageName}
      </h4>

      {activeCategory === pageValue.menuPageName && pageValue.products ? (
        <ul>
          {Object.entries(pageValue.products).map(([productKey, product]) => (
            <li key={productKey}>  {/* Her bir ürün için key ekledim */}
              {product.productName}
              <button onClick={() => addToCart(productKey, product)}>+</button>
            </li>
          ))}
        </ul>
      ) : 
       activeCategory === pageValue.menuPageName && <ul>
          <li>Ürün bulunamadı!</li>
        </ul>
      }
    </div>
  </div>
))}

            </div>
            <div className="add-order-right">
              <h4>Order Details</h4>
              <div className="order-details">
              {
         cart &&  cart.map((item) => (


<div className="order-item-continer">
<div className="order-item-details">
  
  <p className="choosen-order-items">{item.productName}</p>
  <div className="arrange-order-item">
    <button className="mobile-product-remove-button" onClick={() => removeFromCart(item.productKey)}><p>-</p></button>
     <p>{item.quantity}</p> 
     <button className="mobile-product-add-button" onClick={() => addToCart(item.productKey, item)}><p>+</p></button>
  </div>
</div>
<div className="order-item-price">
  <p>${item.productPrice}</p>
</div>
</div>

          
          ))
         }

{ selectedTableKey && updatedOrderData && Object.entries(updatedOrderData).map(([key, order], orderIndex) => (

   
       
         order && order.products.map((product, productIndex) => (

               
     <div className="order-item-continer">
     <div className="order-item-details">
       
       <p className="choosen-order-items">{product.productName}</p>
       <div className="arrange-order-item">

 


         <button className="mobile-product-remove-button" onClick={() =>  handleDecreaseQuantity(orderIndex, productIndex)}><p>-</p></button>
          <p>{product.quantity}</p> 
          <button className="mobile-product-add-button" onClick={() => handleIncreaseQuantity(orderIndex, productIndex)}><p>+</p></button>
       </div>
     </div>
     <div className="order-item-price">
       <p>${product.productPrice}</p>
     </div>
     </div>



           ))


  

      ))}
               
              </div>
              <div className="order-total-fee">
                <p>Total Fee</p>
                <p>{totalAmount}</p>
              </div>
              <button className="save-button" onClick={handleSaveChanges}>Save</button>
            </div>
            </div>
          </div>
        </div>
      )}

                      {/* Edit Modal */}
      {isEditModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
          
          
           {/* Sol Taraf Div */}
           <div style={sideDivStyle}>
              <h2>Sol Taraf</h2>
              <p>Burada sol tarafın içeriği olacak.</p>

              <div>

{selectedTableKey == null ?
<select value={selectedTableKey} onChange={handleChangeSelectedTable}>

  { selectedTableKey == null &&  <option value="empty">Masa Seç</option>}
  {
  tables && tables.map((table) => (
    <option value={table.tableKey}>{table.tableID}</option>
  ))}
</select>

:  <p> Masa {tables.find(table => table.tableKey === selectedTableKey).tableID}</p>

}
</div>


        {menuData && Object.entries(menuData).map(([pageKey, pageValue]) => (
        <div key={pageKey}>
          {/* Sayfa başlığı */}
          <h2
            onClick={() => togglePage(pageKey)}
            style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#f4f4f4', borderRadius: '5px', margin: '5px 0' }}
          >
        
            <div style={{position: "relative"}}>
            {pageValue && pageValue.menuPageName}
          <p style={{position: "absolute", right: "0px", top: "50%", fontSize: "10px"}}> {openPage === pageKey ? <p>açık</p> : <p>kapalı</p>}</p> 
         
          </div>
           </h2>

          {/* Sayfa başlığına tıklanırsa, ürünler açılır */}
          {openPage === pageKey && pageValue.products && (
            <ul style={{ paddingLeft: '20px' }}>
              {Object.entries(pageValue.products).map(([productKey, product]) => (
                   <li key={productKey}>
                    <p>{productKey} keeyyy</p>
                   <p>{product.productName}</p>
                   <p>{product.productPrice ? `Fiyat: ${product.productPrice}` : "Fiyat Bilgisi Yok"}</p>
                   <button onClick={() => addToCart(productKey, product)}>+</button>
                       
                 </li>
               ))}
             
            </ul>
          )}
        </div>
      ))}
            </div>


             {/* Sağ Taraf Div */}
             <div style={sideDivStyle}>
              <h2>Sağ Taraf</h2>
              <p>Burada sağ tarafın içeriği olacak.</p>
             
              <div>
          { cart && cart.length !== 0 && (
        <div style={{ border: '1px solid #ddd', marginBottom: "10px"}}>
        
        {
         cart &&  cart.map((item) => (
            <div key={item.productKey} style={{ display: "flex" }}>

             
            <p><b>{item.productName} (x{item.quantity})</b></p>
            <p>price: {item.productPrice}</p>
            <p>total: {item.productPrice * item.quantity} TL</p>
            <button onClick={() => addToCart(item.productKey, item)}>+</button>
            <button onClick={() => removeFromCart(item.productKey)}>-</button>
          </div>

          
          ))
         }
         </div>
          ) }
       
              { selectedTableKey && Object.entries(updatedOrderData).map(([key, order], orderIndex) => (
     
        
        <div style={{ border: '1px solid #ddd', marginBottom: "10px"}}>
        
          
            {order && order.products.map((product, productIndex) => (
                <div key={product.productKey} style={{ display: "flex" }}>

             
                  <p><b>{product.productName} (x{product.quantity})</b></p>
                  <p>price: {product.productPrice}</p>
                  <p>total: {product.productPrice * product.quantity} TL</p>
                  <button onClick={() => handleIncreaseQuantity(orderIndex, productIndex)}>+</button>
                  <button onClick={() => handleDecreaseQuantity(orderIndex, productIndex)}>-</button>
                </div>
              ))}


        </div>

         ))}
                 </div>
           <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
            {/* sağ taraf son */}

</div>
      </div>)}       
            
            </div>

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
    )
}

  // Modal stilizasyonu
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    width: "80%", // genişliği belirledim
    display: "flex", // Flexbox kullanımı
    justifyContent: "space-between", // İki öğe arasında boşluk bırakmak için
  };

  const sideDivStyle = {
    width: "48%", // Yükseklikleri ve genişlikleri istediğiniz gibi ayarlayabilirsiniz
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "5px",
    textAlign: "center",
  };

export default Ord
