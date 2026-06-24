// frontend/src/components/Layout/Hero.js
import React, { useEffect, useState } from "react";
import heroImg from "../../assets/banner.png";
import heroImg2 from "../../assets/banner2.jpg";
import heroImg3 from "../../assets/banner3.jpg";

const Hero = () => {
  const images = [heroImg, heroImg2, heroImg3];
  const [curSlide, setCurSlide] = useState(0);

  useEffect(() => {
    if (!images?.length) return;

    const timer = setInterval(() => {
      setCurSlide((prevSlide) => (prevSlide + 1) % images?.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [images?.length]);

  return (
    <section className="w-full overflow-hidden bg-gray-100">
      <div className="relative w-full aspect-video md:aspect-21/9 lg:aspect-21/9">
        {images?.length > 0 &&
          images.map((slide, i) => (
            <img
              key={i}
              src={slide}
              alt={`Slide ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${
                i === curSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        
        {/* Optional: Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === curSlide ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;