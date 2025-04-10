import React, { useEffect, useState } from "react";

const images = [
  "/slider/slider1.jpeg",
  "/slider/slider2.png",
  "/slider/slider3.jpeg",
];

const sliderContainerStyle = {
  backgroundColor: '#6B21A8',
  color: 'white',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
};

const sliderWrapperStyle = {
  width: '100%',
  maxWidth: '28rem',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const sliderViewportStyle = {
  overflow: 'hidden',
  borderRadius: '0.75rem',
  marginBottom: '1.5rem',
};

const sliderTrackStyle = {
  display: 'flex',
  transition: 'transform 1s ease-in-out',
};

const sliderImageStyle = {
  width: '100%',
  height: '17.5rem',
  objectFit: 'cover',
  flexShrink: '0',
};

const sliderHeadingStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  textAlign: 'center',
};

const sliderDescriptionStyle = {
  fontSize: '0.875rem',
  color: '#E9D5FF',
  textAlign: 'center',
};

const sliderDotsStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1.5rem',
  gap: '0.5rem',
};

const sliderDotStyle = {
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '9999px',
  transition: 'all 0.3s',
  backgroundColor: '#A78BFA',
};

const sliderDotActiveStyle = {
  ...sliderDotStyle,
  backgroundColor: 'white',
};

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={sliderContainerStyle}>
      <div style={sliderWrapperStyle}>
        <div style={sliderViewportStyle}>
          <div
            style={{
              ...sliderTrackStyle,
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`slide-${index}`}
                style={sliderImageStyle}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 style={sliderHeadingStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </h2>
          <p style={sliderDescriptionStyle}>
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div style={sliderDotsStyle}>
            {images.map((_, index) => (
              <span
                key={index}
                style={current === index ? sliderDotActiveStyle : sliderDotStyle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;