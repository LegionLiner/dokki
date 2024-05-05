import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

export const app = firebase.initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore();
export { collection, getDocs, setDoc, doc } from "firebase/firestore";
