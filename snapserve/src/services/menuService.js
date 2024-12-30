import { database, ref, push, set, get, update, remove, onValue } from '../firebase';

// FEtch Menu
export const fetchMenu = async (companyKey) => {
    console.log("menu fetch key: "+companyKey);
    const menuRef = ref(database, `companies/${companyKey}/menu`);
    try {
        const snapshot = await get(menuRef);
        if (snapshot.exists()) {
          return snapshot.val();  // Veriyi state'e ata
        } else {
          console.log("Veri bulunamadı. !!!!!");
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
  };
  