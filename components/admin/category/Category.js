import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../../GlobalContext'
import styles from './category.module.css'
import { IoMdClose } from 'react-icons/io'
import SingleCollection from './SingleCollection'
import { usePathname, useRouter } from 'next/navigation'
const Category = ({collections}) => {
    const {prdtOpens, setPrdtOpens } = useContext(GlobalContext)
    const pathname = usePathname();
              const router = useRouter()
        // const queryParams = new URLSearchParams(location.search);
          useEffect(()=>{
            const searchParams = new URLSearchParams();
            searchParams.set('pageName',"collection");
            router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
              },[])
    const modifyCloudinaryUrl = (url) => {
        const urlParts = url?.split('/upload/');
        return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
    };


    const [collectionId, setCollectionId] = useState("")
    // const [addPrdt,setAddPrdt]=useState(false)


    const closeCollection = () => {
        setCollectionId("")
        setPrdtOpens(false)
    }
    const openCollection = (val) => {
        setCollectionId(val)
        setPrdtOpens(true)
    }

    const newCollection = () => {
        setCollectionId("")
        setPrdtOpens(true)
    }


    return (
        <div className={styles.category}>
            <div className={styles.addprdt} style={{ display: prdtOpens ? "flex" : "none" }}>
                <IoMdClose className={styles.close} onClick={closeCollection} />
                <div className={styles.addprdtbody}>
                    <SingleCollection getCollectionId={collectionId} />
                </div>
            </div>
            <div className={styles.categoryHead}>
                <p>Collections</p>
                <button onClick={newCollection}>Create Collection</button>
            </div>
            <div className={styles.categoryBody}>
                {
                    collections && collections?.sort((a, b) => (a?.order ?? Infinity) - (b?.order ?? Infinity))?.map((item, index) => {
                        return <div className={styles.categoryCard} onClick={() => openCollection(item?._id)} key={index}>
                            <div className={styles.categoryImages}>
                                <img src={modifyCloudinaryUrl(item?.banner[0]?.url)} alt={item?.category} />
                                <img src={modifyCloudinaryUrl(item?.banner[item?.banner?.length - 1]?.url)} alt={item?.category} />

                            </div>
                            <p className={styles.categoryName}>{item?.category} / {item?.productCount}</p>
                        </div>
                    })
                }

            </div>
        </div>
    )
}

export default Category
