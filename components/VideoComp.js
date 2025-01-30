"use client"
import React from 'react';
import styles from '../src/app/page.module.css';
import logo from '../images/vwhite.png'
import Image from 'next/image';
import Link from 'next/link';

const VideoComp = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.homeLogo}>
        <Image src={logo} alt="" width={400} style={{marginBottom:"10px"}}/>
        <Link href="/" ><button>SHOP NOW</button></Link>
        <h1 style={{opacity:0,margin:0,fontSize:'1px'}}>Home Page</h1>
      </div>
      <div className={styles.videos}>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            muted
            loop
            preload="metadata"
            autoPlay
            poster='https://res.cloudinary.com/dqh6bd766/image/upload/c_limit,h_1000,f_auto,q_auto/v1734682481/vlovs21nx4uttmoworgm.jpg'

          >
            <source src="https://chicoline.com/static/media/video1.022d5d803f2349aa91f4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            muted
            loop
            preload="metadata"
            autoPlay
            poster='https://res.cloudinary.com/dqh6bd766/image/upload/c_limit,h_1000,f_auto,q_auto/v1732017952/lpc7riyoswvddqngrnml.jpg'

           
          >
            <source src="https://chicoline.com/static/media/video2.6fefcb40dcadb5d9c540.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className={`${styles.videos} ${styles.videos1}`}>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            muted
            loop
            preload="metadata"
            autoPlay
            poster='https://res.cloudinary.com/dqh6bd766/image/upload/c_limit,h_1000,f_auto,q_auto/v1734682481/vlovs21nx4uttmoworgm.jpg'

          >
            <source src="https://chicoline.com/static/media/video1.022d5d803f2349aa91f4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoComp;
