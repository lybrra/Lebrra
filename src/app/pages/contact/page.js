import React from 'react'
import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiHeadphones } from "react-icons/ci";
import { PiEnvelopeThin } from "react-icons/pi";
import styles from './contact.module.css'

export const metadata = {
  title: "Contact - Lebrra",
  description:
    "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
  keywords: ["Lebrra","Accessories","Footwear","Men's Clothing","Women's Clothing","Kid's Clothing","About Lebrra"],
  openGraph: {
    title: "Contact - Lebrra",
    description:
      "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    url: "https://lebrra.com/pages/contact",
    images: [
      {
        url: "https://res.cloudinary.com/dtifzt5oe/image/upload/c_limit,h_1000,f_auto,q_auto/v1724229967/lql7ijbwclwwwwr8bx0x.webp",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lebrra.com/pages/contact",
  },
  icons: {
    icon: "https://lebrra.com/favicon-32x32.png", // Default favicon
    apple: "https://lebrra.com/apple-touch-icon.png", // Apple Touch Icon
    shortcut: "https://lebrra.com/favicon.ico", // Shortcut Icon
  },
  other: {
    // Add custom meta tags here
    "title": "Contact - Lebrra"
  },
};
const contact = () => {
  return (
    <div className={styles.contact}>
        <h1>Contact Us</h1>
      <div className={styles.contacts}>
      <img src="https://img.freepik.com/free-vector/postponed-concept_23-2148496571.jpg" alt="" />
      <div className={styles.contactForm}>
            <div>
                <CiUser style={{color:"black"}}/>
                <input type="text" placeholder='Full Name'/>
            </div>
            <div>
                <CiMail style={{color:"black"}}/>
                <input type="text" placeholder='Email'/>
            </div><div>
                <CiHeadphones style={{color:"black"}}/>
                <input type="text" placeholder='Mobile Number'/>
            </div><div className={styles.contactAddress}>
                <PiEnvelopeThin style={{color:"black"}}/>
                <textarea name="" id="" placeholder='Message'></textarea>
            </div>
            <div className={styles.contactSubmit}>
                <button>Submit</button>
            </div>
      </div>
      </div>
      <div className={styles.contactMap}>
        
      </div>
    </div>
  )
}

export default contact
