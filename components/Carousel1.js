"use client";
import React, { useEffect, useState } from "react";


const Carousel1 = () => {
  const images = [
  "Save 5% On Prepaid Orders",
  "Free Shipping On Prepaid Orders"

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-slide logic with proper cleanup
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval); // Cleanup the interval
  }, [images.length]);



  return (
    <div style={{height:'28px',display:'flex',justifyContent:"center",alignItems:'center',backgroundColor:"var(--primary-color)",width:"100%"}}>
      <div>
        <p  style={{color:'white',fontWeight:'500',letterSpacing:'1px',fontSize:'14px'}}
          >{images[currentIndex]}</p>
      </div>

    </div>
  );
};

export default Carousel1;
