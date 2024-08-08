const UserImageAndName = ({
  imgSrc,
  userName,
}: {
  imgSrc: string;
  userName: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <img className="h-10 w-10 rounded-full" src={imgSrc} alt="avatar" />
      <p className="font-helvetica-medium">{userName}</p>
    </div>
  );
};

export default UserImageAndName;
