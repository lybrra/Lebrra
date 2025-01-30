import React, { useContext, useEffect,useState } from 'react'
import styles from './coupon.module.css'
import AddCoupon from './AddCoupon'
import { GlobalContext } from '../../../GlobalContext'
import { IoMdClose } from 'react-icons/io'
import { usePathname, useRouter } from 'next/navigation'
const Coupons = () => {
  const [couponState,setcouponState]=useState([])
  const {prdtOpens,setPrdtOpens}=useContext(GlobalContext)
  const getCoupons=async()=>{
try{
const response=await fetch("/api/coupon/get-coupons")
const data=await response.json()
if(response.ok){
  setcouponState(data)
}
else{
  console.log("Unable to fetch coupons")
}
}
catch(err){
  console.log(err)
}
  }
  const pathname = usePathname();
            const router = useRouter()
      // const queryParams = new URLSearchParams(location.search);
        useEffect(()=>{
          const searchParams = new URLSearchParams();
          searchParams.set('pageName',"coupon");
          router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
            },[])
  useEffect(()=>{
    if(prdtOpens===false){
      getCoupons()

    }
  },[prdtOpens])


    const [couponId, setcouponId] = useState("")

  const closeCoupon = () => {
    setcouponId("")
    setPrdtOpens(false)
}
const openCoupon = (val) => {
  setcouponId(val)
    setPrdtOpens(true)
}

const newCoupon = () => {
  setcouponId("")
    setPrdtOpens(true)
}


  return (
    <div className={styles.coupon}>
      <div className={styles.addprdt} style={{ display: prdtOpens ? "flex" : "none" }}>
                <IoMdClose className={styles.close} onClick={closeCoupon} />
                <div className={styles.addprdtbody}>
                    <AddCoupon couponId={couponId} />
                </div>
            </div>
      <div className={styles.couponHead}>
        <p>Coupons</p>
        <button onClick={newCoupon}>Add Coupon</button>
      </div>
      <div className={styles.couponList}>
      {
          couponState?.slice()?.reverse()?.map((item,index)=>{
            return(
              <div className={styles.couponCard} onClick={()=>openCoupon(item?._id)} key={index}>
                  <div className={styles.left}>
                    {
                    item?.discount?.endsWith("%")?<p className={styles.amount} >{item?.discount}</p> :<p className={styles.amount}>&#8377; {item?.discount}</p>
                    }
                          
                          <p>OFF</p>
  
                  </div>
                  <div className={styles.right}>
                      <p className={styles.name}>{item?.name}</p>
                      <p className={styles.date}>{new Date(item?.expiry).toLocaleDateString('en-GB')}</p>
                      {
                        item?.discounttype==="order"?<p className={styles.type}>Order Discount</p>:
                        item?.discounttype==="buyX"?<p className={styles.type}>Buy X get Y</p>:
                        <p className={styles.type}>Free Shipping</p>
                      }
                      {
                        item?.customertype==="all"?<p className={styles.type}>All Customers</p>:
                        <p className={styles.type}>{item?.cEmail}</p>
                      }
                      <p className={styles.status}>{item?.status}</p>
                  </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Coupons
