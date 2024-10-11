// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHJs8HXkNfqpDxqMZgK38duDCIuDsXuSc",
  authDomain: "zen-pilates-22aa7.firebaseapp.com",
  projectId: "zen-pilates-22aa7",
  storageBucket: "zen-pilates-22aa7.appspot.com",
  messagingSenderId: "84581216265",
  appId: "1:84581216265:web:e22a4645c0e6544d2888d8",
  measurementId: "G-9VBGGV3MXG"
};

function generateRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return randomString;
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload file lên Firebase Storage
 * @param {File} file - File được chọn từ input
 * @param {String} folder - Tên thư mục (nếu có)
 * @returns {Promise<String>} - Trả về URL của file sau khi upload thành công
 */
export const uploadFileToFirebase = (file, userId) => {
  if (!userId) {
    userId = generateRandomString(10);
  }
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `uploads/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
      },
      (error) => {
        // Bắt lỗi trong quá trình upload
        reject(error);
      },
      async () => {
        // Upload thành công
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Trả về URL của file
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Xóa file từ Firebase Storage
 * @param {String} fileUrl - URL của file cần xóa
 * @returns {Promise<void>}
 */
export const deleteFileFromFirebase = (fileUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
      resolve(); // Xóa file thành công
    } catch (error) {
      reject(error); // Xóa file thất bại
    }
  });
};
