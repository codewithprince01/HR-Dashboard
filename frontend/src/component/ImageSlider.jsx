import React, { useEffect, useState } from "react";

const images = [
  "/slider/slider1.jpeg",
  "/slider/slider2.png",
  "/slider/slider3.jpeg",
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-purple-800 text-white p-8 flex flex-col justify-center h-full">
      <div className="w-full max-w-md mx-auto">
        <div className="overflow-hidden rounded-xl mb-6">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`slide-${index}`}
                className="w-full h-70 object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </h2>
          <p className="text-sm text-purple-200">
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="flex justify-center mt-6 space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  current === index ? "bg-white" : "bg-purple-400"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
