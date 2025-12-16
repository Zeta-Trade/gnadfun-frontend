import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale';
}

export function LazyImage({
  src,
  alt,
  className = '',
  animationType = 'fade',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  const animationClass = {
    fade: 'animate-fade-in',
    slide: 'animate-slide-in',
    scale: 'animate-scale-in',
  }[animationType];

  return (
    <img
      ref={imageRef}
      src={imageSrc || undefined}
      alt={alt}
      className={`${className} ${
        isLoaded ? animationClass : 'opacity-0'
      } transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  );
}
