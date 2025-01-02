
import { database, ref, push, set, get, update, remove, onValue } from '../firebase';

// Yeni sipariş oluşturma
export const createOrderService = async (orderData, companyKey, tableKey) => {
  const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderData.orderId}`);
  await set(orderRef, orderData); // Veriyi Firebase'e ekliyoruz
};

// Sipariş silme
export const deleteOrderService = async (companyKey, tableKey, orderId) => {
  const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderId}`);
  await remove(orderRef); // Firebase'den silme işlemi
};

// Madaki tüm siparişi silme
export const deleteTableOrder = async (companyKey, tableKey) => {
  const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders`);
  await remove(orderRef); // Firebase'den silme işlemi
};


// Sipariş güncelleme
export const updateOrderService = async (companyKey, tableKey, orderId, updatedData) => {
  const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderId}`);
  await update(orderRef, updatedData); // Firebase'de güncelleme işlemi
};

// Ürün miktarını artırma
export const increaseProductQuantity = async (companyKey, tableKey, orderId, productName) => {
  const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderId}`);
  
  // Siparişi alıyoruz
  const snapshot = await get(orderRef);
  const orderData = snapshot.val();
  
  const updatedProducts = orderData.products.map(product => {
    if (product.productName === productName) {
      // Ürün bulunursa miktarını artırıyoruz
      product.quantity += 1;
      product.totalPrice = (product.productPrice * product.quantity).toFixed(2);
    }
    return product;
  });

  // Güncellenmiş siparişi Firebase'e kaydediyoruz
  await update(orderRef, { products: updatedProducts });
};

// Ürün miktarını azaltma
export const decreaseProductQuantity = async (companyKey, tableKey, orderId, productName) => {
  const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderId}`);
  
  // Siparişi alıyoruz
  const snapshot = await get(orderRef);
  const orderData = snapshot.val();
  
  const updatedProducts = orderData.products.map(product => {
    if (product.productName === productName && product.quantity > 1) {
      // Ürün bulunursa miktarını azaltıyoruz
      product.quantity -= 1;
      product.totalPrice = (product.productPrice * product.quantity).toFixed(2);
    }
    return product;
  });

  // Güncellenmiş siparişi Firebase'e kaydediyoruz
  await update(orderRef, { products: updatedProducts });
};
