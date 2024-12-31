import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation ve useNavigate import ediliyor
import { addOrder } from "../../services/companyService";
import './Cart.css';

function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  //const cart = location.state?.cart || []; // Sepet verisi burada alınıyor

  const [cart, setCart] = useState(location.state?.cart || []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCompleteOrder = () => {
    // Sipariş tamamlama işlemleri burada yapılabilir.
    handleOrder();
    setIsModalOpen(false)
    setTimeout(() => {
      alert("Settled Up successfully");
    }, 500); // 300ms delay (you can adjust the delay)
    navigate("/mobileMenu?cid="+location.state?.companyKey+"&&tid="+location.state?.tableKey,  { state: { cart } })
    // navigate("/order-complete", { replace: true }); // Sepeti boşaltıp sipariş tamamlandığına dair bir sayfaya yönlendiriyoruz
    ;
  };


  //***** */ NAVIGATE POP veri gönderme işlemini kontrol et !!!!!!!!!!!!!!1

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

  const handleOrder = async () => {
    try {

      await addOrder(location.state?.companyKey, location.state?.tableKey, cart);
    console.log("Sİpariş kaydedildi!");
    } catch (error) {
      console.error("Sipariş gönderilemedi:", error);
    }
  };


  return (
    <div className="mobile-bg">
      <div className="mobile-top-part">
          <div className="menu-title-area">
            <h1>Menu Name</h1>
            <h2>Menu Slogan</h2>
          </div>
      </div>
      {cart.length === 0 ? (
        navigate("/mobileMenu?cid="+location.state?.companyKey+"&&tid="+location.state?.tableKey,  { state: { cart } })
        ) : (
        <ul className="cart-product-area">
          <h3 className="chart-title">Your Cart</h3>
          {cart.map((item) => (
            <li className="cart-product-container" key={item.productKey}>
              <img className="cart-photo" src={item.productPhotoURL} alt={item.productName} />
              <div className="cart-product-details">
                <div className="order-product-info">
                  <p className="mobile-product-name">{item.productName}</p>
                  <p className="mobile-product-price">${item.quantity * item.productPrice}</p>
                </div>
                <div className="order-arrange area">
                  <button className="mobile-product-remove-button" onClick={() => removeFromCart(item.productKey)}><p>-</p></button>
                  <span className="mobile-product-quantity">{item.quantity}</span>
                  <button className="mobile-product-add-button"  onClick={() => addToCart(item)}><p>+</p></button>
                </div>
              </div>
      
            </li>
          ))}
        </ul>
      )}
                  
      <div className="empty-space"></div>
      <div className="handle-order-div">
          <div className="total-fee-area">
            <p className="total-fee-text">Total Fee:</p>
            <p className="total-fee">${cart.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2)}</p>
          </div>
          <button className="give-order-button" onClick={handleOpenModal}>Complete Order</button>
      </div>
      {/* <button onClick={() => navigate("/mobileMenu?cid="+location.state?.companyKey+"&&tid="+location.state?.tableKey,  { state: { cart } })}>Menüye Dön</button> */}
      {isModalOpen && (
        <div className="cart-overlay">
          <div className="cart-modal">
            <p className="cart-modal-text">Are you sure you want to complete your order for ${cart.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2)} ?</p>
            <div className="cart-modal-buttons">
              <button className="cart-modal-button complete" onClick={handleCompleteOrder}>
                Complete
              </button>
              <button className="cart-modal-button cancel" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}  
    </div>
    

    
  );
}

export default Cart;
