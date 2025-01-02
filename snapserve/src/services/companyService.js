import { database, ref, push, set, get, update, remove, onValue } from '../firebase';

// Yeni şirket kaydını "companies" altına ekleme fonksiyonu
export const addCompany = async (companyName, menuName, menuSlogan) => {
  try {
    // 'companies' altına yeni bir referans oluşturuyoruz
    const newCompanyRef = push(ref(database, 'companies')); // push, yeni veri için benzersiz bir id oluşturur
    // Veriyi veritabanına ekliyoruz
    await set(newCompanyRef, {
      companyName: companyName,
      menuName: menuName,
      menuSlogan: menuSlogan,
      id: Date.now(),
      tableIDCounter: 0
    });
    console.log("new company ref: ", newCompanyRef.key);
    return newCompanyRef.key; // Yeni kaydın benzersiz key'ini döndürüyoruz
  } catch (error) {
    console.error('Yeni şirket kaydedilemedi: ', error);
    throw error;
  }
};

// Async fonksiyon
export const getCompanyName = async (companyKey) => {
  try {
    const companyRef = ref(database, `companies/${companyKey}`);
    const snapshot = await get(companyRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data.companyName;
    } else {
      throw new Error('Veri bulunamadı');
    }
  } catch (error) {
    console.error('Şirket adı alınırken hata oluştu: ', error);
    throw error;
  }
};
export const uploadImageData = async (base64Data) => {
  
  try {
    const imageKey = new Date().toISOString();
    const imageRef = ref(database, 'images/' + imageKey);
    
    set(imageRef, {
      imageData: base64Data
    })
    .then(() => {
      console.log('Image uploaded successfully!');
    })
 
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error;
  }
}

export const getCompanyData = async (companyKey) => {
    try {

      const companyRef = ref(database, 'companies/' + companyKey);
      
 
      const snapshot = await get(companyRef);
      
      if (snapshot.exists()) {
        // Veriyi JSON formatında döndürüyoruz
        const companyData = snapshot.val();
        console.log('Şirket Verisi:', companyData);
        return companyData;
      } else {
        console.log('Bu companyKey için veri bulunamadı.');
        return null;
      }
    } catch (error) {
      console.error('Veri alınırken hata oluştu: ', error);
      throw error;
    }
  };

  export const listenToCompanyData = (companyKey, callback) => {
    const companyRef = ref(database, 'companies/' + companyKey);
  
    // onValue metodu ile veriyi dinliyoruz
    onValue(companyRef, (snapshot) => {
      if (snapshot.exists()) {
        // Veriyi JSON formatında döndürüyoruz
        const companyData = snapshot.val();
        console.log('Şirket Verisi (Dinleyici):', companyData);
        
        // Callback fonksiyonu çağırarak güncellenen veriyi React component'ine gönderiyoruz
        callback(companyData);
      } else {
        console.log('Bu companyKey için veri bulunamadı.');
        callback(null); // Eğer veri yoksa, null döndürüyoruz
      }
    }, (error) => {
      console.error('Veri alınırken hata oluştu: ', error);
    });
  };

  export const updateCompanyMenuNameMenuSlogan = async (companyKey, menuName, menuSlogan) => {
    try {

      const companyRef = ref(database, 'companies/' + companyKey);
  
      // 1. Mevcut verileri al
      const snapshot = await get(companyRef);
      if (snapshot.exists()) {
        const currentData = snapshot.val(); // Mevcut veriyi alıyoruz
  
        // 2. Sadece menuName ve menuSlogan'ı güncelle
        const updatedData = {
          ...currentData, // Mevcut veriyi koru
          menuName: menuName, // Yalnızca menuName'yi güncelle
          menuSlogan: menuSlogan, // Yalnızca menuSlogan'ı güncelle
        };
  
        // 3. Yeni veriyi veritabanına güncelle
        await update(companyRef, updatedData);
  
        console.log('Şirket menü detayları başarıyla güncellendi.', companyKey, menuName, menuSlogan);
      } else {
        console.log('Veri bulunamadı');
      }
    } catch (error) {
      console.error('Şirket menü detayları güncellenirken hata oluştu: ', error);
      throw error;
    }
  };

  export const addMenuPage = async (pageName, companyKey) => {
    try {
      const companyMenuRef = push(ref(database, 'companies/' + companyKey + '/menu'));
      
      await set(companyMenuRef, {
        menuPageName: pageName
      });

      console.log("YEni menu sayfası eklendi!");

    } catch (error) {
      console.error('Bİr hata oluştu!:Add Menu Page');
      throw error;
    }
  }

  export const  deleteMenuPage = async (pageKey, companyKey) => {
    try {
      const companyMenuPageRef = ref(database, 'companies/' + companyKey + '/menu/' + pageKey);

      await remove(companyMenuPageRef);

      console.log("silme başarılı!" + pageKey);
      
    } catch (error) {
      console.log("menu page remove error!");
      throw error;
    }
  }

  export const  deleteMenuItem = async (pageKey, companyKey, productKey) => {
    try {
      const companyMenuItemRef = ref(database, 'companies/' + companyKey + '/menu/' + pageKey + '/products/' + productKey);

      await remove(companyMenuItemRef);

      console.log("silme başarılı!" + pageKey);
      
    } catch (error) {
      console.log("menu page remove error!");
      throw error;
    }
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

export const addMenuPageProduct = async (pageKey, companyKey, name, description, price, image) => {
  try{
    const imageBase64Data = await convertToBase64(image);
    console.log("IMAGE TYPE: " + imageBase64Data);
    const companyMenuPageProductsRef = push(ref(database, 'companies/' + companyKey + '/menu/' + pageKey + '/products'));

    await set(companyMenuPageProductsRef, {
      productName: name,
      productDescription: description,
      productPrice: price,
      productPhotoURL: imageBase64Data
    });

    console.log("başarıyla ürün eklendi. pageKey: "+ pageKey);

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateMenuPageProduct = async (productKey, pageKey, companyKey, name, desc, price, image) => {
  try {
  
    const imageBase64Data = await convertToBase64(image);
    const companyMenuPageProductRef = ref(database, 'companies/' + companyKey + '/menu/' + pageKey + '/products/' + productKey);

    const updatedData = {
      productName: name, 
      productDescription: desc, 
      productPrice: price, 
      productPhotoURL: imageBase64Data, 
    };

    // 3. Yeni veriyi veritabanına güncelle
    await update(companyMenuPageProductRef, updatedData);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const addTable = async (companyKey) => {
  try {
    const companyTablesRef = push(ref(database, 'companies/' + companyKey + '/tables'));

    const companyTableIDCounterRef = ref(database, 'companies/' + companyKey + "/tableIDCounter");
    
    const snapshot = await get(companyTableIDCounterRef);

    // Veritabanında veri varsa
    if (snapshot.exists()) {
      await set(companyTablesRef, {
        tableID: snapshot.val(),
        tableName: "name",
        tableQRBase64Data: "qrBase64"
      });
      await set(companyTableIDCounterRef, snapshot.val()+1);
      console.log("başarılı");
    } else {
      await set(companyTablesRef, {
        tableID: 0,
        tableName: "name",
        tableQRBase64Data: "qrBase64"
      });
      await set(companyTableIDCounterRef, 1);
   
    }


  } catch (error) {
    
  }
}

export const deleteTable = async (tableKey, companyKey) => {
  try {
    const companyTableRef = ref(database, 'companies/' + companyKey + '/tables/'+ tableKey);

    await remove(companyTableRef);

    console.log("table silme başarılı key:" + tableKey);



  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const addOrder = async (companyKey, tableKey, products) => {
  try {
    const tableRef = push(ref(database, 'companies/' + companyKey + '/tables/' + tableKey + '/orders'));

    // Sipariş verisini Firebase'e kaydediyoruz
    await set(tableRef, {
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

    console.log("Başarıyla siparişler eklendi.");

  } catch (error) {
    console.log("Hata oluştu: ", error);
    throw error;
  }
};


const calculateOrderTotal = (order) => {
  // Bir siparişin toplam tutarını hesaplar
  return order.products.reduce((total, product) => {
    const productTotal = parseFloat(product.productPrice) * product.quantity;
    return total + productTotal;
  }, 0);
};

export const fetchTablesAndOrders = (companyKey, setTables) => {
  const tablesRef = ref(database, `companies/${companyKey}/tables`);

  // Firebase'den veriyi dinlemek için onValue kullanıyoruz
  onValue(tablesRef, (snapshot) => {
    if (snapshot.exists()) {
      const tablesData = snapshot.val();

      // Tables'deki her tablonun orders verilerini al
      const tablesList = Object.entries(tablesData).map(([tableKey, table]) => {
        const ordersList = table.orders
          ? Object.entries(table.orders).map(([orderId, order]) => {
              const productsList = order.products.map((product) => ({
                productName: product.productName,
                productPrice: parseFloat(product.productPrice).toFixed(2),
                quantity: product.quantity,
                totalPrice: (parseFloat(product.productPrice) * product.quantity).toFixed(2),
              }));

              const totalAmount = calculateOrderTotal(order).toFixed(2);

              return {
                orderId,
                createdAt: order.createdAt,
                status: order.status,
                products: productsList,
                totalAmount,
              };
            })
          : [];

        return {
          tableKey,
          tableName: table.tableName,
          tableId: table.tableID,
          orders: ordersList,
        };
      });

      // Filter only tables with orders
      const tablesWithOrders = tablesList.filter(table => table.orders.length > 0);

      setTables(tablesWithOrders); // State'e yeni veriyi set ediyoruz
    } else {
      console.log("No tables found");
      setTables([]); // Hiç tablosu olmayan durumda state'i temizle
    }
  });
};

export const settleUp = async (companyKey, tableKey) => {
  try {
    const tableOrdersRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders`);

    const companyMenuRef = ref(database,  `companies/${companyKey}/menu`);

   


        // Siparişlerin tümünü al
        const snapshot = await get(tableOrdersRef);
        const menu = await get(companyMenuRef);

    
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
     
          // Satış verilerini kaydetmek için tarih oluştur
          const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD formatında tarih
    
          // Yeni satış verisi oluşturulacak
          const salesRef = push(ref(database, `companies/${companyKey}/salesStatistics/${date}`));
    
          // Satış verilerini işle
          let salesData = [];
          let totalRevenue = 0;
    
          // Orders'ı işle
          Object.values(ordersData).forEach((order) => {
            order.products.forEach((product) => {
              console.log("PRODUCT: "+product.productName+"-"+product.quantity+"-"+product.productPrice);
              if (menu.exists()) {
                const menuDataA = menu.val();
                
           
           
                for (const [menuKey, menuData] of Object.entries(menuDataA)) {
                  // Eğer products tanımlı ve boş değilse, işlemi yapıyoruz
              
                  if (menuData.products) {
                    const productA = Object.entries(menuData.products).find(
                      ([productKey]) => productKey === product.productKey
                    );
                    if (productA) {
                      // Burada istediğiniz işlemi yapabilirsiniz
                 
                      salesData.push({
                        productName: product.productName,
                        quantity: product.quantity,
                        productPrice: product.productPrice,
                        productPage: menuData.menuPageName,
                        date: Date.now(),
                  
                      });
                    }
                  }
                }
              
              }
          
            });
          });
    
          salesData.forEach(element => {
            console.log("eE: "+ JSON.stringify(element).toString());
       
          });

          await set(salesRef, salesData);
    
          // Tablo siparişlerini sıfırla (Ödeme tamamlandı)
       //   await set(tableOrdersRef, {});
    
          console.log("Orders settled and statistics updated!");
          console.log("Total revenue: ", totalRevenue);
        } else {
          console.log("No orders found for this table");
        }



    remove(tableOrdersRef);

    console.log("orders silindi!!");

  } catch (error) {
  console.log(error);
  throw error;  
  }

};



export const removeProduct = async (companyKey, tableKey, orderKey, productName) => {
  try {
    // Sipariş referansını alıyoruz
    const productRef = ref(database, "companies/" + companyKey + "/tables/" + tableKey + "/orders/" + orderKey);
    console.log(productName);

    // Veriyi alıyoruz
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      const order = snapshot.val();
      let updatedProducts = [...order.products];

      // Ürünü bulup, miktarını kontrol ediyoruz
      let productFound = false;
      updatedProducts = updatedProducts.map((product) => {
        if (product.productName === productName && product.quantity > 0) {
          productFound = true;
          // Eğer ürünün miktarı 1'den büyükse sadece miktarı azaltıyoruz
          if (product.quantity > 1) {
            product.quantity -= 1;
          } else {
            // Eğer miktar 1 ise, ürünü tamamen siliyoruz
            return null;
          }
        }
        return product;
      }).filter(product => product !== null); // null olan ürünleri filtreliyoruz

      // Eğer ürün bulunduysa, siparişi güncelliyoruz
      if (productFound) {
        const updatedOrder = {
          ...order,
          products: updatedProducts
        };

        // Eğer updatedProducts boşsa, yani tüm ürünler silindiyse, son ürün silindi mesajı veriyoruz
        if (updatedProducts.length === 0) {
          // Siparişteki tüm ürünler silindiğinde, orderKey'i tamamen kaldırıyoruz
          await remove(productRef);
          console.log('Son ürün silindi ve sipariş tamamen kaldırıldı!');
        } else {
          // Ürünler silinmediyse, sadece güncellenmiş siparişi kaydediyoruz
          await update(productRef, updatedOrder);
          console.log('Ürün başarıyla silindi!');
        }
      }
    } else {
      console.log("Sipariş bulunamadı.");
    }
  } catch (error) {
    console.log("Hata: Ürün silinemedi.");
    throw error;
  }
};

export const increaseProductQuantity = async (companyKey, tableKey, orderKey, productName) => {
  try {
    // Firebase'deki ürünlerin bulunduğu referansa erişiyoruz
    const productRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderKey}/products`);
    const orderRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders/${orderKey}`);
    // Veriyi alıyoruz
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      let updatedProducts = snapshot.val().map((product) => {
        if (product.productName === productName) {
          // Miktarı artırıyoruz
          product.quantity += 1;
        }
        return product;
      });

      // Firebase'e güncellenmiş veriyi kaydediyoruz
      // Burada sadece `products` listesini güncellememiz gerektiği için
      // 'products' anahtarını kullanarak güncelleme yapıyoruz
      await update(orderRef, { products: updatedProducts });

      console.log('Ürün miktarı artırıldı!');
    }
  } catch (error) {
    console.error("Ürün miktarı artırılamadı:", error);
  }
};
