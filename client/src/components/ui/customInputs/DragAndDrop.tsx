import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslate } from "../../../hooks/useTranslate";
import { IoCameraOutline } from "react-icons/io5";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";

const DragAndDrop = ({
  control,
  imgUrl,
  imageFileUploading,
}: {
  control: any;
  imgUrl: string | null;
  imageFileUploading: boolean;
}) => {
  const { t } = useTranslate();
  const onDrop = useCallback((acceptedFiles, onChange) => {
    console.log(acceptedFiles);
    onChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, control.onChange),
  });

  console.log(imageFileUploading);

  return (
    <div
      {...getRootProps()}
      className="border border-project-gray p-4 rounded min-h-[6.5rem] flex items-center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>{t("drop_files_here")}...</p>
      ) : (
        <div className="flex md:flex-col  gap-4 items-center w-full">
          <p className="flex gap-2 items-center">
            <IoCameraOutline className="h-7 w-7" />
            {t("drag_image")}
          </p>
          <label className="bg-project-purple px-2 py-1 rounded cursor-pointer">
            {t("choose_file")}
          </label>
          {imgUrl && !imageFileUploading ? (
            <img
              className="h-16 w-20 object-cover ml-auto md:ml-0 rounded"
              src={imgUrl}
              alt="preview"
            />
          ) : (
            ""
          )}

          {imageFileUploading && <LoadingSpinner className="ml-auto" />}
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
