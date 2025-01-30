"use client";
import React, { useEffect, useState } from "react";
import styles from "./carousel.module.css";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

const Carousel = ({banners}) => {
  const images = [
   banners[0]?.images[0],
   banners[1]?.images[0],
   banners[2]?.images[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-slide logic with proper cleanup
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup the interval
  }, [images.length]);

  // Manual navigation functions
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };


  return (
    <div className={styles.carousel}>
      <div className={styles.imageWrapper}>
        <img 
        src={images[currentIndex]?.url}
          alt={`Slide ${currentIndex + 1}`}
          className={styles.image}
          width="2560px"
          height="auto"
          />
      </div>

      {/* Navigation Buttons */}
      <div className={styles.buttons}>
        <button onClick={prevImage} className={styles.prevButton}>
          <GrPrevious/>
        </button>
        <button onClick={nextImage} className={styles.nextButton}>
          <GrNext/>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
