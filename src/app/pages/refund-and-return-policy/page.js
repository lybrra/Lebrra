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
    url: "https://lebrra.com/pages/refund-and-return-policy",
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
    canonical: "https://lebrra.com/pages/refund-and-return-policy",
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
      <h1>Refund and Exchange Policy</h1>
      <p>At Lebrra, customer satisfaction is our top priority. If you are not completely satisfied with your purchase, please contact us within 7 days of receiving your order to make arrangements for a replacement.</p>
      <p>We do not offer refunds under any circumstances. In the event that you receive a defective product, we will make arrangements for a replacement at no additional cost to you. If we are unable to offer a replacement we will provide you refund or store credits within 7 working days.</p>
      <p>All returns must be authorized by Lebrra and must be returned in their original, unused condition with all tags and packaging intact. Any unauthorized returns or items that are not in their original condition will not be accepted and will be returned to the sender at their expense.</p>
      <p>We reserve the right to refuse any return or exchange at any time.</p>
      <p>Thank you for shopping with Lebrra. If you have any questions or concerns, please don't hesitate to contact us.</p>
    </div>
  )
}

export default page
