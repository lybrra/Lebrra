import React, { useEffect, useState,useRef,useContext } from "react";
import { IoMdArrowRoundBack, IoMdClose,IoMdCopy,IoMdPrint } from "react-icons/io";
import generatePDF from 'react-to-pdf';
import { SlCalender } from "react-icons/sl";
import { CiMenuKebab , CiDiscount1,CiMail,CiPhone,CiEdit,CiReceipt} from "react-icons/ci";
import styles from  './orders.module.css'
import toast from "react-hot-toast";
import { GlobalContext } from '../../../GlobalContext';
import Link from "next/link";

const AddOrder = ({getOrderId}) => {
  const {seteditOrderOpen} = useContext(GlobalContext);
  const [open, setOpen] =useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [user,setUser]=useState({})

  useEffect(()=>{
setUser(JSON.parse(localStorage.getItem("user")))
  },[])
  const [orderState,setOrderState] = useState([])

const getSingleOrder=async()=>{
  try {
    const response = await fetch(`/api/order/single-order?id=${getOrderId}`)
    const data =await response.json()
    if (response.ok) {
     setOrderState(data)
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
  const [state, setState] =useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };
  const targetRef = useRef();

  const [currentOrderState, setCurrentOrderState] = useState(null); // Add state to track the current order

  const pdfDownload = async () => {
    const splitOrders = splitOrder(orderState); // Split orders based on your logic
  
    // Loop through each split order
    for (let i = 0; i < splitOrders.length; i++) {
      const splitOrder = splitOrders[i];
  
      // Update the current order state to render correct packing slip
      setCurrentOrderState(splitOrder);
  
      // Wait for the state to update and the DOM to re-render
      await new Promise(resolve => setTimeout(resolve, 500));  // Small delay to ensure the DOM updates
  
      // Generate the PDF for the current order
      generatePDF(targetRef, { filename: `Lebrra_order_${splitOrder.orderNumber}_${i + 1}.pdf` });
  
      // Dispatch history actions for each split order
      createHistory({
        orderId: splitOrder?._id,
        name: user?.firstname,
        time: new Date(),
        message: `Packing Slip Downloaded by ${user?.firstname}`
      })
      try{
        const response=await fetch("/api/history/create-history",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user?.firstname,
            title: splitOrder?.orderNumber,
            sku: splitOrder?.orderNumber,
            productchange: "Print Packing Slip",
            time: new Date()
          }),
      })
      }catch(error){
        console.log(error)
      }
      }
  };
  const [subTotal,setSubTotal]=useState(null)
  useEffect(() => {
    getSingleOrder()
  }, [getOrderId]);

  const cancelClick = async() => {
    if(orderState?.orderType===("COD")||orderState?.orderType===("Prepaid")){
      if (window.confirm("Do you want to cancel?")) {
        try {
          const response = await fetch(`/api/order/cancel-order?id=${orderState?._id}&token=${user?.token}`,{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
          })
          if (response.ok) {
           toast.success("Order Cancelled")
        createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Cancelled by ${user?.firstname}`})
        getSingleOrder()


          }
          else {
            console.log("Unable to update orders")
          }
        }
        catch (err) {
          console.log(err)
        }

  } 
    }
    else{
      if (window.confirm("Do you want to Retrieve?")) {
        try {
          const response = await fetch(`/api/order/retrieve-order?id=${orderState?._id}&token=${user?.token}`,{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
          })
          if (response.ok) {
           toast.success("Order Retrieved")
        createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Retrieved by ${user?.firstname}`})
        getSingleOrder()

          }
          else {
            console.log("Unable to update orders")
          }
        }
        catch (err) {
          console.log(err)
        }

  } 
    }  
  };
  const markReturn = async() => {
    if (window.confirm("Do you want to mark this order as Returned?")) {
      try {
        const response = await fetch(`/api/order/return-order?id=${orderState?._id}&token=${user?.token}`,{
          method:"PUT",
          headers: { "Content-Type": "application/json" },
        })
        if (response.ok) {
         toast.success("Order Returned")
      createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Mark as Returned by ${user?.firstname}`})
      getSingleOrder()


        }
        else {
          console.log("Unable to update order")
        }
      }
      catch (err) {
        console.log(err)
      }


  }
       
  };
  const markPaid =async () => {
    if(orderState?.orderType==="COD"){
      if (window.confirm("Do you want to make Prepaid?")) {
        try {
          const response = await fetch(`/api/order/prepaid-order?id=${orderState?._id}&token=${user?.token}`,{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
          })
          if (response.ok) {
           toast.success("Order Marked as Paid")
           createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Mark as Paid by ${user?.firstname}`})
           getSingleOrder()
          }
          else {
            console.log("Unable to update order")
          }
        }
        catch (err) {
          console.log(err)
        }
       

  } 
    }
    if(orderState?.orderType==="Prepaid"){
      if (window.confirm("Do you want to make COD?")) {

        try {
          const response = await fetch(`/api/order/cod-order?id=${orderState?._id}&token=${user?.token}`,{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
          })
          if (response.ok) {
           toast.success("Order Marked as COD")
           createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Mark as COD by ${user?.firstname}`})
           getSingleOrder()
          }
          else {
            console.log("Unable to update order")
          }
        }
        catch (err) {
          console.log(err)
        }
       

  } 
    }
    
    
    
  };


  const markDelivered=async()=>{
    if (window.confirm("Do you want to mark this order as Delivered?")) {
      try {
        const response = await fetch(`/api/order/send-delivery`,{
          method:"PUT",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify({name:`${orderState?.shippingInfo?.firstname}`,ordernumber:`${orderState?.orderNumber}`,email:`${orderState?.shippingInfo?.email}`,orderId:orderState?._id})
        })
        if(response.ok){
          toast.success("Delivery Details Sended")
      createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Mark as Delivered by ${user?.firstname}`})

        }
      }
      catch (err) {
        console.log(err)
      }


  }
}

  const markConfirm=async()=>{
    try {
      const response = await fetch(`/api/order/confirm-order?id=${orderState?._id}&token=${user?.token}`,{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
       toast.success("Order Confirmed")
    createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Confirmed by ${user?.firstname}`})

      }
      else {
        console.log("Unable to update orders")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
const [tracknumber,setTracknumber]=useState("")
const [tracklink,setTracklink]=useState("https://www.dtdc.in/tracking.asp")
const [trackpartner,setTrackpartner]=useState("DTDC")

  useEffect (()=> {
    let sum=0;
    for(let index=0; index < orderState?.orderItems?.length; index++){
        sum =sum+(Number(orderState?.orderItems[index]?.quantity) *orderState?.orderItems[index]?.price)
        setSubTotal(sum)
    }
},[orderState])
 
  const timestamp = orderState?.createdAt; 

  const date = new Date(timestamp);

  const formattedDate = date.toLocaleString(undefined, {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
  const [orderState1,setOrderState1]=useState([])
    // Example usage:
      // Log the email count to the console
      const [totalOrders,setTotalOrders]=useState(1)
  useEffect(() => {
    if(orderState?.shippingInfo?.email!=="" || orderState?.shippingInfo?.email!==undefined){
      const fetchOrdersByEmail = async () => {
        try {
          const response = await fetch(`/api/order/get-orders?email=${orderState?.shippingInfo?.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          // Check if the response is OK (status 200-299)
          if (!response.ok) {
            console.error("API Error:", response.statusText);
            const errorText = await response.text(); // Attempt to read response as text
            throw new Error(`Error ${response.status}: ${errorText || "Something went wrong"}`);
          }
      
          // Ensure the response is not empty
          const text = await response.text();
          if (!text) {
            throw new Error("Empty response from the server");
          }
      
          // Parse the response as JSON
          const data = JSON.parse(text);
      
          // Check for success in the response
          if (data.success) {
            setOrderState1(data.orders)
            setTotalOrders(data.orders.length)
            return data.orders;
          } else {
            throw new Error(data.message || "No orders found.");
          }
        } catch (error) {
          console.error("Fetch error:", error.message);
        }
      };
      fetchOrdersByEmail()
    }
   
  }, [orderState]);
const [msg,setMsg]=useState("")
  const messagePost=async()=>{
    if(msg===""){
      toast.error("Please Enter the Message")
    }
    else{
      try {
        const response = await fetch(`/api/order/set-msg`,{
          method:"PUT",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify({orderId:orderState?._id,name:user?.firstname,message:msg,time:(new Date())})
        })
        if(response.ok){
          toast.success("Message Created")
        }
      }
      catch (err) {
        console.log(err)
      }
      setTimeout(()=>{
        setMsg("")
      },1000)
    }
  }
const handleClose1=async()=>{
  if(tracknumber===""){
    toast.error("Please Enter Tracking Number")
  }
  try {
    const response = await fetch(`/api/order/send-tracking`,{
      method:"PUT",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({name:`${orderState?.shippingInfo?.firstname}`,ordernumber:`${orderState?.orderNumber}`,partner:`${trackpartner}`,link:` TrackingId: ${ tracknumber}, Tracking Link: ${ tracklink} `,email:`${orderState?.shippingInfo?.email}`,orderId:orderState?._id})
    })
    if(response.ok){
      toast.success("Tracking Sended")
      createHistory({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Tracking Details TrackingId: ${ tracknumber}, Tracking Link: ${ tracklink} Send by ${user?.firstname}`})
      setOpen(false);
    }
  }
  catch (err) {
    console.log(err)
  }
}

const setTrackpartner1=(e)=>{
  setTrackpartner(e.target.value)

  if(e.target.value==="Online Express"){
    setTracklink("https://onlinexpress.co.in")

  }
  else if(e.target.value==="DTDC"){
    setTracklink("https://www.dtdc.in/tracking.asp")

  }
  else if(e.target.value==="Ecom"){
    setTracklink("https://www.ecomexpress.in/tracking")

  }
  else if(e.target.value==="Delivery"){
    setTracklink("https://www.delhivery.com/tracking")

  }
  else{
    setTracklink("https://www.shreemaruti.com/track-your-shipment")

  }


}
let trackingId = '';
    let trackingLink = '';

    // Ensure the trackingInfo and link exist and is a string
      if (orderState?.trackingInfo?.link && typeof orderState.trackingInfo.link === 'string') {
        // Split the string by commas to separate different parts
        const parts = orderState.trackingInfo.link.split(',');
        if (parts.length > 0) {
            // Attempt to match and extract the desired parts
            trackingId = parts.find(part => part.trim().startsWith('TrackingId'))?.trim();
            trackingLink = parts.find(part => part.trim().startsWith('Tracking Link'))?.trim();
        }
    }

const [showOrderss,setShowOrderss]=useState("none")
const showOrders=()=>{
  if(showOrderss==="none"){
    setShowOrderss("block")
  }else{
    setShowOrderss("none")
  }
}

const modifyCloudinaryUrl = (url) => {
  const urlParts = url?.split('/upload/');
  return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
};


const splitOrder = (order) => {
  const maxFinalAmount = 20000; // Split if final amount exceeds this value
  let currentSubtotal = 0;
  let currentOrderItems = [];
  const result = [];

  const totalOrderSubtotal = order?.orderItems?.reduce((acc, item) => acc + (item?.price * item?.quantity), 0);

  // Base order number (e.g., "VM1291")
  const baseOrderNumber = order?.orderNumber;

  order?.orderItems?.forEach((item, index) => {
    const itemTotalPrice = item?.price * item?.quantity;
    const provisionalFinalAmount = currentSubtotal 
                                  + itemTotalPrice 
                                  - (order?.discount * (currentSubtotal + itemTotalPrice) / totalOrderSubtotal)
                                  + (result.length === 0 ? order?.shippingCost : 0);

    if (provisionalFinalAmount > maxFinalAmount) {
      // Generate order number with suffix (e.g., "VM1291A", "VM1291B")
      const suffix = String.fromCharCode(65 + result.length); // 'A' for first, 'B' for second, etc.

      result.push({
        ...order,
        orderNumber: `${baseOrderNumber}${suffix}`, // Add suffix to order number
        orderItems: [...currentOrderItems],
        subtotal: currentSubtotal,
        finalAmount: currentSubtotal 
                     - (order?.discount * currentSubtotal / totalOrderSubtotal)
                     + (result.length === 0 ? order?.shippingCost : 0), // Shipping only for first order
      });

      currentOrderItems = [];
      currentSubtotal = 0;
    }

    currentOrderItems.push(item);
    currentSubtotal += itemTotalPrice;

    // Add last order
    if (index === order?.orderItems?.length - 1) {
      const suffix = String.fromCharCode(65 + result.length); // 'A' for first, 'B' for second, etc.

      result.push({
        ...order,
        orderNumber: `${baseOrderNumber}${suffix}`, // Add suffix to order number
        orderItems: [...currentOrderItems],
        subtotal: currentSubtotal,
        finalAmount: currentSubtotal 
                     - (order?.discount * currentSubtotal / totalOrderSubtotal)
                     + (result.length === 0 ? order?.shippingCost : 0),
      });
    }
  });

  return result;
};



const [order,setOrder]=useState(null)
useEffect(()=>{
  setOrder(orderState)
},[orderState])



  return (
    <div className={styles.singleOrder}>
      <p  className={styles.title} style={{display:'flex',margin:'10px 0'}}><IoMdArrowRoundBack style={{cursor:'pointer'}}/>Orders</p>
      <div className={styles.orderHead}>
          <div className={styles.left}>
            <p className={styles.number}>
                #{orderState?.orderNumber}
            </p>
            <p className={`${styles.type} ${orderState?.orderType==="COD"?styles.cod:orderState?.orderType==="Cancelled"?styles.cancel:styles.paid}`} >{orderState?.orderType}</p>
            <p className={`${styles.stati} ${orderState?.orderStatus==="Ordered"?styles.status:orderState?.orderStatus==="Fullfilled"?styles.status1:styles.status2}`}>{orderState?.orderStatus}</p>
            <p className={styles.date}><SlCalender className={styles.dateIcon}/>{new Date(orderState?.createdAt).toLocaleString('en-GB', { hour12: true })}</p>
          </div>
          <div className={styles.right}>
          <div>
            <div className={styles.overlay} style={{display:state?"flex":"none"}}></div>
        <div className={styles.orderOptions}>
          <button style={{cursor:'pointer'}} onClick={toggleDrawer(true)}><CiMenuKebab className={styles.icon}/></button>
          <div className={styles.drawer} style={{bottom:state?0:"-100%"}}
            onClose={toggleDrawer(false)}
          >
            <p onClick={toggleDrawer(false)}><IoMdClose/></p>
            <ul>
            <li onClick={(e)=>seteditOrderOpen(true)}>
            
              
                <CiEdit className={styles.drawerIcon}/>
              
              Edit Order
            
          </li>
          <li>
            
              
                <IoMdCopy className={styles.drawerIcon}/>
              
              Duplicate
            
          </li>
          <li onClick={cancelClick}>
            
              
                <IoMdClose className={styles.drawerIcon}/>
                {(orderState?.orderType===("COD")||orderState?.orderType===("Prepaid"))?"Cancel Order":"Retrieve Order"}
            
          </li>
          <li onClick={pdfDownload}>
            
              
                <IoMdPrint className={styles.drawerIcon}/>
              
                Print Packing Slip
            
          </li>
          
          <li onClick={markPaid}>
            
              
                <CiReceipt className={styles.drawerIcon}/>
              
                {orderState?.orderType==="COD"?"Mark as Prepaid":"Mark as COD"}            
          </li>
          <li onClick={markConfirm}>
            
              
                <CiEdit className={styles.drawerIcon}/>
              
                Order Confirmed            
          </li>
          <li onClick={markDelivered}>
            
              
                <CiEdit className={styles.drawerIcon}/>
              
                Mark as Delivered            
          </li>
          <li onClick={markReturn}>
            
              
                <CiEdit className={styles.drawerIcon}/>
              
                Mark as Returned            
          </li>
            </ul>
          </div>
        </div>
    </div>
            
            <button  onClick={handleClickOpen} style={{cursor:'pointer'}}>Fulfill</button>
            <div
                     className={styles.dialog}
        onClose={handleClose}
        style={{display:open?"flex":"none"}}
      >
        <div className={styles.dialogBody}>
        <div className={styles.dialogHead}>
          <p>FullFill Order</p>
          <IoMdClose onClick={handleClose}/>

        </div>
        <div className={styles.dialogContent}>
         
          <div className={styles.fInfo}>
            <input type="text" placeholder="Tracking Number" value={tracknumber} onChange={(e)=>setTracknumber(e.target.value)} style={{padding:'8px',width:'100%',marginBottom:'10px'}}/>
            <select name="" id="" value={trackpartner} onChange={(e)=>setTrackpartner1(e)} style={{padding:'8px',width:'100%',marginBottom:'10px'}}>
              <option value="DTDC">DTDC</option>
              <option value="Online Express">Online Express</option>
              <option value="Ecom">Ecom Express</option>
              <option value="Delivery">Delhivery</option>
              <option value="Shree Maruti">Shree Maruti</option>

            </select>
          </div>
          
          <div className={styles.applyChanges}>
            <button onClick={handleClose1} className={styles.filterBtn}>Fullfill</button>
          </div>
        </div>
        </div>
      </div>
          </div>
        </div>
      <div className={styles.orderDetail}>
        
       <div className={styles.leftSection}>
       <div className={styles.orderProducts}>
        {
          orderState?.orderItems?.map((item,index)=>{
            return( 
<div className={styles.prdt} key={index}>
          <div className={styles.left}>
          <Link href={`/lebrra-admin?prdt=${item?.product?._id}&pageName=products`}>
            <img src={modifyCloudinaryUrl(item?.product?.images && item?.product?.images[0]?.url)} alt="" onClick={()=>orderItemClick(item?.product?._id)} style={{cursor:'pointer'}}/>
            </Link>
            <div className={styles.details}>
              <p>{item?.product?.title}</p>
              <p><span>color:</span>{item?.color}</p>
              <p><span>size:</span>{item?.size}</p>
              <p><span>sku:</span>{item?.sku || item?.product?.sku}</p>
            </div>
          
    <p className={styles.price}>&#8377;{item?.price}</p>
    <p className={styles.qty}>{item?.quantity}</p>
    <p className={styles.total}>&#8377;{(item?.price)*(item?.quantity)}</p>
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
        {
          orderState?.trackingInfo &&
          <div className={styles.tracking}>
        <p className={styles.rightHead}>Tracking</p>
        <p className={styles.id}>{trackingId}</p>
        <p className={styles.id}>{trackingLink}</p>

        <p className={styles.id}>Partner: {orderState?.trackingInfo?.partner}</p>


        </div>
        }
        <div className={styles.customer}>
        <p className={styles.rightHead}>Customer</p>
        <p className={styles.customerName}><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPgCd93aiNba8lHWJYHQ1C1YwBPwcH_NUmw&usqp=CAU" alt="" /><p>{orderState?.shippingInfo?.firstname} {orderState?.shippingInfo?.lastname}</p></p>
        <p className={styles.customerOrders} style={{cursor:'pointer'}} onClick={showOrders}><CiDiscount1 className={styles.orderIcon}/><p className={styles.orderCount}>{totalOrders} Orders</p></p>
        <div className={styles.alls} style={{display:showOrderss}}>
          {
            orderState1 && orderState1?.map((item,index)=>{
             return <p key={index}>{item?.orderNumber} - &#8377;{item?.finalAmount}</p>
            })
          }
        </div>

        </div>
        <hr style={{opacity:'0.2'}}/>
        <div className={styles.email}>
          <p style={{fontWeight:600,fontSize:'13px',marginBottom:'15px'}}>Contact Info</p>
          <p><CiMail className={styles.orderIcon}/>{orderState?.shippingInfo?.email}</p>
          <p><CiPhone className={styles.orderIcon}/>+91 {orderState?.shippingInfo?.phone}</p>

        </div>
        <hr style={{opacity:'0.2'}}/>

        <div className={styles.email}>
          <p style={{fontWeight:600,fontSize:'13px',marginBottom:'15px'}}>Shipping Address</p>
          <p>{orderState?.shippingInfo?.firstname}</p>
          <p>{orderState?.shippingInfo?.address}</p>
          <p>{orderState?.shippingInfo?.city}</p>
          <p>{orderState?.shippingInfo?.pincode}</p>
          <p>{orderState?.shippingInfo?.state}</p>
          <p>+91 {orderState?.shippingInfo?.phone}</p>
          <p>+91 {orderState?.shippingInfo?.mobile}</p>
        </div>
       </div>
      </div>
      <div>
        <div className={styles.message}>
          <div className={styles.msg}>
            <p>Comment</p>
            <div className={styles.form}>
              <p>Post Comment</p>
              <input type="text" placeholder="Enter Message" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
              <button onClick={messagePost}>Comment</button>
            </div>
            <div className={styles.comments}>
              {
                orderState?.orderComment?.map((item,index)=>{
                  return <div className={styles.commentBox} key={index}>
                <div className={styles.name}>
                  <p>{item?.name}</p>
                  <p className={styles.time}>{new Date(item?.time).toLocaleString('en-GB', { hour12: true })}</p>
                </div>
                <p className={styles.msgC}>{item?.message}</p>
              </div>
                })
              }
            </div>
          </div>
          <div className={styles.history}>
          <p style={{marginBottom:'10px'}}>Order History</p>
          {
                orderState?.orderHistory?.map((item,index)=>{
                  return <div className={styles.historyBox} key={index}>
                  <div className={styles.name}>
                          <p>{item?.name}</p>
                          <p className={styles.time}>{new Date(item?.time).toLocaleString('en-GB', { hour12: true })}</p>
                        </div>
                        <p className={styles.msgC}>{item?.message}</p>
                  </div>
                })
              }
          
          </div>
        </div>

        
      <div style={{height:'auto', width:'794px',padding:'50px', position:'absolute',left:'-200%'}} ref={targetRef} className={styles.packingSlip}>
      <div className={styles.head}>
<h1>LEBRRA</h1>
<div>
    <p>Order #{currentOrderState?.orderNumber}</p>
    <p>{formattedDate}</p>
</div>
      </div>
      <div className={styles.detail}>
        <div>
        <p>SHIP TO</p>
        <p>{currentOrderState?.shippingInfo?.firstname}</p>
          <p>{currentOrderState?.shippingInfo?.address}</p>
          <p>{currentOrderState?.shippingInfo?.city}</p>
          <p>{currentOrderState?.shippingInfo?.pincode}</p>
          <p>{currentOrderState?.shippingInfo?.state}</p>
          <p style={{fontWeight:500}}>NUMBER: {currentOrderState?.shippingInfo?.phone}</p>
        </div>
        <div>
        <p>BILL TO</p>
        <p>{currentOrderState?.shippingInfo?.firstname}</p>
          <p>{currentOrderState?.shippingInfo?.address}</p>
          <p>{currentOrderState?.shippingInfo?.city}</p>
          <p>{currentOrderState?.shippingInfo?.pincode}</p>
          <p>{currentOrderState?.shippingInfo?.state}</p>
          <p style={{fontWeight:500}}>NUMBER: {currentOrderState?.shippingInfo?.phone}</p>
        </div>
      </div>
      <hr />
      <div className={styles.main}>
        <div className={styles.head}>
            <p style={{fontWeight:500}}>ITEMS</p>
            <p style={{fontWeight:500}}>QUANTITY</p>
        </div>
        {
          currentOrderState?.orderItems?.map((item,index)=>{
            return(
            <div className={styles.item} key={index}>
            <div className={styles.img}>
                <img src={modifyCloudinaryUrl(item?.product?.images && item?.product?.images[0]?.url)} alt="img" />
                <div className={styles.produDetail}>
                    <p>{item?.product?.title}</p>
                    <p>{item?.size} / {item?.color}</p>
                    <p>{item?.product?.sku}</p>
                    <p>RS. {item?.product?.price}</p>
                </div>
            </div>
            <p>{item?.quantity}</p>
        </div>

         ) })}
        

        <div className={styles.totalAmount}>
        <p style={{fontWeight:500}}>Order Type: {currentOrderState?.orderType}</p>
            <p style={{fontWeight:500}}>Shipping Cost: {currentOrderState?.shippingCost}</p>
            <p style={{fontWeight:500}}>Total Amount: Rs.{currentOrderState?.finalAmount}</p>
        </div>
        <hr />
        <div className={styles.shop}>
        <p>Thank you shopping with {currentOrderState?.tag}!</p><br/>
        <p  style={{fontWeight:700}}>LEBRRA</p>
        <p>Noida</p>
        <p>lebrra@gmail.com</p>
        <p>+91 9899202079</p>
        <p>lebrra.com</p>
        </div>
      </div>
    </div>
      </div>
    </div>
    
    
  );
};

export default AddOrder;
