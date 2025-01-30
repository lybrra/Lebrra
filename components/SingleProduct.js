"use client"
import React,{ useEffect, useState,useContext, useRef } from 'react'
import styles from '../src/app/products/[pid]/singleProduct.module.css'
import { IoIosStar } from "react-icons/io";
import { CiRuler } from "react-icons/ci";
import { BiSolidOffer } from "react-icons/bi";
import toast from 'react-hot-toast';
import { GlobalContext } from "../GlobalContext";
import Image from 'next/image';
const SingleProduct = ({product}) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [color, setColor] = useState(product?.variants[0]?.color || "");
const [size, setSize] = useState("");
const [quantity, setQuantity] = useState(1);
const [mainImage, setMainImage] = useState(product?.images[0]?.url || null);
const [pquantity, setPquantity] = useState(null);
const {myCarts,setMyCart } = useContext(GlobalContext);
const [cart, setCart] = useState([]);
useEffect(()=>{
  setCart(JSON.parse(localStorage.getItem("cartState")) || []) 
  setColor((product?.variants[0]?.color || "").trim() )
  },[])
  useEffect(()=>{
setColor((product?.variants[0]?.color || "").trim())
  },[product])

useEffect(()=>{
setCart(JSON.parse(localStorage.getItem("cartState")) || [])
},[myCarts])


const viewContentFired = useRef(false);

    useEffect(() => {
        if (product?._id && !viewContentFired.current) {
            // window.fbq('track', 'ViewContent', {
            //     content_name: `${product?.title}`,
            //     content_category: product?.collectionName || 'Product',
            //     content_ids: `${product?._id}`,
            //     content_type: 'product',
            //     value: product?.price,
            //     currency: 'INR',
            // });
            const addToCartEvent=async()=>{
              try{
                const response=await fetch(`/api/chart/post-event?event=View Product`,{
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
            viewContentFired.current = true; // Set the flag to true after firing the event
        }
    }, [product?._id]);

    const changeMain=(value)=>{
        setMainImage(value)
    }
    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        if (product?.variants) {
          const firstAvailableVariant = product?.variants?.find(variant => variant.quantity > 0);
          if (firstAvailableVariant) {
            setSize((firstAvailableVariant.size).trim());
          }
        }
        
      }, [color,product]);
const [sold,setSold]=useState(false)
  useEffect(() => {
    if (product?.variants) {
      if(size && color){
        const isSoldOut = product?.variants?.find(variant => (variant.color).trim()===color && (variant.size).trim()===size && variant.quantity > 0);
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
  }, [color,size,product]);


      const findVariant = (color, size) => {
        return product?.variants.find(variant => variant.color === color && variant.size === size);
      };

const [existingCart,setExisitingCart]=useState(false)
const [existQty,setExistQty]=useState(null)
useEffect(() => {
    const existingItem = cart?.length>0 && cart?.find(
      (item) => item?.id === product._id && item?.color === color && item?.size === size
    );
    if (existingItem) {
      setExisitingCart(true);
      setExistQty(existingItem?.quantity);
    } else {
      setExisitingCart(false);
      setExistQty(null);
    }
  }, [myCarts, size, color, product]);
  useEffect(() => {
    const matchingVariant = findVariant(color, size);
    setPquantity(matchingVariant?.quantity)
    setQuantity(1)
  }, [size])

  const handleAddToCart = () => {
    if (size === "") {
      toast.error("Please Select Size");
    } else {
      if (existingCart) {
        // If product exists in cart, update the quantity
        const updatedCart = cart?.map((item) =>
          item.id === product._id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity } // Add new quantity to the existing one
            : item
        );
        setCart(updatedCart);
        setMyCart(updatedCart)
        localStorage.setItem("cartState", JSON.stringify(updatedCart));
        toast.success("Cart Quantity Updated");
      } else {
        // If product does not exist in cart, add it
        const updatedCart = [
          ...cart,
          { id: product._id, product:product?._id, color, size, quantity,price:product.price,sku:product?.sku,prdt:product },
        ];
        setCart(updatedCart);
        setMyCart(updatedCart)
        localStorage.setItem("cartState", JSON.stringify(updatedCart));
        toast.success("Product Added to Cart");
      }
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
    }
  };

  // Handle removing product from cart
  const handleRemoveFromCart = () => {
    const updatedCart = cart?.filter(
      (item) =>
        !(item.id === product._id && item.size === size && item.color === color)
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

      
  const modifyCloudinaryUrl = (url) => {
    const urlParts = url?.split('/upload/');
    return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
  };   

    return (
        <div className={styles.singleProduct}>
            <div className={styles.left}>
                <div className={styles.mainImage}>
                <Image src={modifyCloudinaryUrl(mainImage)} alt={product?.title} width={1100} height={500} style={{
  width: '100%',
  height:"auto",
  aspectRatio: '1/1',
  objectFit: 'cover', // Ensures the image fits nicely within the aspect ratio
}}/>

                </div>
                <div className={styles.thumbs}>
                    {
                        product?.images?.map((item,index)=>{
                            return <Image src={modifyCloudinaryUrl(item?.url)} alt={product?.title} key={index} width={550} height={250} style={{
                              width: '100%',
                              height:'auto',
                              aspectRatio: '1/1',
                              objectFit: 'cover', // Ensures the image fits nicely within the aspect ratio
                            }}
                            onClick={(e)=>changeMain(item?.url)}
                            />
                        })
                    }
                    
                   
                </div>
            </div>
            <div className={styles.right}>
                <h1>{product?.title}</h1>
                <p className={styles.productBrand}>{product?.collectionName}</p>
                <ul className={styles.stars}>
                    <li><IoIosStar /></li>
                    <li><IoIosStar /></li>
                    <li><IoIosStar /></li>
                    <li><IoIosStar /></li>
                    <li><IoIosStar /></li>
                </ul>
                <div className={styles.prices}>
                    <p>Rs. {product?.price}</p>
                    <p>Rs. {product?.dashPrice}</p>
                </div>
                <p className={styles.color}>Color: {product?.variants[0]?.color}</p>
                {
      existingCart?
      <p style={{marginBottom:'15px',fontWeight:500,letterSpacing:"1px",color:"red"}}>Already In Cart</p>
      :""
    }
                <div className={styles.sizeOptions}>
                    <select name="" id="" value={size} onChange={(e)=>setSize((e.target.value).trim())}>
                        {
                            product?.variants?.map((item,index)=>{
                            return <option style={{display:item?.quantity>0?"block":"none"}} value={item?.size} key={index}>{item?.size}</option>
                            })
                        }
                        
                       
                    </select>
                    <select value={quantity} onChange={(e)=>setQuantity(e.target.value)}>
      <option value="">Qty</option>
      {Array.from({ length: pquantity }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>

    {
                            sold && (existingCart && existQty >= (pquantity || 0))?
                          <button onClick={handleRemoveFromCart}>Remove From Cart</button>
                          :sold && !(existingCart && existQty >= (pquantity || 0))?
                          <button style={{backgroundColor:"grey",border:'1px solid grey'}} disabled={true}>SOLD OUT</button>
                          :!sold && (existingCart && existQty >= (pquantity || 0))?
                          <button onClick={handleRemoveFromCart}>Remove From Cart</button>
:!sold && !(existingCart && existQty >= (pquantity || 0))?
<button onClick={handleAddToCart}>Add to Cart</button>
:
""

                            
                          }
    
    
    {/* {
  existingCart && existQty >= (pquantity || 0) ? (
    <button onClick={handleRemoveFromCart}>Remove From Cart</button>
  ) : (
    <button onClick={handleAddToCart}>Add to Cart</button>
  )
} */}
                </div>
                <div className={styles.offers}>
                <p><span><CiRuler /></span> <span>Size Chart</span></p>
                    <p><span><BiSolidOffer /></span><span>Use SAVE5 to get 5% Instant Discount</span></p>
                    <p><span><BiSolidOffer /></span><span>Flat 10% Discount on Prepaid Orders</span></p>
                    <p><span><BiSolidOffer /></span><span>Free Shipping on Prepaid Orders</span></p>
                </div>
                <div className={styles.description}>
                    <h3>Product Description:-</h3>
                    <div className={isExpanded ? styles.expanded : styles.truncated}>
                    <p dangerouslySetInnerHTML={{ __html: product?.description }} />
                    </div>
                    
            <p className={styles.readMoreButton} onClick={toggleReadMore}>
                {isExpanded ? "Read Less" : "Read More"}
            </p>
                </div>
            </div>
        </div>
    )
}

export default SingleProduct
