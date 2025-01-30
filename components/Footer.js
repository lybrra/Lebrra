import React, {useEffect, useState } from 'react'
import styles from './footer.module.css'
import Link from 'next/link'
import { FaFacebookSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";
import Image from 'next/image';
import logo from '../images/vlogo.png'
const Footer = () => {
    const [collections,setcollections]=useState([])
    useEffect(()=>{
      const fetchCollections=async()=>{
        try{
          const response=await fetch(`/api/collection/getallcollections`)
          const data=await response.json()
          if(response.ok){
            setcollections(data)
          }
          else{
            setcollections([])
          }
      
        }catch(err){
          console.log(err)
        }
      }
      fetchCollections()
      
    },[])
    
    
    return (
        <div className={styles.footer}>
           <div className={styles.topFooter}>
                <div className={styles.topLeft}>
                    <Image src={logo} alt="Lebrra Logo" width={1024} height={35}/>
                    <ul>
                        <Link href="/" ><li>Home</li></Link>
                        <Link href="/about"><li>About</li></Link>
                        {
            collections && collections?.map((item,index)=>{
              return <Link key={index} href={`/collections/${item?.handle}`}><li>{item?.category}</li></Link>
            })
          }
                    </ul>
                </div>
                <div className={styles.topRight}>
                    <p>Get your order details</p>
                    <div>
                        <input type="text" placeholder='Enter your Email'/>
                        <Link href="/track-order" ><button>Track</button></Link>
                    </div>
                </div>

           </div>
           <div className={styles.bottomFooter}>
           <div className={styles.bottomOne}>
<ul>
<Link href="/pages/contact"><li>Contact Us</li></Link>
<li>|</li>
    <Link href="/pages/terms-of-service"><li>Terms of Service</li></Link>
   <li>|</li>
    <Link href="/pages/privacy-policy"><li>Privacy Policy</li></Link>
    <li>|</li>
    <Link href="/pages/shipping-policy"><li>Shipping Policy</li></Link>
    <li>|</li>
    <Link href="/pages/refund-and-return-policy"><li>Exchange Policy</li></Link>
</ul>
<div></div>
           </div>
           <div className={styles.bottomTwo}>
<p>© 2025, Lebrra</p>
<ul>
<li><a href='https://www.facebook.com/Lebrrafashion' style={{textDecoration:"none"}}><FaFacebookSquare/></a></li>
    <li><a href='https://www.instagram.com/Lebrra_fashion/' style={{textDecoration:"none"}}><FaInstagramSquare/></a></li>
    <li><a href='https://wa.me/+919899202079?text=Hello there!' style={{textDecoration:"none"}}><FaWhatsappSquare/></a></li>
    <li><a href='tel:+919811363736' style={{textDecoration:"none"}}><FaSquarePhone/></a></li>
</ul>
           </div>
           </div>
        </div>
    )
}

export default Footer
