import React, { useEffect, useState } from "react";
import styles from "./banners.module.css";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

const Banners = () => {
  const [banners, setBanners] = useState([]); // List of banners fetched from the server
  const [images,setImages]=useState([])
  const [user, setUser] = useState(null); // User data fetched from localStorage
const [bannerId,setBannerId]=useState("")
  const pathname = usePathname();
  const router = useRouter();

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Update URL query params for 'pageName'
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.get("pageName")) {
      searchParams.set("pageName", "banners");
      router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
    }
  }, [pathname, router]);

  // Fetch banners from the API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/banner/get-banners`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBanners(data || []);
      } catch (error) {
        console.error("Error fetching banners:", error.message);
      }
    };
    fetchBanners();
  }, []);

  // Remove the image of a specific banner
  const handleImageRemove = (bannerId) => {
    setBannerId(bannerId)
    const updatedBanners = banners.map((banner) =>
      banner._id === bannerId ? { ...banner, images: [] } : banner
    );
    setBanners(updatedBanners);
  };

  // Handle image upload for a specific banner
  const handleImageUpload = (result, bannerId) => {
    const updatedBanners = banners.map((banner) =>
      banner._id === bannerId
        ? { ...banner, images: [{ url: result.info.secure_url, public_id: result.info.public_id }] }
        : banner
    );
    setBanners(updatedBanners);
    setImages([{ url: result.info.secure_url, public_id: result.info.public_id }])
  };

  // Save updated banners to the backend
  const saveBanners = async () => {
    if(bannerId!=="" && images!==null){
    try {
      const response = await fetch(`/api/banner/update-banners?id=${bannerId}&token=${user?.token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      });

      if (response.ok) {
        toast.success("Banners Updated");
        router.reload(); // Reload the page to fetch updated banners
      } else {
        toast.error("Failed to update banners");
      }
    } catch (error) {
      console.error("Error saving banners:", error);
    }
  }
  };

  return (
    <div className={styles.banners}>
      <div className={styles.bannerHead}>
        <p>Banners</p>
        <button onClick={saveBanners}>Save</button>
      </div>
      <div className={styles.bannersBody}>
        {banners.map((banner, index) => (
          <div className={styles.banner} key={banner._id}>
            {banner.images.length === 0 ? (
              <CldUploadWidget
                signatureEndpoint="/api/upload/upload-img"
                onSuccess={(result) => handleImageUpload(result, banner._id)}
              >
                {({ open }) => (
                  <button onClick={open} className={styles.uploadBtn}>
                    Upload Image {index + 1}
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <div className={styles.bannerPreview}>
                <IoMdClose
                  className={styles.closeIco}
                  onClick={() => handleImageRemove(banner._id)}
                />
                <Image
                  src={banner.images[0]?.url || "/placeholder.png"}
                  alt={`Banner ${index + 1}`}
                  width={400}
                  height={400}
                  style={{ height: "100%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;
