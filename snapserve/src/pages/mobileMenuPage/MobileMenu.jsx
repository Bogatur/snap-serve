import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate'yi import et
import { database, get, ref } from "../../firebase";

function MobileMenu() {
  const navigate = useNavigate(); // useNavigate hook'unu kullanıyoruz
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyKey = queryParams.get('cid');
  const tableKey = queryParams.get('tid');

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(location.state?.cart || []); // Sepeti tutan state

  const addToCart = (product) => {
    
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.productKey === product.productKey
      );
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
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
          product.quantity -= 1;
        } else {
          updatedCart.splice(existingProductIndex, 1);
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  const getProductQuantity = (product) => {
    const cartItem = cart.find(item => item.productKey === product.productKey);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleOrder = () => {
    // Sipariş Ver butonuna tıklandığında, Sepet verisini Cart sayfasına yönlendiriyoruz
    navigate("/cart", { state: { cart, companyKey, tableKey } });
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      const dbRef = ref(database, "companies/" + companyKey + "/menu");
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const menuList = Object.entries(data).map(([menuKey, menuValue]) => ({
            menuKey,
            menuPageName: menuValue.menuPageName,
            products: Object.entries(menuValue.products || {}).map(([productKey, productValue]) => ({
              productKey,
              ...productValue
            }))
          }));
          setMenuData(menuList);
        } else {
          console.log("No menu data available");
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [companyKey]);

  return (
    <div className="nav-bar">
      <div>
        <p>COmpany Key: {companyKey}</p>
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

                      {cart.some(item => item.productKey === product.productKey) ? (
                        <div>
                          <button onClick={() => removeFromCart(product.productKey)}>-</button>
                          <span>{getProductQuantity(product)} miktar</span>
                          <button onClick={() => addToCart(product)}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)}>Ekle</button>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <h2>Sepetiniz</h2>
            {cart.length === 0 ? (
              <p>Sepetiniz boş.</p>
            ) : (
              <div>
                <p>Toplam Tutar: {cart.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2)} TL</p>
                <button onClick={handleOrder}>Sepete Git</button>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
