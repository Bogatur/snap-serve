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
      
        } catch (err) {
            alert(err);
          }
      };
    

  const handleChangeSelectedTable = (event) => {
    const tableOrders = orders[event.target.value] ? orders[event.target.value] : [];
    setUpdatedOrderData(tableOrders);
    setSelectedTableKey(event.target.value);

 
  };



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
    }
  };





    return ( <>  <Header/>
            <div className="profile-page">
           
                <SideMenu />
                <div className="current-profile-page">
                    <div className="page-info-text">
                        <h5>Active Orders</h5>
                        <button onClick={() => handleEditOrder(null)}>Add Order Manually</button>
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

 
  return (
          
     (sortedOrders.length !== 0 &&
 <div key={tableKey} className="order-container">{/* Masa container'ı */}


<div className="container-top-part">
                                <img src={`${process.env.PUBLIC_URL}/order-photo.png`} alt="order-photo" />
                                <p>{tables.find(table => table.tableKey === tableKey).tableID}</p>
                            </div>



                            <div className="container-edit-area">
<p>Orders</p>
          <button className="edit-icon-button" onClick={() => handleEditOrder(tableKey)}><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" /></button>
    
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
    <hr style={{color: "lightgray"}}/>




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
    <hr/>
<div className="order-total-info">
          <p>Total:</p>
          <p>total</p>
      </div>
      <hr/>
      <button className="settle-up-button" onClick={() => handleSettleUp() }>Settle Up</button>
</div>
    </div>
));
})
}
              

    </div>
    
                   
                    </div>     


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
