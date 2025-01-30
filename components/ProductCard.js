"use client"
import React,{useEffect,useState,useContext} from 'react'
import styles from "../src/app/collections/[cid]/collections.module.css";
import Link from 'next/link';
import Image from 'next/image';
import { GlobalContext } from "../GlobalContext";
import toast from 'react-hot-toast';

const ProductCard = ({item}) => {
    const [cartSize,setCartSize]=useState("")
    const [cartColor,setCartColor]=useState(item?.variants[0]?.color || "")
    const {myCarts,setMyCart } = useContext(GlobalContext);
    const [alreadyAdded, setAlreadyAdded] =useState(false)
    const [sold,setSold]=useState(false)
    useEffect(()=>{
setCartColor((item?.variants[0]?.color || "").trim())
    },[item])
  const [cart, setCart] = useState([]);
  useEffect(() => {
    if (item?.variants) {
      const firstAvailableVariant = item?.variants?.find(variant => variant.quantity > 0);
      if (firstAvailableVariant) {
        setCartSize((firstAvailableVariant.size).trim());

      }
    }
  }, [cartColor,item]);
  useEffect(() => {
    if (item?.variants) {
      if(cartSize && cartColor){
        const isSoldOut = item?.variants?.find(variant => (variant.color).trim()===cartColor.trim() && (variant.size).trim()===cartSize.trim() && variant.quantity > 0);
      if (isSoldOut) {
        setSold(false)
      }
      else{
        setSold(true)

      }

      }
      else{
        setSold(true)
      }
      
    }
  }, [cartColor,cartSize,item]);


  useEffect(()=>{
    setCart(JSON.parse(localStorage.getItem("cartState")) || [])
    },[])
  useEffect(()=>{
  setCart(JSON.parse(localStorage.getItem("cartState")) || [])
  },[myCarts])
  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cartState")) || [];
    const updatedCart = [...existingCart, {id:item?._id,color:cartColor,size:cartSize,quantity:1,product:item?._id,price:item?.price,sku:item?.sku,prdt:item}];
    localStorage.setItem("cartState", JSON.stringify(updatedCart));
    setMyCart(updatedCart)
    setCart(updatedCart)
    toast.success("Product Added to Cart")
  //   window.fbq('track', 'AddToCart', {
  //     content_name:`${item?.title}`,
  //     content_category: 'Product',
  //     content_ids:`${item?._id}`,
  //     content_type: 'product',
  //     value:item?.price,
  //     currency: 'INR'
  // });

  const addToCartEvent=async()=>{
    try{
      const response=await fetch(`/api/chart/post-event?event=Add To Cart`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        }
      })

    }catch(err){
      console.log(err)
    }
  }
  addToCartEvent()
  };

  const handleRemoveFromCart = () => {
    const updatedCart = cart?.filter(
      (items) =>
        !(items.id === item._id && (items.size).trim() === cartSize.trim() && (items.color).trim() === cartColor.trim())
    );
    setCart(updatedCart);
    const addToCartEvent=async()=>{
      try{
        const response=await fetch(`/api/chart/post-event?event=Remove From Cart`,{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          }
        })
  
      }catch(err){
        console.log(err)
      }
    }
    addToCartEvent()
    setMyCart(updatedCart)
    localStorage.setItem("cartState", JSON.stringify(updatedCart));
    toast.success("Removed from Cart");
  };

  useEffect(() => {
    if (!cartColor || !cartSize) {
      // If color or size is not selected, set alreadyAdded to false
      setAlreadyAdded(false);
      return;
    }
  
    const matchingCartItem = cart?.find(items => {
      return items?.id === item?._id && (items?.color).trim() === cartColor.trim() && (items?.size).trim() === cartSize.trim();
    });
    if (matchingCartItem) {
      // If a matching cart item is found, set alreadyAdded to true
      setAlreadyAdded(true);
    } else {
      // If no matching cart item is found, set alreadyAdded to false
      setAlreadyAdded(false);
    }
  }, [cartColor, cartSize, item,cart,myCarts]);

  const modifyCloudinaryUrl = (url) => {
    const urlParts = url?.split('/upload/');
    return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
  };
  return (
    <div className={styles.collectionPrdt}>
                    {/* img src={} alt="" className={styles.collectionImage} fill/> */}
                    {
                        alreadyAdded?
                        <p className={styles.alreadyAdded}>In Cart</p>
                        :
                        ""
                    }
                    
                    <Link href={`/products/${item?.handle}`}>
                    <Image
src={modifyCloudinaryUrl(item?.images[0]?.url || item?.images[1]?.url)}
alt={item?.title}
className={styles.collectionImage}
width={1024} // Use fixed width for placeholder purposes
height={270} // Use fixed height for placeholder purposes
style={{
  width: '100%',
  height:"auto",
  aspectRatio: '1/1',
  objectFit: 'contain', // Ensures the image fits nicely within the aspect ratio
}}
/></Link>
                    
                  <div className={styles.prdtInfo}>
                      <p className={styles.prdtName}>{item?.title}</p>
                      <p className={styles.prdtSku}>{item?.sku}</p>

                      <ul>
                      {item?.variants
.map((variant, index) => (
  <li
    key={index}
    style={{
      display:variant.quantity === 0 ? "none" : "block",
      textDecorationThickness: variant.quantity === 0 ? '1px' : 'auto',
      pointerEvents: variant.quantity === 0 ? 'none' : 'auto', // Disable pointer events if quantity is 0
      color:cartSize.trim()===(variant?.size).trim()?"var(--primary-color)":"black",border:cartSize.trim()===(variant?.size).trim()?"1px solid var(--primary-color)":"1px solid rgb(202, 202, 202)"
    }}
    onClick={(e)=>setCartSize((variant?.size).trim())}
  >
    {variant.size}
  </li>
))}
                      </ul>
                      <div className={styles.prdtPrices}>
                          <p>Rs. {item?.price}</p>
                          {
                            sold && alreadyAdded?
                          <button onClick={handleRemoveFromCart}>Remove From Cart</button>
                          :sold && !alreadyAdded?
                          <button style={{backgroundColor:"grey",border:'1px solid grey'}} disabled={true}>SOLD OUT</button>
                          :!sold && alreadyAdded?
                          <button onClick={handleRemoveFromCart}>Remove From Cart</button>
:!sold && !alreadyAdded?
<button onClick={addToCart}>Add to Cart</button>
:
""

                            
                          }
                      </div>
                  </div>
              </div>
  )
}

export default ProductCard
