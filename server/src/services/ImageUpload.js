import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase.js";

export async function uploadImage(file) {
  const uniqueFileName = `${uuidv4()}-${file.originalname}`;
  const imageRef = ref(storage, uniqueFileName);

  const metatype = {
    contentType: file.mimetype,
    name: uniqueFileName,
  };

  await uploadBytes(imageRef, file.buffer, metatype);

  const imageReferenceURL = `https://firebasestorage.googleapis.com/v0/b/${storage._bucket.bucket}/o/${uniqueFileName}?alt=media`;

  return imageReferenceURL;
}
