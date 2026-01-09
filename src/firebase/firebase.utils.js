import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import config from "./firebase.config";

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // 1. Referencia létrehozása
  const userRef = doc(db, "users", userAuth.uid);

  try {
    // 2. Adatok lekérése
    const snapShot = await getDoc(userRef);

    // 3. ELLENŐRZÉS: A v9-ben az .exists egy FÜGGVÉNY!
    if (!snapShot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      // 4. Mentés
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData
      });
      
      // Frissített snapShot-ot is kérhetünk, ha rögtön szükség van rá
    }
  } catch (error) {
    console.error('Hiba a felhasználó létrehozásakor:', error.message);
  }

  // Visszaadjuk a referenciát, hogy az App.js-ben lehessen rá onSnapshot-ot tenni
  return userRef;
};


const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => signInWithPopup(auth, provider);
