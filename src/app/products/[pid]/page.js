import React from "react";
import SingleProduct from "../../../../components/SingleProduct";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { pid } = await params;
  // Fetch metadata from the collection
  try {
    const response = await fetch(`${process.env.API_PORT}products/single-product?productHandle=${pid}`);
    const data = await response.json();
    if (data.success) {
      return {
        title: data?.product[0]?.metaTitle || "Lebrra | Online Shopping",
        description: data?.product[0]?.metaDesc || "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
        keywords: ["Lebrra",data?.product[0]?.title,data?.product[0]?.category,data?.product[0]?.brand,data?.product[0]?.collectionName],
        openGraph: {
          title: data?.product[0]?.metaTitle || "Lebrra | Online Shopping",
          description: data?.product[0]?.metaDesc || "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
          url: `https://lebrra.com/products/${pid}`,
          images: data?.product[0]?.images[0]?.url || [],
        },
        alternates: {
          canonical: `https://lebrra.com/products/${pid}`,
        },
        robots: {
          index: true,
          follow: true,
        },
        icons: {
          icon: "https://lebrra.com/favicon-32x32.png", // Default favicon
          apple: "https://lebrra.com/apple-touch-icon.png", // Apple Touch Icon
          shortcut: "https://lebrra.com/favicon.ico", // Shortcut Icon
        },
        other: {
          // Add custom meta tags here
          "title": data?.product[0]?.metaTitle || "Lebrra | Online Shopping"
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error.message);
  }

  // Fallback metadata
  return {
    title: "Lebrra | Online Shopping",
    description: "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
    keywords: ["Men's Loafers", "Premium Shoes", "Lebrra"],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://lebrra.com/collections/${pid}`,
    },
  };
}

const page = async ({ params }) => {
  const { pid } = await params;
  let product = null;
  let noPrdt = false;

  try {
    const response = await fetch(
      `${process.env.API_PORT}products/single-product?productHandle=${pid}`
    );
    const data = await response.json();
    if (data.success && data.product[0]) {
      product = data.product[0];
    } else {
      noPrdt = true;
    }
  } catch (error) {
    console.error("Error fetching product:", error.message);
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
          <Link href="/">
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
        <SingleProduct product={product} />
      )}
    </>
  );
};

export default page;
