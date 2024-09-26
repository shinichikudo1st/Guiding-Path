import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY;

if (!SECRET_KEY) {
  console.error(
    "NEXT_PUBLIC_ENCRYPTION_SECRET_KEY is not set in the environment variables"
  );
}

export function encrypt(data) {
  try {
    if (!SECRET_KEY) throw new Error("Encryption key is not set");
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

export function decrypt(encryptedData) {
  try {
    if (!SECRET_KEY) throw new Error("Encryption key is not set");
    if (!encryptedData) throw new Error("No data to decrypt");
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
