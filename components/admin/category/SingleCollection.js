import React, { useContext, useEffect, useState } from 'react'
import styles from './category.module.css'
import { IoMdClose } from 'react-icons/io'
import { GlobalContext } from '../../../GlobalContext'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CldUploadWidget } from 'next-cloudinary';
import toast from 'react-hot-toast';

const SingleCollection = ({getCollectionId}) => {
const {setPrdtOpens}=useContext(GlobalContext)
  const [title,setTitle]=useState("")
  const [category1,setCategory1]=useState("")
  const [handle,setHandle]=useState("")
  const [isFeatured,setIsFeatured]=useState("false")
  const [img1,setImg1]=useState(null)
  const [img2,setImg2]=useState(null)
  const [metaDesc,setMetaDesc]=useState("")
  const [metaTitle,setMetaTitle]=useState("")
  const [mostTrending,setMostTrending]=useState("false")
  const [status,setStatus]=useState("draft")
  const [order,setOrder]=useState(1)
  const [products,setProducts]=useState([])
useEffect(()=>{
if(getCollectionId!==""){
  const fetchSingleCollection=async()=>{
try{
const response=await fetch(`/api/collection/get-single-collection?id=${getCollectionId}`)
const data=await response.json()
if(response.ok){
  setTitle(data?.title)
  setCategory1(data?.category)
  setHandle(data?.handle)
  setIsFeatured(data?.isFeatured)
  setImg1(data?.banner[0])
  setImg2(data?.banner[data?.banner?.length - 1])
  setMetaDesc(data?.metaDesc)
  setMetaTitle(data?.metaTitle)
  setMostTrending(data?.mostTrending)
  setStatus(data?.status)
  setOrder(data?.order)
  const fetchProducts=async()=>{
    try{
    const response=await fetch(`/api/products?collectionName=${data?.title}&limit=10000`)
    const data1=await response.json()
    if(response.ok){
     setProducts(data1.products)
    }
    else{
      console.log("Unable to fetch collection")
    }
    }
    catch(err){
      console.log(err)
    }
      }
      fetchProducts()
}
else{
  console.log("Unable to fetch collection")
}
}
catch(err){
  console.log(err)
}
  }
  fetchSingleCollection()
 
}
else{
  setTitle("")
  setCategory1("")
  setHandle("")
  setImg1(null)
  setImg2(null)
  setMetaDesc("")
  setMetaTitle("")
  setStatus("draft")
  setOrder(1)
  setIsFeatured("false")
  setMostTrending("false")
  setProducts([])
}
},[getCollectionId])

const handleOnDragEnd = (result) => {
  if (!result.destination) return;
  const newItems = Array.from(products);
  const [reorderedItem] = newItems.splice(result.source.index, 1);
  newItems.splice(result.destination.index, 0, reorderedItem);
  setProducts(newItems);
};

const handleSave = async () => {
  try {
    const productIds = products?.map(item => item._id);
    const response = await fetch('/api/products/reorder', {
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({productIds})
  })
    if (response.status === 200) {
      toast.success('Order saved successfully!');
    } else {
      throw new Error('Failed to save order due to server response');
    }
  } catch (error) {
    console.error('Failed to save order:', error);
    toast.error('Failed to save order.');
  }
};

const createHistory=async(value)=>{
  try{
    const response=await fetch("/api/history/create-history",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
  })
  if(response.ok){
    setPrdtOpens(false)
  }
  
  }catch(error){
    console.log(error)
  }
  }

  const [user,setUser]=useState(null)
  useEffect(()=>{
setUser(JSON.parse(localStorage.getItem("user")))
  },[])
const handleCollectionSave=async()=>{
  if(getCollectionId===""){
    try{
      const response = await fetch(`/api/collection/create-collection?token=${user?.token}`, {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({title,category:category1,handle,isFeatured,banner:[img1,img2],metaDesc,metaTitle,mostTrending,status,order})
    }
      )
      if(response.ok){
        toast.success(`Collection Created Successfully`)
        createHistory({ name: user?.firstname, title: title, sku: title, productchange: `Created a Collection`, time: new Date() })
        setPrdtOpens(false)

      }
      else{
        toast.error("Unable to create collection")
      }
    }
    catch(error){
      console.log(error)
  }

  }
  else{
    try{
      const response = await fetch(`/api/collection/update-collection?id=${getCollectionId}&token=${user?.token}`, {
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({title,category:category1,handle,isFeatured,banner:[img1,img2],metaDesc,metaTitle,mostTrending,status,order})
    }
      )
      if(response.ok){
        toast.success(`Collection Updated Successfully`)
        createHistory({ name: user?.firstname, title: title, sku: title, productchange: `Updated a Collection`, time: new Date() })
      }
      else{
        toast.error("Unable to update collection")
      }
    }
    catch(error){
      console.log(error)
  }
  }
}


const handleCollectionDelete=async()=>{
  if(getCollectionId!==""){

  
  try{
    const response = await fetch(`/api/collection/delete-collection?id=${getCollectionId}&token=${user?.token}`, {
      method:"DELETE",
      headers: { "Content-Type": "application/json" },
  }
    )
    if(response.ok){
      toast.success(`Collection Deleted Successfully`)
    createHistory({ name: user?.firstname, title: title, sku: title, productchange: `Deleted a Collection`, time: new Date() })

      setPrdtOpens(false)
    }
    else{
      toast.error("Unable to delete collection")
    }
  }
  catch(error){
    console.log(error)
}
  }
}

  return (
    <div className={styles.singleCol}>
      <div className={styles.singleColHead}>
        <p>{category1}</p>
        <div>
          <button onClick={handleCollectionSave}>Save</button>
          <button style={{display:getCollectionId!==""?"flex":"none"}} onClick={handleCollectionDelete}>Delete</button>
        </div>
      </div>

      <div className={styles.singleColInfo}>
        <div className={styles.left}>
        {
          img1===null?
          <CldUploadWidget
          signatureEndpoint="/api/upload/upload-img"
          onSuccess={(result, { widget }) => {
            setImg1({
              public_id:result.info.public_id,
              asset_id:result.info.asset_id,
              url:result.info.secure_url
            });  // { public_id, secure_url, etc }
          }}
          onQueuesEnd={(result, { widget2 }) => {
            widget2.close();
          }}
        >
          {({ open }) => {
            function handleOnClick1() {
              open();
            }
            return (
              <button onClick={handleOnClick1} className={styles.uploadBtn}>
                Upload Image1
              </button>
            );
          }}
        </CldUploadWidget>
          :
          <div>
          <IoMdClose className={styles.closeIco} onClick={(e)=>setImg1(null)}/>
        <img src={img1?.url} alt={title} />
        </div>
        }
         {
          img2===null?
          <CldUploadWidget
          signatureEndpoint="/api/upload/upload-img"
          onSuccess={(result, { widget }) => {
            setImg2({
              public_id:result.info.public_id,
              asset_id:result.info.asset_id,
              url:result.info.secure_url
            });  // { public_id, secure_url, etc }
          }}
          onQueuesEnd={(result, { widget1 }) => {
            widget1.close();
          }}
        >
          {({ open }) => {
            function handleOnClick2() {
              open();
            }
            return (
              <button onClick={handleOnClick2} className={styles.uploadBtn}>
                Upload Image 2
              </button>
            );
          }}
        </CldUploadWidget>
          :
          <div>
          <IoMdClose className={styles.closeIco} onClick={(e)=>setImg2(null)}/>
        <img src={img2?.url} alt={title} />
        </div>
        }

        </div>
        <div className={styles.right}>
        <div style={{display:getCollectionId===""?"block":"none"}}>
              <p>Title</p>
              <input type="text" placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)}/>
            </div>
            <div>
              <p>Name</p>
              <input type="text" placeholder='Name' value={category1} onChange={(e)=>setCategory1(e.target.value)}/>
            </div>
            <div>
              <p>Handle</p>
              <input type="text" placeholder='Handle' value={handle} onChange={(e)=>setHandle(e.target.value)}/>
            </div>
            <div>
              <p>Status</p>
              <select name="" id="" value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <p>Order</p>
              <input type="number" placeholder='Order' value={order} onChange={(e)=>setOrder(e.target.value)}/>
            </div>
            <div>
              <p>Is Trending</p>
              <select name="" id="" value={isFeatured} onChange={(e)=>setIsFeatured(e.target.value)}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <p>Most Trending</p>
              <select name="" id="" value={mostTrending} onChange={(e)=>setMostTrending(e.target.value)}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            
            <div>
              <p>Meta Title</p>
              <input type="text" placeholder='Meta Title' value={metaTitle} onChange={(e)=>setMetaTitle(e.target.value)}/>
            </div>
            <div>
              <p>Meta Description</p>
              <textarea placeholder='Meta Description' value={metaDesc} onChange={(e)=>setMetaDesc(e.target.value)}></textarea>
            </div>
        </div>
      </div>
      {
        products && products?.length>0?
        <div className={styles.singleColPrdts} style={{display:getCollectionId!==""?"block":"none"}}>
        <button onClick={handleSave}>SAVE ORDER</button>
        <div className={styles.prdtsHead}>
          <ul>
            <li>Image</li>
            <li>Title</li>
            <li>Sku</li>
            <li>Inventory</li>
            <li>Status</li>
          </ul>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd} >
          <Droppable droppableId="products" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ overflowY: 'auto', maxHeight: '200vh' }}>
                {products?.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
          <div className={styles.prdt} key={index}>
            <img src={item?.images[0]?.url} alt="" />
            <p>{item?.title}</p>
            <p>{item?.sku}</p>
            <p>{item?.variants?.reduce((total, item) => total + item?.quantity, 0)}</p>
            <p>{item?.state}</p>
          </div>
          </div>
                    )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
        </div>
        :""
      }
      
      </div>
      
  
  )
}

export default SingleCollection
