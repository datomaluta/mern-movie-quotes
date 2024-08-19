const UserImageAndName = ({
  imgSrc,
  userName,
}: {
  imgSrc: string;
  userName: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <img
        className="h-10 w-10 sm:h-8 sm:w-8 rounded-full object-cover"
        src={imgSrc}
        alt="avatar"
      />
      <p className="font-helvetica-medium">{userName}</p>
    </div>
  );
};

export default UserImageAndName;
