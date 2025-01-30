import React from 'react'
import styles from './page.module.css'
import Prdt4Grid from '../../components/Prdt4Grid';
import TrendingCol from '../../components/TrendingCol';
import Carousel from '../../components/Carousel';
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lebrra | Online Shopping",
  description:
    "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
  keywords: ["Men's Loafers", "Premium Shoes", "Lebrra","Premium Clothes","Men's Clothing","Women's Clothing","Kid's Clothing","Accessries","Premium Products","Men's Sneakers","Men's Shirts","T-shirts","Shirts"],
  openGraph: {
    title: "Lebrra | Online Shopping",
    description:
      "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    url: "https://lebrra.com/",
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
    canonical: "https://lebrra.com/",
  },
  icons: {
    icon: "https://lebrra.com/favicon-32x32.png", // Default favicon
    apple: "https://lebrra.com/apple-touch-icon.png", // Apple Touch Icon
    shortcut: "https://lebrra.com/favicon.ico", // Shortcut Icon
  },
  other: {
    // Add custom meta tags here
    "title": "Lebrra | Online Shopping",
  },
};




const page =async () => {

 
  let featured;
  let collectionData=[]
  let banners=[]

  const fetchFeatured = async () => {
    try {
      const response = await fetch(`${process.env.API_PORT}products/featured`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        featured=data?.data
      } else {
        console.error("Error fetching featured Products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching featured Products:", error.message);
    }
  };
  const fetchCollections = async () => {
    try {
      const response = await fetch(`${process.env.API_PORT}collection/trending-collections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        collectionData=data?.collectionsWithProducts;
      } else {
        console.error("Error fetching featured Products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching featured Products:", error.message);
    }
  };
  const fetchBanners = async () => {
    try {
      const response = await fetch(`${process.env.API_PORT}banner/get-banners`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (response.ok) {
        banners=data
      } else {
        console.error("Error fetching banners:", data.error);
      }
    } catch (error) {
      console.error("Error fetching banners:", error.message);
    }
  };
  
  
  await fetchFeatured();
  await fetchCollections();
  await fetchBanners()
  return (
    <div className={styles.home}>
              <Carousel banners={banners}/>
      <div className={styles.trendingProducts}>
            <h1>OUR TRENDING PRODUCTS</h1>
              <Prdt4Grid prdts={featured?.featuredProducts} color="var(--primary-color)"/>
        </div>
        {
          collectionData && collectionData?.map((item,index)=>{
       return <TrendingCol name={item.category} collections={item} banner={item?.banner[1]?.url} prdts={item?.mensFeaturedPrdts} color="var(--primary-color)" key={index}/>
        
          })
        }

        <div className={`${styles.trendingProducts} ${styles.newProducts}`}>
            <h1><span>NEW</span><span> ARRIVALS</span></h1>
              <Prdt4Grid prdts={featured?.latestProducts} color="var(--primary-color)"/>
        </div>
    </div>
  )
}

export default page
