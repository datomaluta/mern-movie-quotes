const UserImageAndName = ({
  imgSrc,
  userName,
}: {
  imgSrc: string;
  userName: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <img className="h-12 w-12 rounded-full" src={imgSrc} alt="avatar" />
      <p className="font-helvetica-medium">{userName}</p>
    </div>
  );
};

export default UserImageAndName;
