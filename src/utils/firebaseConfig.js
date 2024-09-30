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
  apiKey: "AIzaSyCTueQdJN2sIY_4lUX2KBvkbpNF0RKty5M",
  authDomain: "zen-pilates-f24eb.firebaseapp.com",
  projectId: "zen-pilates-f24eb",
  storageBucket: "zen-pilates-f24eb.appspot.com",
  messagingSenderId: "499469769988",
  appId: "1:499469769988:web:d552b026604df05f254451",
  measurementId: "G-RJZYXMHGQB",
};
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  
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
export const uploadFileToFirebase = (file, folder = "uploads", userId) => {
  if(!userId){
    userId = generateRandomString(10);
  }
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${folder}/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Có thể hiển thị tiến trình upload nếu cần
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
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
