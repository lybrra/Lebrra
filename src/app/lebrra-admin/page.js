import React,{Suspense} from 'react'
import Admin from '../../../components/admin/Admin';
export const dynamic = 'force-dynamic'; // Use dynamic rendering for this page
export const metadata = {
  title: "Dashboard | Lebrra",
  description:
    "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
  openGraph: {
    title: "Dashboard | Lebrra",
    description:
      "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    images: [
      {
        url: "https://res.cloudinary.com/dtifzt5oe/image/upload/c_limit,h_1000,f_auto,q_auto/v1724229967/lql7ijbwclwwwwr8bx0x.webp",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "https://lebrra.com/favicon-32x32.png", // Default favicon
    apple: "https://lebrra.com/apple-touch-icon.png", // Apple Touch Icon
    shortcut: "https://lebrra.com/favicon.ico", // Shortcut Icon
  },

};

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
<Admin/>
    </Suspense>
  )
}

export default page
