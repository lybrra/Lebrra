import React from 'react'
import styles from './about.module.css'
import Image from 'next/image'
export const metadata = {
  title: "About Us | Lebrra",
  description:
    "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
  keywords: ["Lebrra","Accessories","Footwear","Men's Clothing","Women's Clothing","Kid's Clothing","About Lebrra"],
  openGraph: {
    title: "About Us | Lebrra",
    description:
      "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    url: "https://lebrra.com/about",
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
    canonical: "https://lebrra.com/about",
  },
  icons: {
    icon: "https://lebrra.com/favicon-32x32.png", // Default favicon
    apple: "https://lebrra.com/apple-touch-icon.png", // Apple Touch Icon
    shortcut: "https://lebrra.com/favicon.ico", // Shortcut Icon
  },
  other: {
    // Add custom meta tags here
    "title": "About Us | Lebrra",
  },
};
const page = () => {
  return (
    <div className={styles.about}>
      <h1>About Lebrra</h1>
      <Image src="https://res.cloudinary.com/dqh6bd766/image/upload/c_limit,h_1000,f_auto,q_auto/v1726468497/yf1i2xjopwmnp9cszgtt.jpg" alt="about Lebrra" width={512} height={400} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
      <p>At Lebrra, we understand, style is not just about what you wear, it's about how you feel. That's why we go above and beyond to provide an exceptional shopping experience, with attentive customer service and a user-friendly online platform that makes it easy to find the perfect addition of collection to your luxurious wardrobe.</p>
      <p>Our team of fashion experts has carefully handpicked a stunning collection of authentic store articles of luxury high-end designer apparel, accessories, and footwear. Each piece has been carefully inspected to ensure that it meets our attentive standards of quality and authenticity.</p>
    </div>
  )
}

export default page
