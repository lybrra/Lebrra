import React, { useContext, useEffect, useState } from 'react'
import styles from './coupon.module.css'
import toast from 'react-hot-toast'
import { GlobalContext } from '../../../GlobalContext'
const AddCoupon = ({couponId}) => {
    const [user,setUser]=useState("")
    const {setPrdtOpens}=useContext(GlobalContext)
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem("user")))
    },[])

    const [discountName,setDiscountName]=useState("")
    const [discountType,setDiscountType]=useState("order")
    const [expiry,setExpiry]=useState("")
    const [customerType,setCustomerType]=useState("all")
    const [discountAmount,setDiscountAmount]=useState("null")
    const [status,setStatus]=useState("draft")
    const [minItem,setMinItem]=useState(0)
    const [customerEmail,setCustomerEmail]=useState("")
    const [minNone,setMinNone]=useState("none")
    const [mailNone,setMailNone]=useState("none")
    const [priceNone,setPriceNone]=useState("block")
    const [myotp,setMyOtp]=useState('')

useEffect(()=>{
    if(couponId===""){
        setDiscountType("order")
        setDiscountName("")
        setExpiry("")
        setCustomerType("all")
        setDiscountAmount("null")
        setStatus("draft")
        setMinItem(0)
        setCustomerEmail("")
    }
    else{
        const getCoupon=async()=>{
            try{
                const response=await fetch(`/api/coupon/get-coupon?id=${couponId}`)
                const data=await response.json()
                if(response.ok){
                    setDiscountType(data.discounttype)
        setDiscountName(data.name)
        setExpiry(data.expiry)
        setCustomerType(data.customertype)
        setDiscountAmount(data.discount)
        setStatus(data.status)
        setMinItem(data.minItem)
        setCustomerEmail(data.cEmail)
                }
            }catch(err){
                console.log(err)
            }
        }
        getCoupon()
    }
},[couponId])


    
  
     useEffect(()=>{
      if(discountType==="buyX"){
        setMinNone("block")
        setPriceNone("block")
      }
      if(discountType==="freeShip"){
        setMinNone("none")
        setPriceNone("none")
      }
      if(discountType==="order"){
        setMinNone("none")
        setPriceNone("block")
      }
  
     },[discountType])
     useEffect(()=>{
      if(customerType==="all"){
        setMailNone("none")
      }
      if(customerType==="specific"){
        setMailNone("block")
      }
  
     },[customerType])

  
  const verifyOtp = async() => {
        if(couponId===""){
try{
const response=await fetch(`/api/coupon/create-coupon?token=${user?.token}`,{
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify({
        name: discountName,
        expiry: expiry,
        discount: discountAmount,
        discounttype: discountType,
        customertype: customerType,
        status: status,
        minItem: minItem,
        cEmail: customerEmail,
      })
})
if(response.ok){
    localStorage.removeItem('otp')
    toast.success('Coupon created successfully');

    const createHistory=async()=>{
        try{
          const response=await fetch("/api/history/create-history",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: user?.firstname,
                title: discountName,
                sku: discountAmount,
                productchange: 'Discount Created',
                time: new Date()
              }),
        })
        if(response.ok){
          setPrdtOpens(false)
        }
        
        }catch(error){
          console.log(error)
        }
        }
        createHistory()


}
}
catch(err){
    console.log(err)
}
        }
        else{
            try{
                const response=await fetch(`/api/coupon/update-coupon?id=${couponId}&token=${user?.token}`,{
                    method:"PUT",
                    headers:{"Content-type":"application/json"},
                    body:JSON.stringify({
                        name: discountName,
                        expiry: expiry,
                        discount: discountAmount,
                        discounttype: discountType,
                        customertype: customerType,
                        status: status,
                        minItem: minItem,
                        cEmail: customerEmail,
                      })
                })
                console.log(response)
                if(response.ok){
                    localStorage.removeItem('otp')
                    toast.success('Coupon Updated successfully');

                    const createHistory=async()=>{
                        try{
                          const response=await fetch("/api/history/create-history",{
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name: user?.firstname,
                                title: discountName,
                                sku: discountAmount,
                                productchange: 'Discount Updated',
                                time: new Date()
                              }),
                        })
                        if(response.ok){
                          setPrdtOpens(false)
                        }
                        
                        }catch(error){
                          console.log(error)
                        }
                        }
                        createHistory()
                
                
                }
                else{
                  toast.error("something went wrong")
                }
                }
                catch(err){
                    console.log(err)
                } 
        }
  };
  const formattedExpiry = expiry.split("T")[0];

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const isoDate = new Date(selectedDate).toISOString();
    setExpiry(isoDate);
  };
  
  
  return (
    <div className={styles.coupon}>
       <div className={styles.couponHead}>
        <p>Create Coupon</p>
        <div className={styles.right}>
        <button onClick={verifyOtp}>Verify</button>

        </div>

      </div>
      <div className={styles.couponMake}>
          <div className={styles.centerDiv}>
          <div className={styles.couponType}>
            <p>Select Coupon Type</p>
            <select name="" id="" value={discountType} onChange={(e)=>setDiscountType(e.target.value)}>
              <option value="order">Order Discount</option>
              <option value="buyX">Buy X Get Y</option>
              <option value="freeShip">Free Shipping</option>
            </select>
          </div>
          <div className={styles.name} style={{display:minNone}}>
            <p>Define X Value</p>
            <input type="number" placeholder='Min Items / Min Amount' value={minItem} onChange={(e)=>setMinItem(e.target.value)}/>
          </div>
          <div className={styles.name}>
            <p>Coupon Name</p>
            <input type="text" placeholder='Name' value={discountName} onChange={(e)=>setDiscountName(e.target.value)}/>
          </div>
          <div className={styles.expiry}>
            <p>Select Coupon Expiry</p>
            <input type="date" name="" id="" value={formattedExpiry} onChange={handleDateChange}/>
          </div>
          <div className={styles.couponStatus}>
            <p>What will be the status of this Coupon?</p>
            <select name="" id="" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
          <div className={styles.price} style={{display:priceNone}}>
            <p>Please Input Discount Amount</p>
            <p className={styles.alert}>For percent enter like 10%, for amount like 1999</p>
            <input type="text" placeholder='10% or 2499' value={discountAmount} onChange={(e)=>setDiscountAmount(e.target.value)}/>
          </div>
          <div className={styles.ctype}>
            <p>To whom do you want to give this coupon?</p>
            <select name="" id="" value={customerType} onChange={(e)=>setCustomerType(e.target.value)}>
              <option value="all">All Customers</option>
              <option value="specific">Specific Customer</option>
            </select>
          </div>
          <div className={styles.cmail} style={{display:mailNone}}>
            <p>Please Enter Customer Email</p>
            <input type="email" name="" id="" placeholder='xyz@gmail.com' value={customerEmail} onChange={(e)=>setCustomerEmail(e.target.value)}/>
          </div>
          <div className={styles.otp}>
            <p>Please Enter OTP</p>
            <input type="text" name="" id="" placeholder='OTP here' value={myotp} onChange={(e)=>setMyOtp(e.target.value)}/>
          </div>
          </div>
      </div>
    </div>
  )
}

export default AddCoupon
