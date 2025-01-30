import React, { useEffect, useState,useContext } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
// import {updateAAbandoned,createAnOrder } from "../../features/auth/authSlice";
import { SlCalender } from "react-icons/sl";
import { CiMail } from "react-icons/ci";
import styles from '../orders/orders.module.css'
import { GlobalContext } from "../../../GlobalContext";
import toast from "react-hot-toast";
import Link from "next/link";


const SingleAbandoned = ({getAbandonedId}) => {
const [user,setUser]=useState({})
const {setPrdtOpens}=useContext(GlobalContext)
  useEffect(()=>{
setUser(JSON.parse(localStorage.getItem("user")))
  },[])

const [firstname,setFirstname]=useState("")
const [lastname,setLastname]=useState("")
const [email,setEmail]=useState("")
const [phone,setPhone]=useState("")
const [mobile,setMobile]=useState("")
const [address,setAddress]=useState("")
const [city,setCity]=useState("")
const [state,setState]=useState("")
const [pincode,setPincode]=useState("")


  const [subTotal,setSubTotal]=useState(null)

  const [orderState,setorderState] = useState([])

  const getSingleOrder=async()=>{
    try {
      const response = await fetch(`/api/abandoned/single-abandoned?id=${getAbandonedId}`)
      const data =await response.json()
      if (response.ok) {
       setorderState(data)
      }
      else {
        console.log("Unable to fetch order")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  const createHistory=async(data)=>{
    try {
      const response = await fetch(`/api/order/set-history`,{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify(data)
      })
    }
    catch (err) {
      console.log(err)
    }
  }




  useEffect(() => {
    if(getAbandonedId!==""){
      getSingleOrder()
    }
  }, [getAbandonedId]);

  useEffect (()=> {
    let sum=0;
    for(let index=0; index < orderState?.orderItems?.length; index++){
        sum =sum+(Number(orderState?.orderItems[index]?.quantity) *orderState?.orderItems[index]?.price)
        setSubTotal(sum)
    }
},[orderState])
 

useEffect(()=>{
  setFirstname(orderState?.shippingInfo?.firstname)
  setLastname(orderState?.shippingInfo?.lastname)
  setEmail(orderState?.shippingInfo?.email)
  setPhone(orderState?.shippingInfo?.phone)
  setMobile(orderState?.shippingInfo?.mobile)
  setAddress(orderState?.shippingInfo?.address)
  setCity(orderState?.shippingInfo?.city)
  setState(orderState?.shippingInfo?.state)
  setPincode(orderState?.shippingInfo?.pincode)
},[orderState])

const updateMyOrder=async()=>{
  try {
    const response = await fetch(`/api/abandoned/update-abandoned?id=${orderState?._id}&token=${user?.token}`,{
      method:"PUT",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
        shippingInfo:{
          firstname:firstname,
          lastname:lastname,
          email:email,
          phone:phone,
          address:address,
          city:city,
          state:state,
          pincode:pincode
        },
        orderItems:orderState.orderItems,
    totalPrice:orderState.totalPrice,
    shippingCost:orderState.shippingCost,
    orderType:orderState.orderType,
    discount:orderState.discount,
    finalAmount:orderState.finalAmount,
    createdAt:orderState.createdAt,
    orderNumber:orderState?.orderNumber,
    tag:orderState?.tag,
    orderCalled:orderState?.orderCalled,
      })
    })
    if(response.ok){
        toast.success("Order Upadted")
        createHistory({name:user?.firstname,title:"Abandoned Updated",sku:"",productchange:`For #${orderState?.orderNumber}`,time:new Date()})
        setPrdtOpens(false)
    }
    else{
        toast.error("Unable to Update Abandoned")
    }
  }
  catch (err) {
    console.log(err)
  }

}




  const markConfirm=async()=>{
    try {
      const response = await fetch(`/api/abandoned/called-abandoned?id=${orderState?._id}&type=Called&token=${user?.token}`,{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
       toast.success("Aandoned Confirmed")
    createHistory({name:user?.firstname,title:"Abandoned Mark as Called",sku:"",productchange:`For #${orderState?.orderNumber}`,time:new Date()})

      }
      else {
        console.log("Unable to update orders")
      }
    }
    catch (err) {
      console.log(err)
    }
  }


  const notPicked=async()=>{
    try {
      const response = await fetch(`/api/abandoned/called-abandoned?id=${orderState?._id}&type=notpicked&token=${user?.token}`,{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
       toast.success("Aandoned Marked not Picked")
    createHistory({name:user?.firstname,title:"Abandoned Mark as Not Picked",sku:"",productchange:`For #${orderState?.orderNumber}`,time:new Date()})

      }
      else {
        console.log("Unable to update orders")
      }
    }
    catch (err) {
      console.log(err)
    }
  }


const deleteAbandoned=()=>{
  if (window.confirm("Do you want to Delete this Abandoned")) {
    const deletedAban=async()=>{
      try{
        const response=await fetch(`/api/abandoned/delete-abandoned?id=${item?._id}&token=${user?.token}`,{
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
      })
        const data=await response.json()
      if(data.status===200){
          createHistory({name:user?.firstname,title:"Abandoned Deleted",sku:"",productchange:`For #${orderState?.orderNumber}`,time:new Date()})
          toast.success("Abandoned Deleted Successfully")
          setPrdtOpens(false)
        }
        else{
          toast.error("Unable to Delete Product")
        }
      
      }catch(error){
        console.log(error)
      }
    }
    deletedAban()
  }
}

  const createOrderAban=()=>{
    if (window.confirm("Do you want to Create this Order")) {
      const createOrder=async()=>{
        try {
            const response = await fetch(`/api/order/create-order`,{
              method:"POST",
              headers: { "Content-Type": "application/json" },
              body:JSON.stringify({shippingInfo:orderState?.shippingInfo,
              paymentInfo:
                {
                  razorpayOrderId:"COD",
                  razorpayPaymentId:"COD"
                },
                orderItems:orderState?.orderItems,
                totalPrice:orderState?.totalPrice,
                shippingCost:orderState?.shippingCost,
                orderType:"COD",
                discount:orderState?.discount,
                finalAmount:orderState?.finalAmount,
                tag:orderState?.tag
              
            })
            })
            if(response.ok){
                toast.success("Order Created")
              createHistory({name:user?.firstname,title:"Order Created from Abandoned",sku:"",productchange:`For ${orderState?.shippingInfo?.firstname}, Amount:${orderState?.finalAmount}, orderType:COD Number:${orderState?.orderNumber}, Items:${orderState?.orderItems?.length}`,time:new Date()})
                setPrdtOpens(false)
                
            }
            else{
                toast.error("Unable to Create Order")
            }
          }
          catch (err) {
            console.log(err)
          }
       }
       createOrder()
  }}
  const modifyCloudinaryUrl = (url) => {
    const urlParts = url?.split('/upload/');
    return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
  };
  return (
    <div className={`${styles.singleOrder} ${styles.singleAban}`}>
      <p onClick={()=>setPrdtOpens(false)} className={styles.title} style={{display:'flex',margin:'10px 0'}}><IoMdArrowRoundBack style={{cursor:'pointer'}}/>Abandoneds</p>
      <div className={styles.orderHead}>
          <div className={styles.left}>
            <p className={styles.number}>
                #{orderState?.orderNumber}
            </p>
            <p className={`${styles.type} ${orderState?.orderType==="COD"?styles.cod:orderState?.orderType==="Cancelled"?styles.cancel:styles.paid}`} >{orderState?.orderType}</p>
            <p className={styles.date}><SlCalender className={styles.dateIcon}/>{new Date(orderState?.createdAt).toLocaleString('en-GB', { hour12: true })}</p>
          </div>
          <div className={styles.right}>
         
          <button className={styles.btn} onClick={createOrderAban}>Create Order</button>
            <button className={styles.btn}  onClick={markConfirm}>Called</button>
            <button className={styles.btn}  onClick={notPicked}>N.P</button>
            <button className={styles.btn}  onClick={updateMyOrder}>Update</button>
            <button className={styles.btn}  onClick={deleteAbandoned}>Delete</button>

          </div>
        </div>
      <div className={styles.orderDetail}>
        
       <div className={styles.leftSection}>
       <div className={styles.orderProducts}>
        {
          orderState?.orderItems?.map((item,index)=>{
            return( <div className={styles.prdt}>
          <div className={styles.left}>
          <Link href={`/lebrra-admin?prdt=${item?.product?._id}&pageName=products`}>
            <img src={modifyCloudinaryUrl(item?.product?.images[0]?.url)} alt="" />
            </Link>
            <div className={styles.details}>
              <p>{item?.product?.title}</p>
              <p><span>color:</span>{item?.color}</p>
              <p><span>size:</span>{item?.size}</p>
              <p><span>sku:</span>{item?.product?.sku}</p>
            </div>
          
    <p className={styles.price}>&#8377;{item?.price}</p>
    <p className={styles.qty}>{item?.quantity}</p>
    <p className={styles.total}>&#8377;{(item?.product?.price)*(item?.quantity)}</p>
    </div>
          </div>
            )
          })
        }
          

        </div>
        <div className={styles.paymentInfo}>
            <p className={styles.head}>Payment Summary</p>
          <div className={styles.payment}>
            <div className={styles.left}>
<p>Subtotal</p>
<p>Shipping</p>
<p>Discount</p>
<p>Total</p>
            </div>
            <div className={styles.center}>
              <p>{orderState?.orderItems?.length} Item</p>
              <p>{orderState?.orderType}</p>
              <p></p>
              <p></p>
            </div>
            <div className={styles.right}>
            <p>&#8377;{subTotal}</p>
              <p>&#8377;{orderState?.shippingCost}</p>
              <p>&#8377;{Math.floor(orderState?.discount)}</p>
              <p>&#8377;{subTotal+(orderState?.shippingCost)-(Math.floor(orderState?.discount))}</p>
            </div>
          </div>
        </div>
       </div>
       <div className={styles.rightSection}>
        <div className={styles.customer}>
        <p className={styles.rightHead}>Customer</p>
        <p className={styles.customerName}><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPgCd93aiNba8lHWJYHQ1C1YwBPwcH_NUmw&usqp=CAU" alt="" /><p>{orderState?.shippingInfo?.firstname} {orderState?.shippingInfo?.lastname}</p></p>

        </div>
        <hr style={{opacity:'0.2'}}/>
        <div className={styles.email}>
          <p style={{fontWeight:600,fontSize:'13px',marginBottom:'15px'}}>Contact Info</p>
          <p><CiMail className={styles.orderIcon}/>{orderState?.shippingInfo?.email}</p>
          <p>+91 {orderState?.shippingInfo?.phone}</p>

        </div>
        <hr style={{opacity:'0.2'}}/>

        <div className={styles.email}>
          <p style={{fontWeight:600,fontSize:'13px',marginBottom:'15px'}}>Shipping Address</p>
          <p><span>Firstname:</span><input type="text" placeholder="Firstname" value={firstname} onChange={(e)=>setFirstname(e.target.value)}/></p>
          <p><span>Lastname:</span><input type="text" placeholder="Lastname" value={lastname} onChange={(e)=>setLastname(e.target.value)}/></p>
          <p><span>Email:</span><input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/></p>
          <p><span>Address:</span><input type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}/></p>
          <p><span>City:</span><input type="text" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)}/></p>
          <p><span>Pincode:</span><input type="number" placeholder="Pincode" value={pincode} onChange={(e)=>setPincode(e.target.value)}/></p>
          <p><span>State:</span><input type="text" placeholder="State" value={state} onChange={(e)=>setState(e.target.value)}/></p>
          <p><span>Phone:</span><input type="number" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)}/></p>
          <p><span>Alternate:</span><input type="number" placeholder="Alternate" value={mobile} onChange={(e)=>setMobile(e.target.value)}/></p>
        </div>
       </div>
      </div>
      <div>
      </div>
      
    </div>
    
    
  );
};

export default SingleAbandoned;
