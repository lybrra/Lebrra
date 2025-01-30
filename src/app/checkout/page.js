"use client"
import React, { useState,useEffect,useContext } from 'react'
import styles from './checkout.module.css'
import { IoMdClose } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { GlobalContext } from '../../../GlobalContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { debounce } from "lodash"; // For debouncing
const page = () => {
    const [openCheck,setOpenCheck]=useState(false)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [pincode, setPincode] = useState("")
    const [coupon, setCoupon] = useState("")
    const [couponAmount, setCouponAmount] = useState(null)
const [payMethod, setPayMethod] = useState("razorpay")
const [orderType, setOrderType] = useState("Prepaid")
    const [shippingCost, setShippingCost] = useState(0)
    function normalizePhoneNumber(phoneNumber) {
      let cleanNumber = phoneNumber.replace(/\D/g, '');
      if (cleanNumber.startsWith('91') && cleanNumber.length > 10) {
          cleanNumber = cleanNumber.substring(2);
      } else if (cleanNumber.startsWith('0') && cleanNumber.length > 10) {
          cleanNumber = cleanNumber.substring(1);
      }
      return cleanNumber;
    }
    
    const checkClose=()=>{
        setOpenCheck(false)
    }
    const checkOpen=()=>{
      if(firstname==="" || lastname==="" || email==="" || phone==="" || address==="" || city==="" || state==="" || pincode===""){
        toast.error("Please Fill All the Information")
      }
      else if(verified===false){
        toast.error("Please verify Phone Number")
      }
      else{
        setOpenCheck(true)
      }
    }
    const { myCarts, setMyCart } = useContext(GlobalContext);
    const [cartItems, setCartItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);


    const [totalAmount,setTotalAmount]=useState(null)
  useEffect (()=> {
    setCartItems(JSON.parse(localStorage.getItem("cartState")) || [])
    const orderItems = cartItems?.map(({ prdt, id, ...rest }) => rest);
    setOrderItems(orderItems)
},[])
useEffect(()=>{
  let sum=0;
    
  for(let index=0; index < cartItems?.length; index++){
      sum =sum+(Number(cartItems[index]?.quantity) *cartItems[index]?.price)
  }
  setTotalAmount(sum)
  const orderItems = cartItems?.map(({ prdt, id, ...rest }) => rest);
  setOrderItems(orderItems)
},[cartItems,myCarts])
useEffect (()=> {
    setCartItems(JSON.parse(localStorage.getItem("cartState")) || [])
},[myCarts])

const increaseQty = (item) => {

    const updatedCart = cartItems?.map((cartItem) => {
      if (
        cartItem.id === item.id && // Match by product ID
        cartItem.color === item.color && // Match by color
        cartItem.size === item.size // Match by size
      ) {
        // Find the stock for the matching variant
        const matchingVariant = cartItem.prdt.variants.find(
          (variant) =>
            variant.color === cartItem.color &&
            variant.size === cartItem.size
        );
  
        // Check if matchingVariant exists and if quantity is less than stock
        if (matchingVariant && cartItem.quantity < matchingVariant.quantity) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1, // Increase quantity
          };
        }
      }
      return cartItem;
    });
  
    setMyCart(updatedCart); // Update the cart state
    localStorage.setItem("cartState", JSON.stringify(updatedCart)); // Persist the updated cart
  };
  
  
  const decreaseQty = (item) => {
    const updatedCart = cartItems
      ?.map((cartItem) => {
        if (
          cartItem.id === item.id && // Match by product ID
          cartItem.color === item.color && // Match by color
          cartItem.size === item.size // Match by size
        ) {
          const newQuantity = cartItem.quantity - 1; // Decrease quantity by 1
          return newQuantity > 0
            ? { ...cartItem, quantity: newQuantity } // Update item with new quantity
            : null; // If quantity becomes 0, mark it for removal
        }
        return cartItem; // Leave other items unchanged
      })
      .filter((cartItem) => cartItem !== null); // Remove items marked as null
  
    setCartItems(updatedCart); // Update the cart state
    setMyCart(updatedCart); // Update global cart state
    localStorage.setItem("cartState", JSON.stringify(updatedCart)); // Persist updated cart to local storage
  };

  useEffect(()=>{
    localStorage.setItem("shippingInfo",JSON.stringify({
      firstname,
      lastname,
      email,
      phone:normalizePhoneNumber(phone),
      city,
      address,
      state,
      pincode
    }))

  },[firstname,lastname,phone,email,city,address,pincode,state])
  useEffect(()=>{
    const address = localStorage.getItem("shippingInfo");
    if (!address) {
      localStorage.setItem("shippingInfo", JSON.stringify([])); // Initialize as an empty array
    }
  },[])
  const [address1,setAddress1]=useState()
  useEffect(()=>{
    setAddress1(JSON.parse(localStorage.getItem("shippingInfo")))
  },[])
  useEffect(() => {
    if (!firstname && !lastname && !email && !address && !phone && !city && !state && !pincode) {
        setFirstname(address1?.firstname || "")
        setLastname(address1?.lastname || "")
        setEmail(address1?.email || "")
        setAddress(address1?.address || "")
        setCity(address1?.city || "")
        setState(address1?.state || "")
        setPincode(address1?.pincode || "")
    }
}, [address1, firstname, lastname, email, address, city, state, pincode])

useEffect(() => {
  setCouponAmount(totalAmount*0.05);
}, [totalAmount]);


const codClick = () => {
  setShippingCost(200)
  setOrderType("COD")
  setCouponAmount(0)
  setPayMethod("cod")
  toast.error("Oops, you are missing top deals by selecting COD")
}
const razorpayClick = () => {
  setShippingCost(0)
  setOrderType("Prepaid")
  setCouponAmount(totalAmount*0.05)
  setPayMethod("razorpay")
}


const finalAmount = shippingCost + totalAmount - couponAmount


const applyCoupon = async() => {
  try {
      const response = await fetch("/api/coupon/apply-coupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              name: coupon,
              totalAmount,
              customerType: "all", // replace as needed
              cartItemCount: cartItems?.length,
              customerEmail: email,
          }),
      });

      const data = await response.json();

      if (response.ok) {
          setCouponAmount(parseInt(data.discountAmount));
          if (data.discountType === "freeShip") {
              setShippingCost(0);
          }
          toast.success("Coupon Code Applied");
      } else {
          toast.error(data.message);
      }
  } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon.");
  }
};

const [paySpin,setPaySpin]=useState(false)

const completeOrder = () => {
  if (firstname === "" || lastname === "" || email === "" || phone === "" || address === "" || city === "" || state === "" || pincode === "") {
      toast.error("Please Fill All Information")
  }
  else {
      setPaySpin(true)
      localStorage.setItem("address", JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: email,
          address: address,
          phone: normalizePhoneNumber(phone),
          city: city,
          state: state,
          pincode: pincode,
      }))
      if (cartItems?.length >= 1) {
          setTimeout(() => {
              checkOutHandler()
          }, 300)
        //   window.fbq('track', 'InitiateCheckout', {
        //     content_ids:cartItems?.map((item) => item?.id),
        //     content_type: 'product',
        //     value:finalAmount,
        //     currency: 'INR'
        // });

        const addToCartEvent=async()=>{
          try{
            const response=await fetch(`/api/chart/post-event?event=Initiate Checkout`,{
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
  }
}


const createOrder = async (orderData) => {
  try {
    setPaySpin(true); // Assuming `setPaySpin` is a state setter for loading indicator
    const response = await fetch("/api/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      window.location.href = `/thankyou?orderNumber=${data.orderNumber}&firstname=${data.firstname}&amount=${data.amount}`;
      
    } else {
      alert(data.error || "Order creation failed. Please try again.");
    }
  } catch (error) {
    console.error("Error creating order:", error.message);

    alert(error.message || "Something went wrong. Please try again later.");
  } finally {
    // Ensure loading spinner is stopped after the process is complete
    setPaySpin(false);
  }
};


const loadScript=(src)=>{
  return new Promise((resolve)=>{
      const script=document.createElement("script")
      script.src=src
      script.onload=()=>{
          resolve(true)
      }
      script.onerror=()=>{
          resolve(false)
      }
      document.body.appendChild(script)
  })
}

const checkOutHandler1=async()=>{
  const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js")
  if(!res){
     alert("Razorpay SDK failed to load")
     return
  }
  const result=await fetch(`https://lebrra.com/api/phonepe?amount=${parseInt(finalAmount)}`,
    {
      method:"POST",
    }
  )
  const data=await result.json()
  if(!data){
     alert("Something went wrong")
     return
  }
 
  const {amount,id:order_id,currency}=data.order
  const options = {
     key: process.env.KEY_ID, // Enter the Key ID generated from the Dashboard
     amount: amount,
     currency: currency,
     name: "Lebrra",
     description: "Lebrra Payment",
     image:"https://res.cloudinary.com/dtifzt5oe/image/upload/v1725091537/u5f5likvzkphypymdtvc.png",
     order_id: order_id,
     handler: async function (response) {
      const data = {
        orderCreationId: order_id, 
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id, 
    };
      createOrder({ totalPrice: totalAmount, finalAmount: finalAmount, shippingCost: shippingCost, orderType: orderType, discount: couponAmount, orderItems: orderItems, paymentInfo: data, shippingInfo: {firstname,lastname,email,phone,address,city,state,pincode}, tag: "Lebrra", isPartial: false })
         
 
     },
     prefill: {
         name: "Lebrra",
         email: "lebrra@gmail.com",
         contact: "8920744425",
     },
     notes: {
         address: "Lebrra",
     },
     theme: {
         color: "#6A42C2",
     },
 };
 
 const paymentObject = new window.Razorpay(options);
 paymentObject.open();
 }

const checkOutHandler =() => {
  if (orderType === "COD") {
      const data = {
          orderCreationId: "COD", 
          razorpayPaymentId: "COD",
          razorpayOrderId: "COD", 
      };
      createOrder({ totalPrice: totalAmount, finalAmount: finalAmount, shippingCost: shippingCost, orderType: orderType, discount: couponAmount, orderItems: orderItems, paymentInfo: data, shippingInfo: JSON.parse(localStorage.getItem("address")), tag: "Lebrra", isPartial: false })
  }

  else {
      if (payMethod === "razorpay") {
          checkOutHandler1()
      }
    }
    }




    const modifyCloudinaryUrl = (url) => {
      const urlParts = url?.split('/upload/');
      return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
    };    

  const abandoneddata={totalPrice: totalAmount, finalAmount: finalAmount, shippingCost: shippingCost, orderType: orderType, discount: couponAmount, orderItems: orderItems, paymentInfo: {
    orderCreationId: "COD", // Set a placeholder value for order creation ID for COD orders
    razorpayPaymentId: `COD`, // Set a placeholder value for Razorpay payment ID for COD orders
    razorpayOrderId: "COD", // Set a placeholder value for Razorpay order ID for COD orders
}, shippingInfo:{firstname,lastname,email,phone,address,city,state,pincode}, tag: "Lebrra", isPartial: false }
const [hasAbandonedBeenCreated, setHasAbandonedBeenCreated] = useState(false);

const createAbandonedCart = async () => {
  try {
    const response = await fetch("/api/abandoned/create-abandoned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abandoneddata),
    });
    if (response.ok) {
      console.log("Abandoned cart created successfully");
    } else {
      console.error("Failed to create abandoned cart");
    }
  } catch (error) {
    console.error("Error creating abandoned cart:", error);
  }
};

const debouncedCreateAbandoned = debounce(() => {
  // Check if all fields are filled
  if (
    firstname !== "" &&
    lastname !== "" &&
    email !== "" &&
    phone?.length === 10 &&
    address !== "" &&
    city !== "" &&
    state !== "" &&
    pincode !== "" &&
    !hasAbandonedBeenCreated // Ensure it's only triggered once
  ) {
    if (cartItems?.length > 0) {
     createAbandonedCart()
     setHasAbandonedBeenCreated(true); // Mark as triggered

    }
  }
}, 3000);
useEffect(() => {
  debouncedCreateAbandoned();
  // Cleanup debounce on unmount
  return () => {
    debouncedCreateAbandoned.cancel();
  };
}, [firstname,lastname,email,phone,address,city,state,pincode]);
  

   
  return (
    <>
    {
        cartItems?.length>0?
        <div className={styles.checkout}>
        <div className={styles.overlay} style={{display:openCheck?"block":"none"}}></div>
        <div className={styles.paySpin} style={{display:paySpin?"flex":"none"}}>
          <img src="https://global.discourse-cdn.com/sitepoint/original/3X/e/3/e352b26bbfa8b233050087d6cb32667da3ff809c.gif" alt="" />
        </div>
      <div className={styles.checkoutLeft}>
        <p className={styles.checkoutHeads}>Checkout Information</p>
            <div className={styles.personalInfo}>
                <p>Personal Information</p>
                <div>
                    <input type="text" placeholder='First Name*' value={firstname} onChange={(e)=>setFirstname(e.target.value)}/>
                </div>
                <div>
                    <input type="text" placeholder='Last Name*' value={lastname} onChange={(e)=>setLastname(e.target.value)}/>
                </div>
                <div className={styles.otpInput}>
                    <input type="number" placeholder='Phone Number*' value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                </div>
            </div>
            <div className={styles.personalInfo}>
                <p>Delivery Information</p>
                <div>
                    <input type="email" placeholder='Email*' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div>
                    <input type="text" placeholder='Address*' value={address} onChange={(e)=>setAddress(e.target.value)}/>
                </div>
                <div>
                    <input type="text" placeholder='City*' value={city} onChange={(e)=>setCity(e.target.value)}/>
                </div>
                <div>
                <select name="state" placeholder="State*" value={state} onChange={(e)=>setState(e.target.value)}>
                        <option value="">State</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Orissa">Orissa</option>
                        <option value="Pondicherry">Pondicherry</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttaranchal">Uttaranchal</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                    </select>
                </div>
                <div>
                    <input type="number" placeholder='Pincode*' value={pincode} onChange={(e)=>setPincode(e.target.value)}/>
                </div>
            </div>
            <div className={styles.continue} onClick={checkOpen}><button>Continue</button></div>
      </div>
      <div className={styles.checkoutRight} style={{bottom:openCheck?0:"-100%"}}>
        <p className={styles.closeCheck} onClick={checkClose} style={{display:openCheck?"flex":"none"}}><IoMdClose/></p>
        <p className={styles.checkoutHeads}>Order Summary</p>
        {
            cartItems?.map((item,index)=>{
return  <div className={styles.checkoutItems} key={index}>
<div className={styles.checkoutItem}>
    <Image src={modifyCloudinaryUrl(item?.prdt?.images[0]?.url)} alt={item?.prdt?.title} width={500} height={100} style={{height:'100%'}}/>
    <div className={styles.checkoutItemInfo}>
        <p className={styles.prdtName}>
        {item?.prdt?.title}        
        </p>
        <p className={styles.variant}>
            <span>{item?.color}</span>
            <span>/</span>
            <span>{item?.size}</span>
        </p>
        <div>
        <div className={styles.qty}>
            <div>
            <span onClick={(e)=>decreaseQty(item)}>-</span>
            <span>{item?.quantity}</span>
            <span onClick={(e)=>increaseQty(item)}>+</span>
            </div>
        <p>Rs. {item?.price * item?.quantity}</p>
        </div>
        </div>
    </div>
</div>
</div>
            })
        }
        <div className={styles.coupon}>
          <p className={styles.paymentHead}>Apply Coupon</p>
          <div>
          <input type="text" placeholder='Enter Coupon Code' value={coupon} onChange={(e)=>setCoupon(e.target.value)}/>
          <button onClick={applyCoupon}>Apply</button>
          </div>
        </div>
       
        <div className={styles.paymentMethods}>
            <p className={styles.paymentHead}>Payment Options</p>
            <div className={`${styles.paymentOption} ${payMethod==="cod"?styles.active:""}`} onClick={codClick}>
                <div><img src="https://png.pngtree.com/png-clipart/20210530/original/pngtree-badge-of-cash-on-delivery-vector-illustration-png-image-png-image_6339704.png" alt="" />
                <p>Cash On Delivery</p></div>
                <p>Rs. {totalAmount}</p>
            </div>
            <div className={`${styles.paymentOption} ${payMethod==="razorpay"?styles.active:""}`} onClick={razorpayClick}>
                <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" alt="" />
                <p>Razorpay Online Payments</p>
                </div>
                <p>Rs. {totalAmount - totalAmount/10}</p>
            </div>
        </div>
        <div className={styles.checkoutTotal}>
            <ul>
                <li>Subtotal</li>
                <li>Shipping</li>
                <li>Discount</li>
                <li>Total</li>
            </ul>
            <ul>
                <li>Rs. {totalAmount}</li>
                <li>Rs. {shippingCost}</li>
                <li>-Rs. {couponAmount}</li>
                <li>Rs. {finalAmount}</li>
            </ul>
        </div>
        <div className={styles.address}>
            <p>{firstname} {lastname}</p>
            <p>{address} , {city}</p>
            <p>{state}, {pincode}</p>
            <p>{phone}</p>
            <p onClick={checkClose}><CiEdit/></p>
        </div>
        <div className={styles.checkoutBtn} style={{bottom:openCheck?0:"-100%"}}>
            <button onClick={completeOrder}>Checkout (Rs. {finalAmount})</button>
        </div>
      </div>
    </div>
    :
    <div style={{margin:"80px 1rem",display:"flex",justifyContent:"center",alignItems:"center",height:"80vh",width:"100%",flexDirection:"column",textAlign:"center"}}>
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="" style={{width:"200px",aspectRatio:'1/1',marginBottom:"20px"}}/>
        <p style={{color:"var(--primary-color)",fontWeight:'600',fontSize:"25px",marginBottom:"20px"}}>Nothing In Your Cart for Checkout</p>
        <Link href="/"><button style={{padding:"8px 20px",backgroundColor:"var(--primary-color)",color:"white",border:"none",letterSpacing:"1px",fontSize:"17px",fontWeight:"500",cursor:"pointer"}}>Let's Add Something</button></Link>
    </div>
    }
    </>
    
  )
}

export default page
