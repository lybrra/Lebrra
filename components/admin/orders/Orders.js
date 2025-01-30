import React, { useEffect, useState,useContext } from 'react'
import styles from './orders.module.css'
import LoadingBar from "react-top-loading-bar"; // Import LoadingBar
import { IoIosSearch } from "react-icons/io";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { GlobalContext } from '../../../GlobalContext';
import AddOrder from './AddOrder';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';
import EditOrder from './EditOrder';
import CreateOrder from './CreateOrder';
const Orders = () => {
  const [todayDataState, settodayDataState] = useState([])
  const [progress, setProgress] = useState(0); // Progress state for LoadingBar
  const [user,setUser] =useState({})
  const {prdtOpens,setPrdtOpens,editOrderOpen,seteditOrderOpen} = useContext(GlobalContext);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")))
    const getMonthlyData = async () => {
      try {
        const response = await fetch('/api/order/getordersdata')
        const data = await response.json()
        if (response.ok) {
          settodayDataState(data.todaydata)

        }
        else {
          console.log("Unable to fetch Today data")
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    getMonthlyData()
  }, [])

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter()
      // const queryParams = new URLSearchParams(location.search);
        useEffect(()=>{
          const searchParams = new URLSearchParams();
          searchParams.set('pageName',"orders");
          router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
            },[])

  let page = parseInt(searchParams.get("page")) || 1;
  const [orderState, setorderState] = useState([])
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch(`/api/user/getallorders?page=${page}`)
        const data = await response.json()
        if (response.ok) {
          setorderState(data.orders)
        }
        else {
          console.log("Unable to fetch orders")
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    getOrders()
  }, [page])



  const updateURL = (updateParams) => {
    const searchParams = new URLSearchParams();

    if (updateParams.page !== "") {
      searchParams.set('page', updateParams.page);
    }
    searchParams.set('pageName',"orders");

    setProgress(30);
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
    setTimeout(() => setProgress(100), 500);

  };


  const nextPage = () => {
    page++;
    updateURL({ page });
  }
  const prevPage = () => {
    if (page > 1) {
      page--;
      updateURL({ page });
    }
  }
  const [searchValue, setSearchValue] = useState('');

  // Function to calculate relevance score

  const fetchSearch = () => {
    const getOrders = async () => {
      try {
        const response = await fetch(`/api/user/getallorders?search=${searchValue}`)
        const data = await response.json()
        if (response.ok) {
          setorderState(data.orders)
        }
        else {
          console.log("Unable to fetch orders")
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    getOrders()
  }


  const modifyCloudinaryUrl = (url) => {
    const urlParts = url?.split('/upload/');
    return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
  };


  const confirmOrder =async (orderData) => {
    try {
      const response = await fetch(`/api/order/confirm-order?id=${orderData?._id}&token=${user?.token}`,{
        method:"PUT",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
       toast.success("Order Confirmed")
       const createHistory=async()=>{
        try {
            const response = await fetch(`/api/order/set-history`,{
              method:"PUT",
              headers: { "Content-Type": "application/json" },
              body:JSON.stringify({orderId:orderData?._id,name:user?.firstname,time:(new Date()),message:`Order Confirmed by ${user?.firstname}`})
            })
          }
          catch (err) {
            console.log(err)
          }
    }
    createHistory()
      }
      else {
        console.log("Unable to update orders")
      }
    }
    catch (err) {
      console.log(err)
    }
    
    const getOrders = async () => {
      try {
        const response = await fetch(`/api/user/getallorders?page=${page}`)
        const data = await response.json()
        if (response.ok) {
          setorderState(data.orders)
        }
        else {
          console.log("Unable to fetch orders")
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    getOrders()
  }
  const cancelOrder =async (orderData) => {
    if (orderData?.orderType === ("COD") || orderData?.orderType === ("Prepaid")) {
      if (window.confirm("Do you want to cancel?")) {
        try {
          const response = await fetch(`/api/order/cancel-order?id=${orderData?._id}&token=${user?.token}`,{
            method:"PUT",
            headers: { "Content-Type": "application/json" },
          })
          if (response.ok) {
           toast.success("Order Cancelled")
           const createHistory=async()=>{
            try {
                const response = await fetch(`/api/order/set-history`,{
                  method:"PUT",
                  headers: { "Content-Type": "application/json" },
                  body:JSON.stringify({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Cancelled by ${user?.firstname}`})
                })
              }
              catch (err) {
                console.log(err)
              }
        }
        createHistory()
          }
          else {
            console.log("Unable to update orders")
          }
        }
        catch (err) {
          console.log(err)
        }
        const getOrders = async () => {
          try {
            const response = await fetch(`/api/user/getallorders?page=${page}`)
            const data = await response.json()
            if (response.ok) {
              setorderState(data.orders)
            }
            else {
              console.log("Unable to fetch orders")
            }
          }
          catch (err) {
            console.log(err)
          }
        }
        getOrders()  
      }
    }
  };

const [orderId,setorderId]=useState("")
// const [addPrdt,setAddPrdt]=useState(false)


const closeOrder=()=>{
  setorderId("")
  setPrdtOpens(false)
  seteditOrderOpen(false)
}
const addOrder=()=>{
  setorderId("")
  setPrdtOpens(true)
  seteditOrderOpen(false)

}

const openOrder=(val)=>{
  setorderId(val)
  setPrdtOpens(true)
  seteditOrderOpen(false)

}

const [numOrders,setNumOrders]=useState(1)

const exportToExcel = () => {
  const ordersToExport = orderState.slice(-numOrders); // Get the last 'numOrders' orders

  // Map each order to include only the desired fields
  const formattedOrders = ordersToExport.map(order => ({
    'Order Date': new Date(order.createdAt).toLocaleString('en-GB', { hour12: true }),
    'Order Number': order.orderNumber,
    'First Name': `${order.shippingInfo.firstname} ${order.shippingInfo.lastname}`,
    'Address': `${order.shippingInfo.address}, ${order.shippingInfo.city},${order.shippingInfo.state},${order.shippingInfo.pincode}`,
    'Mobile': order.shippingInfo.phone,
    'Email': order.shippingInfo.email,
    'Final Amount': order.finalAmount,
    'Order Type': order.orderType,
    'State': order.state
  }));

  // Convert formatted orders data to Excel format
  const worksheet = XLSX.utils.json_to_sheet(formattedOrders);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  // Save the workbook as an Excel file
  XLSX.writeFile(workbook, 'orders.xlsx');
};


  return (
    <div className={styles.orders}>
      <LoadingBar
        color="var(--primary-color)"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles.addprdt} style={{display:prdtOpens?"flex":"none"}}>
  <IoMdClose className={styles.close} onClick={closeOrder}/>
  <div className={styles.addprdtbody}>
    {
      orderId===""?
    <CreateOrder/>
:editOrderOpen?
<EditOrder getOrderId={orderId}/>
:
<AddOrder getOrderId={orderId}/>
    }
  </div>
  </div>
      <div className={styles.head}>
        <p className={styles.heading}>Orders(&#8377;<span>{Math.floor(todayDataState && todayDataState[0]?.totalIncome)}</span>)</p>
        <div className={`${styles.searchs} ${styles.search1}`}>
          <input type="search" name="" id="" placeholder='Search For Orders' onChange={(e) => setSearchValue(e.target.value)} />
          <p onClick={fetchSearch}>       <IoIosSearch />
          </p>        </div>
        <div className={styles.down}>
          <button className={styles.btn} onClick={addOrder}>Create Order</button>
          <div>
<input
            type="number"
            value={numOrders}
            onChange={e => setNumOrders(e.target.value)}
          />
          <button onClick={exportToExcel}>Export</button>
</div>
        </div>

      </div>
      <div className={`${styles.searchs} ${styles.search2}`}>
        <input type="search" name="" id="" placeholder='Search For Orders' onChange={(e) => setSearchValue(e.target.value)} />
        <p onClick={fetchSearch}><IoIosSearch /></p>

      </div>
      <div className={styles.productTable}>
        {
          orderState?.slice()?.reverse()?.map((item, index) => {
            return <div className={styles.product} key={index}>
              <p className={`${styles.state} ${item?.orderType === "COD" ? styles.cod : item?.orderType === "Cancelled" ? styles.cancel : styles.paid}`}>{item?.orderType}{item?.isPartial === true ? " / Paid" : ""}</p>
                <div className={styles.productImg} onClick={(e)=>openOrder(item?._id)} style={{cursor:"pointer"}}>
                  <Image src={modifyCloudinaryUrl(item?.orderItems[0]?.product?.images && item?.orderItems[0]?.product?.images[0]?.url)} alt={item?.orderNumber} width={250} height={200} style={{height:"100%"}} />
                  <div className={styles.detail}>
                    <p className={styles.number}><span>Order No.</span> #{item?.orderNumber} </p>
                    <p style={{ display: 'flex', alignItems: 'center' }}>{item?.tag} {
                      item?.orderCalled === "Called" ? <span style={{ display: "flex", width: '10px', height: '10px', backgroundColor: 'green', borderRadius: '50%', marginLeft: '7px' }}></span> : ""
                    }</p>
                    <p className={styles.time}><span>Date/Time:</span> {new Date(item?.createdAt).toLocaleString('en-GB', { hour12: true })}

                    </p>
                    <p className={styles.status}><span>Status:</span> {item?.orderStatus}</p>
                    <p className={styles.amount}><span>Amount/Item:</span> &#8377;{item?.finalAmount} / {item?.orderItems?.length} Items</p>

                  </div>
                </div>
              <p className={styles.name}><span>Name:</span>{item?.shippingInfo?.firstname} {item?.shippingInfo?.lastname}</p>
              <p className={styles.address}><span>Address:</span>{item?.shippingInfo?.city},{item?.shippingInfo?.state}</p>
              <p className={styles.phone}><span>Phone:</span>+91 {item?.shippingInfo?.phone}</p>
              <div className={styles.marks}>
                <p className={`${styles.ok} ${styles.oks}`} onClick={(e) => confirmOrder(item)}><abbr title='Confirm Order'><IoCheckmarkDoneCircle className={styles.ico1} /></abbr></p>
                <p className={`${styles.ok1} ${styles.oks}`} onClick={(e) => cancelOrder(item)}><abbr title="Cancel Order"><AiFillCloseCircle className={styles.ico2} /></abbr></p>
              </div>
            </div>
          })
        }



      </div>




      <div className={styles.paginate}>
        <button onClick={prevPage} disabled={page === 1 ? true : false} style={{ backgroundColor: page === 1 ? 'rgb(190, 190, 190)' : '', cursor: page === 1 ? 'context-menu' : '' }}>
          Prev
        </button>
        <p>{page}</p>
        <button
          onClick={nextPage}
          disabled={orderState?.length < 50 ? true : false}
          style={{ backgroundColor: orderState?.length < 50 ? 'rgb(190, 190, 190)' : '', cursor: orderState?.length < 50 ? 'context-menu' : '' }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Orders
