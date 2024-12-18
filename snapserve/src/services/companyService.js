import { database, ref, push, set, get, update, remove } from '../firebase';

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

export const updateMenuPageProduct = async (productKey, pageKey, companyKey) => {
  try {

    const companyMenuPageProductRef = ref(database, 'companies/' + companyKey + '/menu/' + pageKey + '/products/' + productKey);

    const updatedData = {
      productName: "edit product name", 
      productDescription: "edit desc", 
      productPrice: "10", 
      productPhotoURL: "edit photo url", 
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

export const fetchTablesAndOrders = async (companyKey) => {
  try {
    const tablesRef = ref(database, `companies/${companyKey}/tables`);
    const snapshot = await get(tablesRef);

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

      return tablesList; // Tables verisi ile birlikte döndürüyoruz
    } else {
      console.log("No tables found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching tables and orders: ", error);
  }
};

export const settleUp = async (companyKey, tableKey) => {
  try {
    const tableOrdersRef = ref(database, `companies/${companyKey}/tables/${tableKey}/orders`);

    remove(tableOrdersRef);

    console.log("orders silindi!!");

  } catch (error) {
  console.log(error);
  throw error;  
  }

};