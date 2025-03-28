import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

// const VALIDATION_HASH = "15963296e5d0827649d160c5576c7c2c";
const VALIDATION_HASH = import.meta.env.VITE_VALIDATION_HASH;

// Function to validate the environment
export const validateEnvironment = () => {
  const computedHash = validationKey
    ? CryptoJS.MD5(validationKey).toString()
    : "";

  //   console.log(
  //     "🔍 Loaded VITE_SECRET_KEY:",
  //     secretKey ? "✅ Present" : "❌ Missing"
  //   );
  //   console.log(
  //     "🔍 Loaded VITE_SECRET_VALIDATION:",
  //     validationKey || "❌ Missing"
  //   );
  //   console.log("🔍 Computed Hash:", computedHash);
  //   console.log("🔍 Expected Hash:", VALIDATION_HASH);

  // Ensure the environment is valid
  if (!secretKey || computedHash !== VALIDATION_HASH) {
    console.error("❌ Invalid environment detected! The app will not work.");
    throw new Error(
      "Unauthorized environment file detected. Please check .env settings."
    );
  }
};

// ---------------------------------ENCRYPTION DECRYPTION FOR PARMS ID-------------------------------------
// Encrypt ID
export const encryptId = (id) => {
  if (!id) return "";
  return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
};

// Decrypt ID
export const decryptId = (encryptedId) => {
  try {
    if (!encryptedId) return "";
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("❌ Decryption Error:", error);
    return "";
  }
};
