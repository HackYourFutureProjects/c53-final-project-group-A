import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/firebaseAdmin.js";

export async function uploadImage(file) {
  if (!file || !file.buffer) {
    throw new Error("Invalid file object. File buffer is missing.");
  }

  const uniqueFileName = `${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(uniqueFileName);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype || "image/jpeg",
    },
    public: true,
    validation: "md5",
  });

  const imageUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
  return imageUrl;
}
