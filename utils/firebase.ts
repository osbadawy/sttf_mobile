// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOn2ZeQLgi9QvpNsF6cn3Boc4WTBsF-bY",
  authDomain: "sttf-beefc.firebaseapp.com",
  projectId: "sttf-beefc",
  appId: "1:407693041843:web:ae756614a2cd8a5f1190c6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
