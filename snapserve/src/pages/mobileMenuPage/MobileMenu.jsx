import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { database, get, ref } from "../../firebase";

function MobileMenu() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyKey = queryParams.get('cid');
  const tableKey = queryParams.get('tid');

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // Sepeti tutan state

  const addToCart = (product) => {
    // Sepetteki ürünlerden varsa miktarını artır, yoksa yeni ürün ekle
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productKey === product.productKey
      );
      if (existingProductIndex !== -1) {
        // Ürün zaten sepette var, miktarını artır
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
        // Ürün sepette yok, yeni ekle
        return [...prevCart, { ...product, quantity: 1 }];
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
          // Miktar 1'den büyükse, sadece miktarı azalt
          product.quantity -= 1;
        } else {
          // Miktar 1 ise, ürünü sepetten tamamen çıkar
          updatedCart.splice(existingProductIndex, 1);
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      // Firebase'deki belirli bir şirketin menüsüne erişim sağlıyoruz
      const dbRef = ref(database, "companies/-ODviExedvgNmHi7FAGy/menu"); // Veritabanındaki menu yolunu kontrol ediyoruz
      try {
        const snapshot = await get(dbRef); // Veriyi alıyoruz
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Menu data:', data); // Veriyi konsola yazdırarak kontrol edin
          const menuList = Object.entries(data).map(([menuKey, menuValue]) => ({
            menuKey,
            menuPageName: menuValue.menuPageName,
            products: Object.entries(menuValue.products || {}).map(([productKey, productValue]) => ({
              productKey,
              ...productValue
            }))
          }));
          setMenuData(menuList); // Menü verilerini state'e kaydediyoruz
        } else {
          console.log("No menu data available"); // Verinin mevcut olmadığını konsola yazdırıyoruz
        }
      } catch (error) {
        console.error("Error fetching menu data:", error); // Hata varsa konsola yazdırıyoruz
      } finally {
        setLoading(false); // Yükleniyor durumunu kaldırıyoruz
      }
    };

    fetchMenuData();
  }, []);

  return (
    <div className="nav-bar">
      <div>
        <p>Masa ID: {tableKey}</p>
        <h1>Menu List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {menuData.map((menu) => (
              <li key={menu.menuKey}>
                <h2>{menu.menuPageName}</h2>
                <ul>
                  {menu.products.map((product) => (
                    <li key={product.productKey} style={{ border: '2px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                      <p>Product Name: {product.productName}</p>
                      <p>Product Description: {product.productDescription}</p>
                      <p>Product Price: {product.productPrice}</p>
                      <img src={product.productPhotoURL} width={100} height={100} alt={product.productName} />
                      <button onClick={() => addToCart(product)}>Ekle</button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <h2>Sepetiniz</h2>
            {cart.length === 0 ? (
              <p>Sepetiniz boş.</p>
            ) : (
         <div>     <ul>
                {cart.map((item) => (
                  <li key={item.productKey} style={{ border: '2px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                    <p>{item.productName} - {item.productPrice}</p>
                    <p>Miktar: {item.quantity}</p>
                    <button onClick={() => removeFromCart(item.productKey)}>Çıkar</button> {/* Çıkar butonu */}
                  </li>
                ))}
              </ul>
              <button>Sipariş Ver</button> </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
