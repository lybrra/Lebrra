"use client"
import React from 'react'
import styles from '../src/app/page.module.css'
import Prdt4Grid from './Prdt4Grid'
import Link from 'next/link'
import Image from 'next/image'
const TrendingCol = ({name,collections,banner,prdts,color}) => {
  const modifyCloudinaryUrl = (url) => {
    const urlParts = url?.split('/upload/');
    return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
  };
  return (
    <div className={styles.trendingCollections}>
          <h1 style={{color:color}}>TRENDING {name}</h1>
          <div className={styles.collections}>
        
             <Link href={`/collections/${collections?.handle}`} >
            <div className={styles.collection} style={{border:`1px solid ${color}`}}>
              <Image src={modifyCloudinaryUrl(collections?.banner[0]?.url)} alt={collections?.title} width={550} height={250} style={{
                width: '100%',
                height:"auto",
                aspectRatio: '1/1',
                objectFit: 'cover', // Ensures the image fits nicely within the aspect ratio
              }}/>
          </div>
            </Link>
            
          </div>
          <div className={styles.trendingBanner}>
<Image src={banner} alt="Collection Banner" width={1200} height={230} style={{width:"100%",objectFit:"cover",height:"auto"}}/>
          </div>
          <Prdt4Grid prdts={prdts} color={color}/>
        </div>
  )
}

export default TrendingCol
