import { useCallback, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import toast from "react-hot-toast";

const useUploadImage = (app: any) => {
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const resetImageUpload = () => {
    setImageFileUploading(false);
    setImageFileUploadError(null);
    setImageFileUploadProgress(null);
    setImgUrl(null);
  };

  const uploadImage = useCallback(
    async (imageFile: File) => {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(parseInt(progress.toFixed(0), 10));
        },
        () => {
          setImageFileUploadError(
            "Use only images (File must be less than 2MB)"
          );
          setImageFileUploadProgress(null);
          setImgUrl(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrl(downloadURL);
            toast.success("Image uploaded successfully, Please save changes");
            setImageFileUploading(false);
          });
        }
      );
    },
    [app]
  );

  return {
    uploadImage,
    imageFileUploading,
    imageFileUploadError,
    imageFileUploadProgress,
    imgUrl,
    resetImageUpload,
  };
};

export default useUploadImage;
