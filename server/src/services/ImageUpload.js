import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";

export async function uploadImage(file) {
  console.log(storage);
  if (!file || !file.buffer) {
    throw new Error("Invalid file object. File buffer is missing.");
  }

  const uniqueFileName = `${uuidv4()}-${file.originalname}`;
  const imageRef = ref(storage, uniqueFileName);

  const metadata = {
    contentType: file.mimetype || "image/jpeg",
  };

  console.log("file.buffer:", file.buffer instanceof Buffer);
  console.log("file.mimetype:", file.mimetype);

  await uploadBytes(imageRef, file.buffer, metadata);
  console.log(2);

  // Get the download URL from Firebase Storage
  const imageReferenceURL = await getDownloadURL(imageRef);

  return imageReferenceURL;
}
