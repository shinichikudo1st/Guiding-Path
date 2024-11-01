import React, { useState, useEffect } from "react";

const ProgressiveImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src + "?w=10"); // Start with a tiny version
  const [imageRef, setImageRef] = useState();

  const onLoad = () => {
    setImageSrc(src);
  };

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: "75%",
          }
        );
        observer.observe(imageRef);
      } else {
        // Fall back to setTimeout for browsers that don't support IntersectionObserver
        setTimeout(() => {
          if (!didCancel) {
            setImageSrc(src);
          }
        }, 100);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${
        imageSrc === src ? "" : "blur-sm"
      } transition-all duration-300`}
      onLoad={onLoad}
    />
  );
};

export default ProgressiveImage;
