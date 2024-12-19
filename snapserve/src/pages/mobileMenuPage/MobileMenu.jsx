import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { database, get, ref } from "../../firebase";
import './MobileMenu.css';

function MobileMenu() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyKey = queryParams.get('cid');
  const tableKey = queryParams.get('tid');

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(location.state?.cart || []);
  const [activeTab, setActiveTab] = useState(""); // Aktif sekme state'i


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
          setActiveTab(menuList[0]?.menuPageName || ""); // İlk sekmeyi aktif yap
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

  const handleTabClick = (menuPageName) => {
    setActiveTab(menuPageName); // Aktif sekmeyi değiştir
  };

  const activeMenu = menuData.find(menu => menu.menuPageName === activeTab); // Aktif sekmeye ait menüyü bul

  return (
    <div className="mobile-bg">
      <div>
        <div className="menu-title-area">
          <h1>Menu Name</h1>
          <h2>Menu Slogan</h2>
        </div>
        {/* Sekme Başlıkları */}
        <div className="tabs">
          {menuData.map((menu) => (
            <button
              key={menu.menuKey}
              className={activeTab === menu.menuPageName ? 'active' : ''}
              onClick={() => handleTabClick(menu.menuPageName)}
            >
              {menu.menuPageName}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {/* Aktif Menüyü Listele */}
            <ul className="mobile-product-area">
              {activeMenu?.products.map((product) => (
                <li className="mobile-product-container" key={product.productKey}>
                  <div className="mobile-product-items">
                  <img className="mobile-product-photo" src={product.productPhotoURL} alt={product.productName} />
                  <p className="mobile-product-name">{product.productName}</p>
                  <p className="mobile-product-description">{product.productDescription}</p>
                    <div className="mobile-product-bottom-part">
                      <p className="mobile-product-price">${product.productPrice}</p>
                      <div className="quantity-arrange-buttons">
                        {cart.some(item => item.productKey === product.productKey) ? (
                          <div>
                            <button className="mobile-product-remove-button" onClick={() => removeFromCart(product.productKey)}>-</button>
                            <span className="mobile-product-quantity">{getProductQuantity(product)}</span>
                            <button className="mobile-product-add-button" onClick={() => addToCart(product)}>+</button>
                          </div>
                        ) : (
                          <button className="mobile-product-add-button" onClick={() => addToCart(product)}>+</button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Sepet */}
            <h2>Sepetiniz</h2>
            {cart.length === 0 ? (
              <p>Sepetiniz boş.</p>
            ) : (
              <div>
                <p>Toplam Tutar: {cart.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2)} TL</p>
                <button onClick={handleOrder}>Sepete Git</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
