import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import img from "./../../../../assets/images/placeholder.jpg";
import "./lazy.css";

const LazyImageDisplay = ({
  imageUrl,
  alt,
}: {
  imageUrl: string;
  alt: string;
}) => {
  return (
    <div className="image-container">
      <LazyLoadImage
        src={imageUrl}
        alt={alt}
        className="lazy-image"
        effect="blur"
        placeholderSrc={img}
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};

export default LazyImageDisplay;
