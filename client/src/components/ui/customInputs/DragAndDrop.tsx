import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslate } from "../../../hooks/useTranslate";
import { IoCameraOutline } from "react-icons/io5";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

const DragAndDrop = ({
  control,
  imgUrl,
  imageFileUploading,
  imageFileUploadError,
  validationError,
}: {
  control: ControllerRenderProps<FieldValues, string>;
  imgUrl: string | null | undefined;
  imageFileUploading: boolean;
  imageFileUploadError: string | null;
  validationError: string;
}) => {
  const { t } = useTranslate();
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      onChange: ControllerRenderProps<FieldValues, string>["onChange"]
    ) => {
      onChange(acceptedFiles);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, control.onChange),
  });

  return (
    <div>
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
            <p className="text-project-danger">{imageFileUploadError}</p>
          </div>
        )}
      </div>
      <p className="text-project-danger mt-1">{validationError}</p>
    </div>
  );
};

export default DragAndDrop;
