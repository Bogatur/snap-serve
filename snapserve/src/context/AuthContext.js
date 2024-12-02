// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { updateProfile } from 'firebase/auth'; 

const AuthContext = createContext();

// AuthProvider, oturum açan kullanıcı bilgilerini sağlayacak
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kullanıcı oturum durumu değiştiğinde, kullanıcıyı güncelle
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  
 const signup = async (email, password, rePassword, firstName, lastName) => {
    // Alanların boş olup olmadığını kontrol et
    if (!email || !password || !firstName || !lastName) {
      throw new Error("Tüm alanlar doldurulmalıdır.");
    }
    // şifrelerin uyuşup uyuşmadığını kontrol et
    if(password !== rePassword){
      throw new Error("Şifreler uyuşmuyor!");
    }

    try {
      // Firebase ile kullanıcı kaydı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Kullanıcıyı oluşturduktan sonra profil bilgilerini güncelle
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`, // İsim ve soyisim profil ismi olarak ayarlanır
      });

      console.log('Kullanıcı kaydedildi ve profil güncellendi:', userCredential.user);

      logout(); // üye olduktan sonra giriş yapılmış kabul edilecek ise bu satır gereksiz!
      //üye olduktan sonra login sayfasına yönlendirip giriş yapılması istenilecek ise burada logout çalışması lazım!

    } catch (error) {
      // Firebase hatalarını kontrol et ve uygun mesajı belirle
      let errorMessage = "Bir hata oluştu, lütfen tekrar deneyin."; // Genel hata mesajı

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Bu email adresi zaten kullanımda. Lütfen başka bir email adresi girin.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Geçersiz email adresi. Lütfen doğru bir email adresi girin.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin (en az 6 karakter).";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email ve şifre ile kayıt işlemi şu anda yapılamıyor. Sistem yöneticisine başvurun.";
      }

      // Hatayı fırlat
      throw new Error(errorMessage);
    }
  };
  

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext'i kullanmak için custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
