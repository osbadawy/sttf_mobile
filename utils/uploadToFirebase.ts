import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

interface UploadToFirebaseOptions {
  /**
   * The folder name in Firebase Storage (e.g., "nutrition", "avatars")
   */
  folderName: string;

  /**
   * The ID to use in the filename (e.g., user ID, meal ID)
   */
  id: string;

  /**
   * Whether to include a timestamp in the filename
   */
  includeDate: boolean;

  /**
   * The local URI of the image to upload
   */
  imageUri: string;

  /**
   * Optional file extension (defaults to "png")
   */
  fileExtension?: string;
}

/**
 * Uploads an image to Firebase Storage
 * @param options Upload configuration options
 * @returns The download URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadToFirebase(
  options: UploadToFirebaseOptions,
): Promise<string> {
  const {
    folderName,
    id,
    includeDate,
    imageUri,
    fileExtension = "png",
  } = options;

  try {
    // Verify storage is initialized
    if (!storage) {
      throw new Error("Firebase Storage is not initialized");
    }

    let storageBucket = storage.app.options.storageBucket;

    if (!storageBucket) {
      throw new Error(
        "Firebase Storage bucket is not configured. Please check your environment variables.",
      );
    }

    // Fetch the image from local URI and convert to blob
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Ensure blob has content
    if (blob.size === 0) {
      throw new Error("Image blob is empty - invalid image data");
    }

    // Auto-detect file extension from blob type (prefer blob type over parameter)
    let detectedExtension = fileExtension;
    if (blob.type) {
      // Extract extension from MIME type (e.g., "image/jpeg" -> "jpg")
      const mimeExtension = blob.type.split("/")[1];
      if (mimeExtension) {
        detectedExtension = mimeExtension === "jpeg" ? "jpg" : mimeExtension;
      }
    }
    // Fallback if no blob type and no fileExtension provided
    if (!detectedExtension) {
      detectedExtension = "jpg";
    }

    // Build filename: {id}.{timestamp}.{extension} or {id}.{extension}
    let filename = id;
    if (includeDate) {
      const timestamp = new Date().getTime();
      filename = `${id}.${timestamp}`;
    }
    filename = `${filename}.${detectedExtension}`;

    // Create storage path: {folderName}/{filename}
    const storagePath = `${folderName}/${filename}`;
    const storageRef = ref(storage, storagePath);

    // Set metadata with actual blob content type
    const metadata = {
      contentType: blob.type || `image/${detectedExtension}`,
      cacheControl: "public,max-age=31536000",
    };

    // Upload the image with resumable upload for better error handling
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error("Upload error:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          reject(error);
        },
        () => {
          console.log("Upload completed successfully");
          resolve(uploadTask.snapshot);
        },
      );
    });

    // Get and return the download URL
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error: any) {
    console.error("Error uploading to Firebase Storage:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      serverResponse: error?.serverResponse,
      customData: error?.customData,
    });
    throw error;
  }
}
