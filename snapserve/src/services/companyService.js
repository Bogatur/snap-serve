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

export const addMenuPageProduct = async (pageKey, companyKey, name, description, price, photoURL) => {
  try{
    const companyMenuPageProductsRef = push(ref(database, 'companies/' + companyKey + '/menu/' + pageKey + '/products'));

    await set(companyMenuPageProductsRef, {
      productName: name,
      productDescription: description,
      productPrice: price,
      productPhotoURL: photoURL
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