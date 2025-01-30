import React from "react";
import Link from "next/link";
import SearchProducts from "../../../components/SearchProducts";

// Function to generate dynamic metadata
export async function generateMetadata({searchParams }) {
  const search = searchParams?.search || "";

      return {
        title: search || "Lebrra | Online Shopping",
        description: search || "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
        keywords: ["Lebrra",search],
        openGraph: {
          title: search || "Lebrra | Online Shopping",
          description: search || "Lebrra is the best online shopping platform. Discover premium quality products, unbeatable prices, and fast delivery.",
          url: `https://lebrra.com/search`,
          images: [
            {
              url: "https://res.cloudinary.com/dqh6bd766/image/upload/c_limit,h_1000,f_auto,q_auto/v1730799285/zcs4bd74xuruedy7lnyt.jpg",
            },
          ],
        },
        alternates: {
          canonical: `https://lebrra.com/search`,
        },
        robots: {
          index: false,
          follow: false,
        },
        icons: {
          icon: "https://lebrra.com/favicon-32x32.png",
          apple: "https://lebrra.com/apple-touch-icon.png",
          shortcut: "https://lebrra.com/favicon.ico",
        },
      };
    }

// Page component
const Page = async ({searchParams }) => {
  const page = searchParams?.page || 1;
  const sort = searchParams?.sort || "";
  const color = searchParams?.color || "";
  const brand = searchParams?.brand || "";
  const size = searchParams?.size || "";
  const search = searchParams?.search || "";


  let prdtData = null;
  let noPrdt = false;

  try {
    const productUrl = new URL(`${process.env.API_PORT}products/search`);
    productUrl.searchParams.append("search", search);
    productUrl.searchParams.append("page", page);
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
      console.error("Error fetching products");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
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
        <SearchProducts data={prdtData} collectionName={search} />
      )}
    </>
  );
};

export default Page;
