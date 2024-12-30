// AdminPage.js
import React, { useState, useEffect } from 'react';
import './denemeOrder.css'; 
import { useOrders } from '../context/OrderContext';
import { fetchMenu } from '../services/menuService';
import { useAuth } from '../context/AuthContext';

// CSS animasyonu (animasyon süresi 5 saniyeye çekildi)
const fadeOutBackground = {
  border: "1px solid black",
  animation: 'fadeOutBackground 20s forwards',  // Animasyonu 5 saniyeye çekiyoruz
};

// Keyframes'leri CSS olarak tanımlıyoruz
const keyframes = `
  @keyframes fadeOutBackground {
    0% {
      background-color: rgba(0, 255, 0, 0.8); /* Başlangıçta yeşil ve belirgin */
    }
    100% {
      background-color: rgba(0, 255, 0, 0); /* Animasyon sonunda transparan */
    }
  }
`;

const AdminPage = () => {
  const { companyKey } = useAuth();
  const { tables, orders, addOrder, updateOrder, addToCart, removeFromCart, cart, setCart } = useOrders();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTableKey, setSelectedTableKey] = useState(null);
  const [updatedOrderData, setUpdatedOrderData] = useState(null);


  const [controlData, setControlData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuData, setMenuData] = useState();
  // Kutucuğu açmak için butona tıklama fonksiyonu
  const handleButtonClick = async () => {
  
    setIsModalOpen(true);

  };

  const handleChangeSelectedTable = (event) => {
    const tableOrders = orders[event.target.value] ? orders[event.target.value] : [];
    setUpdatedOrderData(tableOrders);
    setSelectedTableKey(event.target.value);

 
  };

  // Kutucuğu kapatmak için
  const closeModal = () => {
    if(cart.length !== 0){ setCart([])}
    setIsModalOpen(false);
    setSelectedTableKey();
  };

  // Sipariş düzenleme fonksiyonu
  const handleEditOrder = (tableKey) => {
    setSelectedTableKey(tableKey);
    // Eğer orders[tableKey] varsa, onu al ve diziye dönüştür
  //  const tableOrders = orders[tableKey] ? Object.values(orders[tableKey]) : [];
  const tableOrders = orders[tableKey] ? orders[tableKey] : [];
    setUpdatedOrderData(tableOrders);
    setIsEditModalOpen(true);
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
      console.log(controlData[selectedTableKey]);
      console.log("*************************************");
      console.log("updated order:", JSON.stringify(order)); // order data'yı console'a yazdırıyoruz
      await updateOrder(selectedTableKey, key, order); // Firebase'e güncelleme işlemi
    }
    
    // İşlemler tamamlandıktan sonra modal'ı kapatıyoruz
    setIsEditModalOpen(false);
  }
};

const currentTime = Date.now();
  

useEffect(() => {
  setControlData(orders);
},[])

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


  // Hangi menü sayfasının ürünlerinin açılacağını tutan durum
  const [openPage, setOpenPage] = useState(null);

  // Menü başlığına tıklanınca, ilgili ürünleri açmak veya kapamak için toggle fonksiyonu
  const togglePage = (page) => {
    setOpenPage((prev) => (prev === page ? null : page)); // Eğer aynı sayfaya tekrar tıklanırsa kapanır
  };

  return (
    <div>
          <style>{keyframes}</style> 
      <h1>Admin Paneli</h1>
      <button onClick={handleButtonClick}>Add Order M.</button>

      {isModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            {/* Sol Taraf Div */}
            <div style={sideDivStyle}>
              <h2>Sol Taraf</h2>
              <p>Burada sol tarafın içeriği olacak.</p>

              <div>

<select value={selectedTableKey} onChange={handleChangeSelectedTable}>

  { selectedTableKey == null &&  <option value="empty">Masa Seç</option>}
  {
  tables.map((table) => (
    <option value={table.tableKey}>{table.tableID}</option>
  ))}
</select>

</div>


        {menuData && Object.entries(menuData).map(([pageKey, pageValue]) => (
        <div key={pageKey}>
          {/* Sayfa başlığı */}
          <h2
            onClick={() => togglePage(pageKey)}
            style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#f4f4f4', borderRadius: '5px', margin: '5px 0' }}
          >
        
            <div style={{position: "relative"}}>
            {pageValue.menuPageName}
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
          { cart.length !== 0 && (
        <div style={{ border: '1px solid #ddd', marginBottom: "10px"}}>
        
        {
          cart.map((item) => (
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
              { selectedTableKey != null && Object.entries(updatedOrderData).map(([key, order], orderIndex) => (
     
        
        <div style={{ border: '1px solid #ddd', marginBottom: "10px"}}>
        
          
            {order.products.map((product, productIndex) => (
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
          </div>

          {/* Kapatma butonu */}
          <button onClick={closeModal}>Kapat</button>
        </div>
      )}


      <div>
        <h2>Masa Başına Siparişler</h2>



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
    <div key={tableKey} style={tableContainerStyle}> {/* Masa container'ı */}
      <h2 style={headingStyle}>Table: {tableKey}</h2>
      <h3>TAble No: {
        tables.find(table => table.tableKey === tableKey).tableID}</h3>
      {
      sortedOrders.map(([orderKey, order]) => {
        
          // `createdAt` zamanını milisaniyeye çeviriyoruz
          const createdAtTime = new Date(order.createdAt).getTime();
          const timeDifference = currentTime - createdAtTime;
  
          // 1 dakika = 60000 milisaniye, 1 dakikadan az ise animasyonu uyguluyoruz
          const isLessThanOneMinute = timeDifference < 60000;


        return (
         <div
            key={order.orderId}
            style={isLessThanOneMinute ? { animation: 'fadeOutBackground 5s forwards' } : {}}
            className="fade-background" // Sipariş container'ı
          >
          <p>createdAt: {order.createdAt}</p>
          <p>Order KEY: {orderKey}</p>
          <p>Order ID: {order.orderId}</p>
          <p>Status: {order.status}</p>
          <p>Created At: {order.createdAt}</p>
          <p>Products:</p>
          {order.products.map((product, index) => (
            <div key={index} style={productContainerStyle}> {/* Ürün container'ı */}
              <p><b>{product.productName} (x{product.quantity})</b></p>
              <p>Price: {product.productPrice} TL</p>
              <p>Total: {product.totalPrice} TL</p>
            </div>
          ))}
        </div>)
})}
    </div>
  );
})
}

        <p>******************************************************</p>
        {Object.entries(tables).map(([tableKey, table]) => (
          <div key={tableKey}>
            <h3>{table.tableID}</h3>
            <button onClick={() => handleEditOrder(table.tableKey)}>Edit</button>
            {/* Orders'ı kontrol et ve boş değilse listele */}
          {orders[table.tableKey]  && Object.keys(orders[table.tableKey]).length > 0  ?




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
            <div key={tableKey} style={tableContainerStyle}> {/* Masa container'ı */}
              <h2 style={headingStyle}>Table: {tableKey}</h2>
              {sortedOrders.map(([orderKey, order]) => (
                <div key={order.orderId} style={orderContainerStyle}> {/* Sipariş container'ı */}
                  <p>Order KEY: {orderKey}</p>
                  <p>Order ID: {order.orderId}</p>
                  <p>Status: {order.status}</p>
                  <p>Created At: {order.createdAt}</p>
                  <p>Products:</p>
                  {order.products.map((product, index) => (
                    <div key={index} style={productContainerStyle}> {/* Ürün container'ı */}
                      <p><b>{product.productName} (x{product.quantity})</b></p>
                      <p>Price: {product.productPrice} TL</p>
                      <p>Total: {product.totalPrice} TL</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })

         
            : (
              <p>No orders found for this table.</p>
            )

          
          }
          
          
            {
            /*
            orders[table.tableKey]  && Object.keys(orders[table.tableKey]).length > 0 ? (
              Object.entries(orders[table.tableKey]).map(([orderKey, order]) => (
                <div key={order.orderId}>
                  <p>Order KEY: {orderKey}</p>
                  <p>Order ID: {order.orderId}</p>
                  <p>Status: {order.status}</p>
                  <p>Created At: {order.createdAt}</p>
                  <p>Products:</p>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      <p><b>{product.productName} (x{product.quantity})</b></p>
                      <p>Price: {product.productPrice} TL</p>
                      <p>Total: {product.totalPrice} TL</p>
                   </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No orders found for this table.</p>
            )
            
            */}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <h2>Edit Orders for Table {selectedTableKey}</h2>
         {Object.entries(updatedOrderData).map(([key, order], orderIndex) => (
        <div>
            <p>{key + " --- "+ orderIndex}</p>
            <h3>Order ID: {order.orderId}</h3>
            {order.products.map((product, productIndex) => (
                <div key={product.productKey}>

                  <p>index: {productIndex}</p>
                  <p><b>{product.productName} (x{product.quantity})</b></p>
                  <p>price: {product.productPrice}</p>
                  <p>total: {product.productPrice * product.quantity} TL</p>
                  <button onClick={() => handleIncreaseQuantity(orderIndex, productIndex)}>+</button>
                  <button onClick={() => handleDecreaseQuantity(orderIndex, productIndex)}>-</button>
                </div>
              ))}
        </div>
         ))}
         
          {/*updatedOrderData && updatedOrderData.map((order, orderIndex) => (
            <div key={order.orderId}>
              <p>{JSON.stringify(order)}</p>
              <h3>Order ID: {order.orderId}</h3>
              {order.products.map((product, productIndex) => (
                <div key={product.productKey}>
                  <p>{product.productName} (x{product.quantity})</p>
                  <button onClick={() => handleIncreaseQuantity(orderIndex, productIndex)}>+</button>
                  <button onClick={() => handleDecreaseQuantity(orderIndex, productIndex)}>-</button>
                </div>
              ))}
            </div>
          ))*/}
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setIsEditModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

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

  const tableContainerStyle = {
    border: '1px solid black', // Masa etrafında siyah bir kenarlık
    padding: '10px', // Masalar arasına 10px padding
    marginBottom: '20px', // Her masa arasına 20px boşluk
  };

  const orderContainerStyle = {
    border: '1px solid black', // Siparişin etrafında 1px siyah kenarlık
    padding: '10px', // Siparişlerin etrafında 10px padding
    marginBottom: '10px', // Siparişler arasına 10px boşluk
  };

  const productContainerStyle = {
    marginBottom: '5px', // Her ürün arasında küçük bir boşluk
  };

  const headingStyle = {
    margin: '0', // Başlıkların etrafındaki varsayılan boşluğu kaldır
    paddingBottom: '10px', // Başlık ile siparişler arasına boşluk
  };
export default AdminPage;
