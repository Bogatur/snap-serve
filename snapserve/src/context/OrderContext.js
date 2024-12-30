// OrderContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, ref, onValue, update, push, remove, set } from '../firebase'; // Firebase referansları
import { useAuth } from './AuthContext';  // Eğer kullanıcı bilgisi kullanıyorsanız

const OrderContext = createContext();

// Context üzerinden orderlara erişim sağlamak için hook
export const useOrders = () => {
  return useContext(OrderContext);
};

// Context Provider bileşeni
export const OrderProvider = ({ children }) => {
  const { companyKey } = useAuth();  // Firma anahtarı (context üzerinden veya auth'tan alınabilir)
  
  const [tables, setTables] = useState([]);  // Masaları tutacağımız state
  const [orders, setOrders] = useState({});  // Orders: Masa başına her bir siparişi tutacak (dizi olarak)
  const [cart, setCart] = useState([]);


  // Firebase'den masaları ve siparişleri dinleyen bir useEffect
  useEffect(() => {
    const tablesRef = ref(database, `companies/${companyKey}/tables`);

    // Tables verisini al ve dinle
    onValue(tablesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("tables: " + JSON.stringify(data));
        setTables(Object.entries(data).map(([key, table]) => ({
          ...table,
          tableKey: key,
        })));
        
        // Her masa için orders verisini al
        const updatedOrders = {};
        Object.entries(data).forEach(([tableKey, table]) => {
          const ordersRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders`);
          onValue(ordersRef, (orderSnapshot) => {
            if (orderSnapshot.exists()) {
              updatedOrders[tableKey] = orderSnapshot.val();
            } else {
              updatedOrders[tableKey] = [];
            }
            // Her masa için orderları güncelliyoruz
            setOrders(updatedOrders);
            console.log("ORDERS: " + JSON.stringify(updatedOrders));
          });
        });
      } else {
        setTables([]);
        setOrders({});
      }
    });
  }, [companyKey]);

  // Sipariş güncelleme fonksiyonu
  const updateOrder = async (tableKey, orderKey, updatedOrder) => {

console.log("update leng: "+ Object.values(updatedOrder.products).length);
const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderKey}`);
if(Object.values(updatedOrder.products).length == 0 ){
  deleteOrder(tableKey, orderKey)
}else{
  await update(orderRef, updatedOrder)
}



  };

  // Sipariş ekleme fonksiyonu (Varsa)
  const addOrder = async (tableKey, products) => {
    // Firebase'e yeni sipariş ekliyoruz
    const orderRef = push(ref(database, `companies/${companyKey}/tables/${tableKey}/orders/`));
  //  await push(orderRef, newOrder);

    await set(orderRef, {
      orderId: Date.now(), // Benzersiz bir sipariş ID'si (örneğin, şu anki zaman damgası)
      products: products.map(product => ({
        productKey: product.productKey,
        productName: product.productName,
        productPrice: product.productPrice,
        quantity: product.quantity
      })),
      status: "pending", // Sipariş durumu (başlangıçta "pending")
      createdAt: new Date().toISOString() // Sipariş oluşturulma zamanı
    });

    setCart([]);
  };


  const deleteOrder = async (tableKey, orderKey) => {
    const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderKey}`);
    await remove(orderRef);
  };

  const addToCart = ( productKey, product) => {
    
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productKey === productKey
      );
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity: 1,  productKey: productKey  }];
      }
    });
  };

  const removeFromCart = (productKey) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productKey === productKey
      );
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        const product = updatedCart[existingProductIndex];
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          updatedCart.splice(existingProductIndex, 1);
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  return (
    <OrderContext.Provider value={{ tables, orders, updateOrder, addOrder, cart, setCart, addToCart, removeFromCart }}>
      {children}
    </OrderContext.Provider>
  );
};
