"use client"
import React, { useEffect, useRef } from 'react'
import styles from '../src/app/thankyou/thank.module.css'
import Link from 'next/link'
import { useSearchParams } from "next/navigation"; // For client-side searchParams

const Thankyou = () => {

    const searchParams = useSearchParams(); // Get searchParams client-side
    const orderNumber=searchParams?.get("orderNumber") || ""
    const firstname = searchParams?.get("firstname") || "";
    const amount = searchParams?.get("amount") || 0;

  useEffect(()=>{
localStorage?.clear("cartState")
  },[orderNumber,firstname,amount])


const viewContentFired = useRef(false);

    useEffect(() => {
        if (orderNumber && !viewContentFired.current) {
           if(orderNumber!=="" && firstname!=="" && amount!==0){
            // window.fbq('track', 'Purchase', {
            //     content_name: 'Checkout',
            //     content_category: 'Page',
            //     content_ids: 'purchase',
            //     content_type: 'page',
            //     value: amount,
            //     currency: 'INR'
            // });
            const addToCartEvent=async()=>{
              try{
                const response=await fetch(`/api/chart/post-event?event=Purchase`,{
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
            viewContentFired.current = true; // Set the flag to true after firing the event
        }
    }, [orderNumber]);


  return (
    <div className={styles.thank}>
    <div className={styles.thankDiv}>
      <h1>Thank You {firstname} !</h1>
      <p>Thank you for choosing <span>Lebrra</span> website</p>
      <p>Your Order Number is: <span>{orderNumber}</span></p>
<p>Your Order for amount: <span>{amount}</span> is placed successfully</p>
      <p>You will recieved an email message sortly</p>
      <img src="https://i.pinimg.com/originals/d6/4f/60/d64f6038a5849a31279ce97358240d97.gif" alt="" />
      <h2>Check your Email</h2>
      <p>If you did't recieve any mail, contact <span>info@Lebrra.com</span></p>
      <Link href="/track-order"><button><span>Track Order</span></button></Link>
    </div>
  </div>
  )
}

export default Thankyou
