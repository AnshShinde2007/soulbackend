import admin from "firebase-admin";
import fs from "fs";

if (!admin.apps.length) {
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const raw = fs.readFileSync("./soulyatri.json", "utf8");
    serviceAccount = JSON.parse(raw);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const initFirebase = () => {
  // Initialized at module level
};

export const db = admin.firestore();
export { admin };
