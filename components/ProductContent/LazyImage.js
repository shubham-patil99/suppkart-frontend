import { useEffect, useRef, useState } from 'react';

const LazyImage = ({ src, alt, placeholder, ...props }) => {


  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  
  
  useEffect(() => {
    const imgElement = imgRef.current;
    
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });
    
    if (imgElement) {
      observer.observe(imgElement);
    }
    
    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, []);

  // console.log("src ," ,src);
  
  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : placeholder}
      alt={alt}
      {...props}
    />
  );
};

export default LazyImage;
