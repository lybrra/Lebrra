import React, { useState,useEffect,useContext } from 'react'
import styles from './orders.module.css'
import { IoIosSearch,IoMdClose,IoIosArrowRoundUp,IoIosArrowRoundDown } from "react-icons/io";
import { CiTrash } from "react-icons/ci";
import toast from 'react-hot-toast';
import { GlobalContext } from '../../../GlobalContext';

const EditOrder = ({getOrderId}) => {
        const {setPrdtOpens,seteditOrderOpen} = useContext(GlobalContext);
  
  const [orderState,setOrderState] = useState([])
  const [productState,setProductState] = useState([])
  const [openDrops, setOpenDrops] = useState([]);
  const [open, setOpen] =useState(false);
  const quantity=1
  const [discount,setDiscount]=useState(orderState?.discount)
  const [shipping,setShipping]=useState(0)
  const [amountInput, setAmountInput] = useState('0');
  const [firstname,setFirstname]=useState(orderState?.shippingInfo?.firstname)
  const [lastname,setLastname]=useState(orderState?.shippingInfo?.lastname)
  const [email,setEmail]=useState(orderState?.shippingInfo?.email)
  const [phone,setPhone]=useState(orderState?.shippingInfo?.phone)
  const [address,setAddress]=useState(orderState?.shippingInfo?.address)
  const [city,setCity]=useState(orderState?.shippingInfo?.city)
  const [state,setState]=useState(orderState?.shippingInfo?.state)
  const [pincode,setPincode]=useState(orderState?.shippingInfo?.pincode)
  const [orderType,setOrderType]=useState(orderState?.shippingInfo?.orderType)
const [tag,setTag]=useState("Lebrra")


  const toggleDrop = (index) => {
    const updatedDrops = [...openDrops];
    updatedDrops[index] = !updatedDrops[index];
    setOpenDrops(updatedDrops);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && query!=="") {
    const searchProducts=async()=>{
try{
 const response=await fetch(`/api/products/search?search=${query}`)
 const data=await response.json()
 if(data.success){
    setProductState(data?.products)
 }
 else {
    console.error("Error fetching products");
  }
}
catch(error){
    console.error("Error fetching product:", error.message);
}
    }
searchProducts()

    setQuery("")
  }
};

useEffect(()=>{
  setDiscount(orderState?.discount)
},[orderState?.discount])
useEffect(()=>{
  setFirstname(orderState?.shippingInfo?.firstname)
  setLastname(orderState?.shippingInfo?.lastname)
setEmail(orderState?.shippingInfo?.email)
setPhone(orderState?.shippingInfo?.phone)
  setAddress(orderState?.shippingInfo?.address)
  setCity(orderState?.shippingInfo?.city)
setState(orderState?.shippingInfo?.state)
  setPincode(orderState?.shippingInfo?.pincode)
  setOrderType(orderState?.shippingInfo?.orderType)
  setShipping(orderState?.shippingCost)
  setTag(orderState?.tag)
},[orderState?.shippingInfo])
useEffect(()=>{
    if(getOrderId!==""){
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
          getSingleOrder()
    }
    
},[getOrderId])

useEffect(() => {
  if (orderState?.orderItems) {
    setOrderItems(orderState?.orderItems); // Initialize orderItems with orderState.orderItems
  }
}, [orderState?.orderItems]);

function search(productState) {
  return productState?.filter((productState) =>
    search_parameters.some((parameter) =>
      productState[parameter]?.toString()?.toLowerCase()?.includes(query)
    )
  );
}

const [query, setQuery] = useState("");
const search_parameters = Object.keys(Object.assign({}, ...productState || []));

const [selectedItems, setSelectedItems] = useState(Array(productState?.length || 0).fill([]).map(() => []));
const [orderItems, setOrderItems] = useState([]);

const handleItemClick = (filteredIndex, variantIndex, newQuantity) => {
  const searchedProducts = search(productState) || [];
  const selectedProduct = searchedProducts[filteredIndex];

  if (!selectedProduct) {
    console.error('Product not found or filteredIndex is invalid');
    return;
  }

  const selectedVariant = selectedProduct.variants[variantIndex];
  const newItem = {
    product: {
      brand: selectedProduct.brand,
      category: selectedProduct.category,
      collectionName: selectedProduct.collectionName,
      description: selectedProduct.description,
      handle: selectedProduct.handle,
      id: selectedProduct._id,
      images: selectedProduct.images,
      price: selectedProduct.price,
      ratings: selectedProduct.ratings,
      sku: selectedProduct.sku,
      sold: selectedProduct.sold,
      state: selectedProduct.state,
      tags: selectedProduct.tags,
      title: selectedProduct.title,
      totalrating: selectedProduct.totalrating,
      updatedAt: selectedProduct.updatedAt,
      variants: selectedProduct.variants,
      _id: selectedProduct._id,
    },
    color: selectedVariant.color,
    size: selectedVariant.size,
    quantity: newQuantity,
    price: selectedProduct.price,
  };

  const isChecked = selectedItems[filteredIndex]?.includes(variantIndex);

  if (!isChecked) {
    setOrderItems(prevItems => [...prevItems, newItem]);
  } else {
    setOrderItems(prevItems => prevItems.filter(item => item.product._id !== newItem.product._id || item.color !== newItem.color || item.size !== newItem.size));
  }

  setSelectedItems(prevState => {
    const newSelectedItems = [...prevState];
    if (!newSelectedItems[filteredIndex]) {
      newSelectedItems[filteredIndex] = [];
    }
    const currentIndex = newSelectedItems[filteredIndex].indexOf(variantIndex);
    if (currentIndex === -1) {
      newSelectedItems[filteredIndex].push(variantIndex);
    } else {
      newSelectedItems[filteredIndex].splice(currentIndex, 1);
    }
    return newSelectedItems;
  });
};



const handleQuantityChange = (index, newQuantity) => {
  setOrderItems(prevItems => {
    // Create a new array with updated items
    const updatedItems = [...prevItems];
    // Update the quantity of the item at the specified index
    updatedItems[index] = { ...updatedItems[index], quantity: newQuantity };
    return updatedItems;
  });
};

const handleDeleteItem = (index) => {
  const updatedItems = [...orderItems];
  updatedItems.splice(index, 1); // Remove the item at the specified index
  setOrderItems(updatedItems);
};
const shippingAdd=()=>{
  if(shipping===0){
    setShipping(200)
  }
  else{
    setShipping(0)
  }
}


const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

const calculateUpdatedAmount = () => {
  if (!amountInput.trim()){
    setDiscount(orderState?.discount)
  };

  if (amountInput.endsWith('%')) {
    const percentage = parseFloat(amountInput) / 100;
    const amountToChange = subtotal * percentage;
    return amountToChange;
  } else {
    const numericValue = parseFloat(amountInput);
    return numericValue;
  }
};

useEffect(()=>{
  const updatedAmount = calculateUpdatedAmount()

  if(updatedAmount!==0){
    setDiscount(updatedAmount)
  }
})
const handleAmountInputChange = (e) => {
  setAmountInput(e.target.value);
};

const total=subtotal-discount+shipping

const user=JSON.parse(localStorage.getItem("user"))

const submitClick=()=>{
   const updateOrder=async()=>{
    try {
        const response = await fetch(`/api/order/update-order?id=${orderState?._id}&token=${user?.token}`,{
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
            paymentInfo:orderState.paymentInfo,
            orderItems:orderItems,
            totalPrice:subtotal,
            shippingCost:shipping,
            orderType:orderState?.orderType,
            discount:discount,
            finalAmount:total,
            orderStatus:orderState?.orderStatus,
            createdAt:orderState?.createdAt,
            tag:tag,
            orderCalled:orderState?.orderCalled, 
          })
        })
        const data=await response.json()
        if(response.ok){
            toast.success("Order Upadted")
            setOrderState(data)
            setPrdtOpens(false)
            seteditOrderOpen(false)
        }
        else{
            toast.error("Unable to Update Order")
        }
      }
      catch (err) {
        console.log(err)
      }
   }
   updateOrder()
    
const createHistory=async()=>{
    try {
        const response = await fetch(`/api/order/set-history`,{
          method:"PUT",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify({orderId:orderState?._id,name:user?.firstname,time:(new Date()),message:`Order Edited by ${user?.firstname}`})
        })
      }
      catch (err) {
        console.log(err)
      }
}
createHistory()

}

const modifyCloudinaryUrl = (url) => {
  const urlParts = url?.split('/upload/');
  return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
};

  return (
    <div className={styles.newOrder}>
      {/* <form action=""> */}
        <div className={styles.head}>
          <p>Update Order</p>
          <button onClick={submitClick} className={styles.submitBtn}>Update</button>
        </div>
        <div className={styles.orderData}>
          <div className={styles.dataLeft}>
              <div className={styles.products}>
                <p className={styles.prdtHead} style={{fontWeight:600,fontSize:'13px',margin:'15px 0'}}>Products</p>
                  <div className={styles.search}>
    <IoIosSearch className={styles.IoIosSearch}/>
                    <input type="search" placeholder='Select Products' onClick={handleClickOpen}/>
                    <div
                     className={styles.dialog}
                     style={{display:open?"block":"none"}}
      >
        <div className={styles.dialogHead}>
        <p>
          Add Products
        </p>

          <IoMdClose onClick={handleClose}/>
        </div>
       
        <div dividers className={styles.dialogContent}>
          <div className={styles.searchDialog}>
          <IoIosSearch className={styles.IoIosSearch}/>
                    <input type="search" placeholder='Select Products' onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}/>
          </div>
          <div className={styles.productList}>
          {
          search(productState)?.map((dataObj,index) => {

return (
  <div className={styles.listProduct} key={index}>
    <div className={styles.productMain}>
      <div>
        <img src={modifyCloudinaryUrl(dataObj?.images && dataObj?.images[0]?.url)} alt="" />
        <p>{dataObj?.title}<p style={{marginLeft:'0px',marginTop:'5px',fontWeight:500}}>{dataObj?.sku}</p></p>
        
      </div>
      <p className={styles.dropIcon} onClick={() => toggleDrop(index)}>{openDrops[index] ? <IoIosArrowRoundUp className='icon'/> : <IoIosArrowRoundDown className='icon'/>}</p>
    </div>
    <div className={styles.productDrop} style={{ display: openDrops[index] ? 'block' : 'none' }}>
      <ul>
      {
  dataObj?.variants?.map((item, idx) => {
    const isSelected = selectedItems[index]?.includes(idx);
    return (
      <li
        key={idx}
        className={`${styles.listItem} ${isSelected ? styles.selectedItem : ''}`}
        // onClick={() => handleItemClick(index, idx)}
      >
<input type="checkbox" name="" id="" onClick={() => handleItemClick(index, idx, quantity)} />
        <p>{item?.color} / {item?.size}</p>
        <p>{item?.quantity} available</p>
        <p>&#8377; {dataObj?.price}</p>
      </li>
    )
  })
}
      </ul>
    </div>
  </div>
)
}
)
}


          </div>
          <div className={styles.applyChanges}>
            <button onClick={handleClose} className={styles.filterBtn}>Apply</button>
          </div>
        </div>
      </div>
                  </div>

                  <div className={styles.product}>
                    <div className={styles.headings}>
                      <p>Product</p>
                      <p>Quantity</p>
                      <p>Price</p>
                    </div>
                    {
  orderItems?.map((item, index) => {
    return (
      <div className={styles.productData} key={index}>
        <div>
          <img src={modifyCloudinaryUrl(item?.product?.images && item?.product?.images[0]?.url)} alt="" />
          <div className={styles.detail}>
            <p className={styles.title}>{item?.product?.title}</p>
            <p className={styles.size}><span>{item?.size}</span> / <span>{item?.color}</span></p>
            <p className={styles.sku}>SKU: {item?.product?.sku}</p>
            <p className={styles.price}>&#8377; {item?.price}</p>
          </div>
        </div>
        <div>
          <input type="number" name="" id="" value={item.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
        </div>
        <div>
          <p>&#8377; {item.quantity * item.price}</p>
          <p><CiTrash className={styles.deleteIcon} onClick={() => handleDeleteItem(index)} /></p>
        </div>
      </div>
    );
  })
}
                  </div>
              </div>
              <div className={styles.payment}>
              <p className={styles.prdtHead} style={{fontWeight:600,fontSize:'13px',margin:'15px 0'}}>Payment</p>
                <div className={styles.paymentInfo}>
                  <div className={styles.left}>
                      <p>Subtotal</p>
                      <p >Add Discount</p>
                      <p style={{cursor:'pointer',color:'blue'}} onClick={shippingAdd}>{
                        shipping===0?"Add Shipping":"Remove Shipping"
}</p>
                      <p>Total</p>

                  </div>
                  <div className={styles.center}>
                  <p>{orderItems?.length} Item</p>
                      <p><input type="text" value={amountInput} onChange={(e)=>handleAmountInputChange(e)} placeholder='Discount'/></p>
                      <p>-</p>
                      <p>-</p>
                  </div>
                  <div className={styles.right}>
                  <p>&#8377; {subtotal}</p>
                      <p>&#8377; {discount}</p>
                      <p>&#8377; {shipping}</p>
                      <p>&#8377; {total}</p>
                  </div>
                </div>
              </div>
          </div>
          <div className={styles.dataRight}>
          <div className={styles.notes}>
              <p className={styles.prdtHead} style={{fontWeight:600,fontSize:'13px',margin:'15px 0'}}>Select Brand</p>
<select name="" id="" value={tag} onChange={(e)=>setTag(e.target.value)}>
  <option value="Lebrra">Lebrra</option>
</select>
              </div>
              <div className={styles.notes}>
              <p className={styles.prdtHead} style={{fontWeight:600,fontSize:'13px',margin:'15px 0'}}>Order Type</p>
<p>Status: {orderState?.orderType}</p>
              </div>
              <div className={styles.notes}>
<div className={styles.customerDetail}>
<p className={styles.prdtHead} style={{fontWeight:600,fontSize:'13px',margin:'15px 0'}}>Customer Details</p>


  <input type="text" placeholder='First Name' value={firstname} onChange={(e)=>setFirstname(e.target.value)}/>
  <input type="text" placeholder='Last Name' value={lastname} onChange={(e)=>setLastname(e.target.value)}/>
  <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
  <input type="number" placeholder='Phone' value={phone} onChange={(e)=>setPhone(e.target.value)}/>
  <input type="text" placeholder='Address' value={address} onChange={(e)=>setAddress(e.target.value)}/>
  <input type="text" placeholder='City' value={city} onChange={(e)=>setCity(e.target.value)}/>
  <input type="text" placeholder='State' value={state} onChange={(e)=>setState(e.target.value)}/>
  <input type="number" placeholder='Pin Code' value={pincode} onChange={(e)=>setPincode(e.target.value)}/>

</div>

              </div>
          </div>
        </div>
    </div>
  )
}

export default EditOrder
