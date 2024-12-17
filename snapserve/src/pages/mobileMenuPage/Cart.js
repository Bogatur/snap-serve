import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation ve useNavigate import ediliyor
import { addOrder } from "../../services/companyService";

function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  //const cart = location.state?.cart || []; // Sepet verisi burada alınıyor

  const [cart, setCart] = useState(location.state?.cart || []);


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
    <div>
      <h1>Sepetiniz</h1>
      {cart.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.productKey}>
                   <img src={item.productPhotoURL} width={100} height={100} alt={item.productName} />

              <p>{item.productName} - {item.productPrice}</p>
              <p>Miktar: 
              <button onClick={() => removeFromCart(item.productKey)}>-</button>
                {item.quantity}
                <button onClick={() => addToCart(item)}>+</button>
              </p>
          
            </li>
          ))}

{cart.length === 0 ? (
              <p>Sepetiniz boş.</p>
            ) : (
              <div>
                <p>Toplam Tutar: {cart.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2)} TL</p>
                <button onClick={handleOrder}>Sipariş Ver</button>
              </div>
            )}
        </ul>
      )}
      <button onClick={() => navigate("/mobileMenu?cid="+location.state?.companyKey+"&&tid="+location.state?.tableKey,  { state: { cart } })}>Menüye Dön</button>
    </div>
  );
}

export default Cart;
