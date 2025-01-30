import React from 'react'
import styles from '../policy.module.css'

export const metadata = {
  title: "Policies - Lebrra",
  description:
    "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
  keywords: ["Lebrra","Accessories","Footwear","Men's Clothing","Women's Clothing","Kid's Clothing","About Lebrra"],
  openGraph: {
    title: "Policies - Lebrra",
    description:
      "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    url: "https://lebrra.com/pages/shipping-policy",
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
    canonical: "https://lebrra.com/pages/shipping-policy",
  },
  icons: {
    icon: "https://lebrra.com/favicon-32x32.png", // Default favicon
    apple: "https://lebrra.com/apple-touch-icon.png", // Apple Touch Icon
    shortcut: "https://lebrra.com/favicon.ico", // Shortcut Icon
  },
  other: {
    // Add custom meta tags here
    "title": "Policies - Lebrra"
  },
};
const page = () => {
  return (
    <div className={styles.policy}>
      <h1>Shipping Policy</h1>
      <p>At Lebrra, we strive to provide our customers with the best possible shopping experience. That's why we offer fast and reliable shipping worldwide.</p>
      <p className={styles.bold}>Order Processing:</p>
      <p>1. All orders are processed within 1-2 business days</p>
      <p>2. All the orders are delivered within 2-5 Business days</p>
      <p className={styles.bold}>COD Orders Processing:</p>
      <p>1. After Placing a COD order, you will receive a WhatsApp text to confirm your order</p>
      <p>2. You will also receive a call from our order processing department to confirm your location</p>
      <p>In the event that your order is lost or damaged during shipping, please contact us immediately and we will do our best to resolve the issue.</p>
      <p>Thank you for shopping with Lebrra. If you have any questions or concerns, please don't hesitate to contact us.</p>
    </div>
  )
}

export default page
