import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UseFormRegister } from "react-hook-form";
import { useTranslate } from "../../hooks/useTranslate";
import "react-circular-progressbar/dist/styles.css";

const ImagePicker = ({
  imageFileUploadProgress,
  register,
  imageFileUploadError,
  imgPreview,
}: {
  imageFileUploadProgress: number | null;
  register: UseFormRegister<any>;
  imageFileUploadError: string | null;
  imgPreview: string | null;
}) => {
  const { t } = useTranslate();

  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[11.75rem]  h-[11.75rem]  rounded-full overflow-hidden relative bg-project-light-blue">
        {imageFileUploadProgress ? (
          <CircularProgressbar
            value={imageFileUploadProgress || 0}
            text={`${imageFileUploadProgress}%`}
            strokeWidth={5}
            styles={{
              root: {
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 100,
              },
              path: {
                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
              },
            }}
          />
        ) : (
          ""
        )}
        <img
          className={`w-[11.75rem]  h-[11.75rem] object-cover   ${
            imageFileUploadProgress &&
            imageFileUploadProgress < 100 &&
            "opacity-60"
          }`}
          src={imgPreview || currentUser?.image}
          alt="img-preview"
        />
      </div>

      <label className="cursor-pointer" htmlFor="image">
        {t("upload_new_photo")}
      </label>
      <input
        {...register("image")}
        type="file"
        id="image"
        hidden
        // onChange={trigger("image")}
        // accept="image/*"
      />

      <p className="text-project-red h-2">{imageFileUploadError || ""}</p>
    </div>
  );
};

export default ImagePicker;
