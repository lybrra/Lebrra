import React from "react";
import Products from "../../../../components/Products";
import Link from "next/link";

// Function to generate dynamic metadata
export async function generateMetadata({ params }) {
  const { cid } = await params;

  try {
    const response = await fetch(`${process.env.API_PORT}collection?handle=${cid}`);
    const data = await response.json();
    if (data.success) {
      return {
        title: data?.collection?.metaTitle || "Lebrra | Online Shopping",
        description: data?.collection?.metaDesc || "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
        keywords: [data?.collection?.title, data?.collection?.category],
        openGraph: {
          title: data?.collection?.metaTitle || "Lebrra | Online Shopping",
          description: data?.collection?.metaDesc || "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
          url: `https://lebrra.com/collections/${cid}`,
          images: data?.collection?.banner[0]?.url || [],
        },
        alternates: {
          canonical: `https://lebrra.com/collections/${cid}`,
        },
        robots: {
          index: true,
          follow: true,
        },
        icons: {
          icon: "https://lebrra.com/favicon-32x32.png",
          apple: "https://lebrra.com/apple-touch-icon.png",
          shortcut: "https://lebrra.com/favicon.ico",
        },
        other: {
          // Add custom meta tags here
          "title": data?.collection?.metaTitle || "Lebrra | Online Shopping"
        },
      };
    }
  } catch (error) {
    console.log("Error fetching metadata:", error.message);
  }

  return {
    title: "Lebrra | Online Shopping",
    description:
      "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    keywords: ["Men's Loafers", "Premium Shoes", "Lebrra"],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://lebrra.com/collections/${cid}`,
    },
  };
}

// Page component
const Page = async ({ params, searchParams }) => {
  const { cid } =await params;
  const {page,sort,color,brand,size}=await searchParams
  // const page = searchParams?.page || 1;
  // const sort = searchParams?.sort || "";
  // const color = searchParams?.color || "";
  // const brand = searchParams?.brand || "";
  // const size = searchParams?.size || "";

  let prdtData = null;
  let collection = null;
  let noPrdt = false;

  try {
    const collectionResponse = await fetch(
      `${process.env.API_PORT}collection?handle=${cid}`
    );
    const collectionData = await collectionResponse.json();

    if (collectionData.success) {
      collection = collectionData.collection;
      const productUrl = new URL(`${process.env.API_PORT}products`);
      productUrl.searchParams.append("page", page);
      productUrl.searchParams.append("collectionName", collectionData.collection.title);
      productUrl.searchParams.append("state", "active");
      if (size) productUrl.searchParams.append("size", size);
      if (sort) productUrl.searchParams.append("sort", sort);
      if (color) productUrl.searchParams.append("color", color);
      if (brand) productUrl.searchParams.append("brand", brand);
  
      const productResponse = await fetch(productUrl);
      const productData = await productResponse.json();
  
      if (productData.success) {
        prdtData = productData;
      } else {
        console.log("Error fetching products");
      noPrdt = true;
  
      }

    } else {
      noPrdt = true;
    }
   

    
  } catch (error) {
    console.log("Error fetching data:", error.message);
    noPrdt = true;
  }
  return (
    <>
      {noPrdt ? (
        <div
          style={{
            margin: "80px 1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <h1 style={{ marginBottom: "25px" }}>404 Page Not Found</h1>
          <Link prefetch={true} href="/">
            <button
              style={{
                color: "white",
                border: "none",
                padding: "8px 20px",
                fontSize: "17px",
                letterSpacing: "1px",
                backgroundColor: "var(--primary-color)",
                cursor: "pointer",
              }}
            >
              Return to Home
            </button>
          </Link>
        </div>
      ) : (
        <Products data={prdtData} collection={collection}/>
      )}
    </>
  );
};

export default Page;
