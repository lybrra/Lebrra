"use client"
import React from 'react'
import styles from '../src/app/page.module.css'
import Link from 'next/link'
import Image from 'next/image'
const Prdt4Grid = ({prdts,color}) => {
  const modifyCloudinaryUrl = (url) => {
    const urlParts = url?.split('/upload/');
    return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
  };

  return (
    <div className={styles.productsGrid}>
                {
                  prdts?.map((item,index)=>{
                      return <Link href={`/products/${item?.handle}`} key={index} >
                      <div className={styles.prdt} style={{border:`1px solid ${color}`}}>
                      <Image
src={modifyCloudinaryUrl(item?.images[0]?.url || item?.images[1]?.url)}
alt={item?.title}
width={300} // Use fixed width for placeholder purposes
height={300} // Use fixed height for placeholder purposes
style={{
  width: '100%',
  height:"100%",
  aspectRatio:"1/1"
}} 
/>
                      <div className={styles.info}>
                        <p className={styles.productName}>{item?.title}</p>
                        <p className={styles.productPrice}><span>Rs. {item?.dashPrice}</span> <span>Rs. {item?.price}</span></p>
                        <button style={{backgroundColor:color}}>SHOP NOW</button>
                      </div>
                    </div>
                      </Link>
                  })
                }
              
            </div>
  )
}

export default Prdt4Grid
