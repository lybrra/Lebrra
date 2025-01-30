"use client"
import { React, useEffect, useState,useRef,useContext } from "react";
import styles from './addprdt.module.css'
import { useDrag, useDrop } from "react-dnd";
import { IoMdClose } from "react-icons/io";
import dynamic from "next/dynamic";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import Select from 'react-select'
import draftToHtml from "draftjs-to-html";
const htmlToDraft = typeof window === "object" ? require("html-to-draftjs").default : null;
import { CldUploadWidget } from 'next-cloudinary';
// Dynamically import the Editor component
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast from "react-hot-toast";
import { GlobalContext } from '../../../GlobalContext';
import { useSearchParams } from "next/navigation";

const AddProduct = ({ collectionState }) => {
    const {prdtOpens,setPrdtOpens} = useContext(GlobalContext);
    const searchParams=useSearchParams()
    const getProductId=searchParams.get("prdt") || ""
  
  const [imgState,setImgState] = useState([])
  const [productTitle,setproductTitle]=useState("")
  const [prdtId,setPrdtId]=useState("")
  const [productOrder,setproductOrder]=useState("")
  const [productRatings,setproductRatings]=useState([])
  const [productTotalRatings,setproductToatlRatings]=useState(0)
  const [collectionHandle,setCollectionHandle]=useState("")
  const [isFeatured,setIsFeatured]=useState("false")
const [productAlt,setproductAlt]=useState("")
const [productDescription,setproductDescription]=useState("")
const [productCategory,setproductCategory]=useState("")
const [productImages,setproductImages]=useState("")
const [productPrice,setproductPrice]=useState("")
const [productPrice1,setproductPrice1]=useState("")
const [productHandle,setproductHandle]=useState("")
const [productBrand,setproductBrand]=useState("")
const [productSku,setproductSku]=useState("")
const [productState,setproductState]=useState("")
const [productCollectionName,setproductCollectionName]=useState("")
const [productVariants,setproductVariants]=useState([])
const [productTags,setproductTags]=useState("")
const [metaDesc,setmetaDesc]=useState("")
const [metaTitle,setmetaTitle]=useState("")
const [metaDesc1,setmetaDesc1]=useState("")
const [metaTitle1,setmetaTitle1]=useState("")
const [metaDesc4,setmetaDesc4]=useState("")
const [metaTitle4,setmetaTitle4]=useState("")
const [sold,setsold]=useState("")
  const [user,setUser]=useState("")
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user")) || ""
setUser(user)
  },[])
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const updateEditorState = (description) => {
    const contentBlock = htmlToDraft(description || "");
    const initialContentState = contentBlock
      ? ContentState.createFromBlockArray(contentBlock.contentBlocks)
      : ContentState.createFromText("");
    setEditorState(EditorState.createWithContent(initialContentState));
  };


 useEffect(()=>{
    setImgState([])
 },[prdtOpens]) 

  const onEditorStateChange = (newState) => {
    setEditorState(newState);

    // Convert editor content to HTML and update productDesc
    const rawContent = convertToRaw(newState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent);
    setproductDescription(htmlContent);
  };
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [main,setMain]=useState("")

  const Images = ({ src, id, index, moveImage, deleteImage }) => {
    const ref = useRef(null);
    
    const [, drop] = useDrop({
      accept: "image",
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
  
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
  
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // When dragging upwards, only move when the cursor is above 50%
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
  
        // Time to actually perform the action
        moveImage(dragIndex, hoverIndex);
        item.index = hoverIndex; // Update the index for the dragged item
      },
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: "image",
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    console.log(src)
  
    return (
      <div ref={ref} style={{ opacity }} className={styles.imageContainer}>
        <div className={styles.image} style={{ backgroundImage: `url(${src})` }} onClick={()=>setMain(src)}>
          <img src={src} alt="" />
        </div>
        <button onClick={() => deleteImage(id)}>
          <IoMdClose />
        </button>
      </div>
    );
  };
  const img = [];
  imgState && imgState?.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });


  useEffect(() => {

    if (getProductId !== "") {
      const getSinglePrdt=async()=>{
        try {
          const response = await fetch(
            `/api/products/single-product-dash?productHandle=${getProductId}`
          );
          const data = await response.json();
          if (data.success && data.product) {
            const product = data.product;
    setproductTitle(product?.title || "");
    setPrdtId(product?._id)
    setproductAlt(product?.alt || "");
    setproductTags(product?.tags || "");
    setproductState(product?.state || "draft");
  setproductImages(product?.images)
    setproductHandle(product?.handle || "");
    setproductDescription(product?.description || "");
    setCollectionHandle(product?.collectionHandle || "")
    setIsFeatured(product?.isFeatured || "false")
    setproductPrice(product?.price || "");
    setproductPrice1(product?.price1 || "");
    setproductCategory(product?.category || "");
    setproductBrand(product?.brand || "");
    setproductSku(product?.sku || "");
    setproductCollectionName(product?.collectionName || "");
    setproductVariants(product?.variants || []);
    setmetaDesc(product?.metaDesc || "");
    setmetaTitle(product?.metaTitle || "");
    setmetaDesc1(product?.metaDesc1 || "");
    setmetaTitle1(product?.metaTitle1 || "");
    setmetaDesc4(product?.metaDesc4 || "");
    setmetaTitle4(product?.metaTitle4 || "");
    setproductOrder(product?.order || 1)
    setsold(product?.sold || 0)
    setproductRatings(product?.ratings || [])
    setproductToatlRatings(product?.totalrating || 0)
    updateEditorState(product?.description);
    img.push(product?.images)
    
          } else {
            console.log("No product find")
          }
        } catch (error) {
          console.error("Error fetching product:", error.message);
        }
      }
    
    getSinglePrdt()
    
    }
    else{
      setproductTitle("");
  setproductAlt("");
  setproductTags("");
  setproductState("draft");
  setproductHandle("");
  setproductDescription("");
  setproductPrice("");
  setproductPrice1("");
  setproductCategory("");
  setproductBrand("");
  setproductSku("");
  setproductCollectionName("");
  setproductVariants([]);
  setmetaDesc("");
  setmetaTitle("");
  setmetaDesc1("");
  setmetaTitle1("");
  setmetaDesc4("");
  setmetaTitle4("");
  setPrdtId("")
  setsold(0)
  setproductRatings([])
  setproductOrder(1)
  setproductImages([])
  setproductToatlRatings(0)
  setIsFeatured("false")
    }
  }, [getProductId]);






  const [combinedImages,setCombinedImages] = useState(productImages?.length > 0 ? [...productImages, ...imgState] : imgState)
  useEffect(()=>{
    setCombinedImages(productImages?.length > 0 ? [...productImages, ...imgState] : imgState)
  },[productImages,imgState])
  const formik ={
    values:{
      title: productTitle || "",
      alt: productAlt || "",
      tags: productTags || "",
      state: productState || "draft",
      handle: productHandle || "",
      order:productOrder || 1,
      sold:sold || 0,
      ratings:productRatings || [],
      totalrating:productTotalRatings || 0,
      description: productDescription || "",
      price: productPrice || '',
      price1: productPrice1 || '',
      category: productCategory || '',
      brand: productBrand || '',
      isFeatured:isFeatured || "false",
      sku: productSku || '',
      images:combinedImages,
      collectionName: productCollectionName || '',
      collectionHandle:collectionHandle || "",
      variants: productVariants || [],
      metaDesc:metaDesc||"",
      metaTitle:metaTitle||"",
      metaDesc1:metaDesc1||"",
      metaTitle1:metaTitle1||"",
      metaDesc4:metaDesc4||"",
      metaTitle4:metaTitle4||""
    }
  }
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

const createProduct=async()=>{
try{
  const response=await fetch(`/api/products/create-product?token=${user?.token}`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formik.values),
})
const data=await response.json()
  if(data.status===200){
    createHistory({name:user?.firstname,title:productTitle,sku:productSku,productchange:"Created the Product",time:new Date()})
    toast.success("Product Created Successfully")

  }
  else{
    toast.error("Unable to Create Product")
  }

}catch(error){
  console.log(error)
}
}

const updateProduct=async()=>{
  try{
    const response=await fetch(`/api/products/update-product?id=${prdtId}&token=${user?.token}`,{
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formik.values),
  })
  const data=await response.json()
  if(data.status===200){
      createHistory({name:user?.firstname,title:productTitle,sku:productSku,productchange:"Updated the Product",time:new Date()})
      toast.success("Product Updated Successfully")
    }
    else{
      toast.error("Unable to Update Product")
    }
  
  }catch(error){
    console.log(error)
  }
  }

    
  const saveProduct=(values) => {
    formik.values.variants = variants
    if (getProductId !== "") {
      if(formik.values.title==="" || formik.values.handle==="" || formik.values.description==="" || formik.values.price==="" || formik.values.category==="" || formik.values.brand==="" || formik.values.state==="" || formik.values.sku==="" || formik.values.collectionName===""){
        toast.error("Required Fields are missing")
      }
      else{
        if(prdtId!==""){
          updateProduct()
        }
      }
     
    } else {
if(formik.values.title==="" || formik.values.handle==="" || formik.values.description==="" || formik.values.price==="" || formik.values.category==="" || formik.values.brand==="" || formik.values.state==="" || formik.values.sku==="" || formik.values.collectionName===""){
  toast.error("Required Fields are missing")
}
else{
  createProduct()
}
    }
  }
  const [variants, setVariants] = useState(productVariants || []);

  useEffect(() => {
    setVariants(productVariants || []);
  }, [productVariants]);

  const handleQuantityChange = (value, index) => {
    setVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index] = { ...updatedVariants[index], quantity: parseInt(value, 10) || 0 };
      return updatedVariants;
    });
  };



  const handleVariantChange = (index, field, value) => {
    if(getProductId!==""){
      if(user?.firstname==="parul"){
        setVariants((prevVariants) => {
          const updatedVariants = [...prevVariants];
          updatedVariants[index] = { ...updatedVariants[index], [field]: value };
          return updatedVariants;
        });
      }
    }
    else{
      setVariants((prevVariants) => {
        const updatedVariants = [...prevVariants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        return updatedVariants;
      });
    }
    
  };

  const handleAddVariant = () => {
    if(getProductId!==""){
      if(user?.firstname==="parul"){
    setVariants((prevVariants) => [...prevVariants, { color: "", size: "", quantity: 0 }]);


      }}
    else{
      setVariants((prevVariants) => [...prevVariants, { color: "", size: "", quantity: 0 }]);
    }
  };

  const handleDeleteVariant = (index) => {
    if(getProductId!==""){
      if(user?.firstname==="parul"){
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));

      }}
      else{
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));

      }

  };
  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = formik.values.images[dragIndex];
    const newImages = [...formik.values.images];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setCombinedImages(newImages)
  };


  const deleteImage =(publicId) => {
        const updatedImages = combinedImages.filter(
          (image) => image.public_id !== publicId
        );
        setCombinedImages(updatedImages)
  };



const deletedProduct=async()=>{
  try{
    const response=await fetch(`/api/products/delete-product?id=${prdtId}&token=${user?.token}`,{
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
  })
    const data=await response.json()
  if(data.status===200){
      createHistory({name:user?.firstname,title:productTitle,sku:productSku,productchange:"Delete the Product",time:new Date()})
      toast.success("Product Deleted Successfully")

    }
    else{
      toast.error("Unable to Delete Product")
    }
  
  }catch(error){
    console.log(error)
  }
}

  const deleteProduct = () => {
    if(prdtId!==""){
      deletedProduct()
    }
   
  };
  const duplicateProduct=()=>{
    const createProduct=async()=>{
      try{
        const response=await fetch(`/api/products/create-product?token=${user?.token}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `Copy of - ${productTitle}`,
            tags: productTags,
            state:"draft",
            handle:`${productHandle} -copy`,
            description: productDescription,
            price: productPrice,
            price1: productPrice1,
            category: productCategory,
            brand: productBrand,
            sku: productSku,
            images:combinedImages,
            collectionName: productCollectionName,
            collectionHandle:collectionHandle,
            variants: productVariants,
            metaDesc:`${metaDesc}-1`,
            metaTitle:`${metaTitle}-1`,
            metaDesc1:`${metaDesc1}-1`,
            metaTitle1:`${metaTitle1}-1`,
            metaDesc4:`${metaDesc4}-1`,
            metaTitle4:`${metaTitle4}-1`,
          }),
      })
        if(response.ok){
          createHistory({name:user?.firstname,title:productTitle,sku:productSku,productchange:"Duplicate the Product",time:new Date()})
          toast.success("Product Duplicated Successfully")

        }
        else{
          toast.error("Unable to Duplicate Product")
        }
      
      }catch(error){
        console.log(error)
      }
      }
      createProduct()
  }


const modifyCloudinaryUrl = (url) => {
  const urlParts = url?.split('/upload/');
  return urlParts && `${urlParts[0]}/upload/c_limit,h_1000,f_auto,q_auto/${urlParts[1]}`;
};

const handleUploadSuccess = (result) => {
  // Check if result.info is an array
  if (Array.isArray(result.info)) {
    // Create a new image object from the result
    const newImages = result.info.map((img) => ({
      public_id: img.public_id,
      url: img.secure_url,
      asset_id:img.asset_id,
    }));

    // Update the state with the new images
    setImgState((prevImages) => [...prevImages, ...newImages]);
  } else {
    // Handle the case where a single image is uploaded
    const newImage = {
      public_id: result.info.public_id,
      url: result.info.secure_url,
      asset_id:result.info.asset_id,
    };
    setImgState((prevImages) => [...prevImages, newImage]);
  }
};

const collectionOptions = collectionState && collectionState?.flatMap((collection) => {
  // Add parent collection as an option
  const parentOption = {
    value: collection?.title,
    label: collection?.title,
  };

  // Add sub-collections as options
  const subCollectionOptions = collection?.collections?.map(subCollection => ({
    value: subCollection?.title,
    label: `${collection?.title} > ${subCollection?.title}`, // Nested labeling for clarity
  }));

  return [parentOption, ...(subCollectionOptions || [])]; // Combine parent and sub-collections
});
const handleCollectionChange = (selectedOptions) => {
  const selectedCollections = selectedOptions?.map(option => option?.value);
  setproductCollectionName(selectedCollections)
};


  return (
    <div className={styles.singlep}>
      <div className={styles.mainImage} style={{display:main!==""?"block":'none'}}>
        <img src={modifyCloudinaryUrl(main)} alt="" />
        <p className={styles.close} onClick={()=>setMain("")}><IoMdClose/></p>
      </div>
      <div className={`${styles.back}`}>
        <div className={styles.del}>
        <p style={{ fontWeight: 500, fontSize: '22px' }}>{formik.values.title}</p>
        <div className={styles.buttons}>
          <button style={{display:getProductId!==""? "flex":"none"}} onClick={deleteProduct}>Delete</button>
          <button style={{display:getProductId!==""? "flex":"none"}} onClick={()=>window.open(`https://lebrra.com/products/${formik.values.handle}`, '_blank')}>View</button>
          <button style={{display:getProductId!==""? "flex":"none"}} onClick={duplicateProduct}>Duplicate</button>
          <button onClick={saveProduct}>Save</button>
        </div>
        </div>
      </div>
        <div className={styles.mains}>
          <div className={styles.left}>
            <div className={styles.basic}>

              <div className={styles.title}>
                <p>Title</p>
                <input type="text"
                  placeholder="Enter Product Title"
                  name="title"
                  onChange={(e)=>setproductTitle(e.target.value)}
                  value={formik.values.title} />
              </div>

              <div className={styles.title}>
                <p>Handle</p>
                <input type="text"
                  placeholder="Enter Product Handle"
                  name="handle"
                  onChange={(e)=>setproductHandle(e.target.value)}
                  value={formik.values.handle} />
              </div>
              <div className={styles.title}>
                <p>Price</p>
                <input
                  type="number"
                  placeholder="Enter Product Price"
                  name="price"
                  onChange={(e)=>setproductPrice(e.target.value)}
                  value={formik.values.price} />
              </div>
              <div className={styles.title}>
                <p>Chicoline Price</p>
                <input
                  type="number"
                  placeholder="Enter Chicoline Price"
                  name="price1"
                  onChange={(e)=>setproductPrice1(e.target.value)}
                  value={formik.values.price1} />
              </div>
              <div className={styles.desc}>
                <p>Description</p>
                <Editor
                editorStyle={{
                  height: "330px", // Set height for the editable area (slightly less than container)
                  overflowY: "auto",
                  scrollbarWidth:"thin"
                   // Enable scrolling inside the editable area
                }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ["inline", "blockType", "fontSize", "list", "textAlign", "link", "emoji", "history"],
          inline: { options: ["bold", "italic", "underline"] },
          list: { options: ["unordered", "ordered"] },
          textAlign: { options: ["left", "center", "right", "justify"] },
          link: { showOpenOptionOnHover: true },
        }}
      />
              </div>

            </div>

            <div className={styles.media}>
              <p>Media</p>
              <div className={styles.imgbox}>
    {combinedImages?.map((image, index) => (
      <Images
        key={image?.public_id}
        src={image?.url}
        id={image?.public_id}
        index={index}
        moveImage={moveImage}
        deleteImage={deleteImage}
      />
      
    ))}
   <CldUploadWidget
  signatureEndpoint="/api/upload/upload-img"
  onSuccess={handleUploadSuccess}
  onQueuesEnd={(result, { widget }) => {
    widget.close();
  }}
  options={{ multiple: true }}
>
  {({ open }) => {
    function handleOnClick() {
      // setImgState([]);
      open();
    }

    return (
      <button onClick={handleOnClick} className={styles.uploadBtn}>
        Upload Images
      </button>
    );
  }}
</CldUploadWidget>
  </div>

            </div>
            <div className={styles.variants}>
              <p>Variants</p>
              {variants.map((variant, index) => (
          <div className={styles.variant} key={index}>
            <input
              type="text"
              value={variant.color}
              onChange={(e) => handleVariantChange(index, "color", e.target.value)}
              placeholder="Color"
            />
            <input
              type="text"
              value={variant.size}
              onChange={(e) => handleVariantChange(index, "size", e.target.value)}
              placeholder="Size"
            />
            <input
              type="number"
              value={variant.quantity}
              onChange={(e) => handleVariantChange(index, "quantity", parseInt(e.target.value))}
              placeholder="Quantity"
            />
            <button type={styles.button} onClick={() => handleDeleteVariant(index)}>
              Delete
            </button>
          </div>
        ))}
        <button type={styles.button} onClick={handleAddVariant}>
          Add Variant
        </button>
      
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.status}>
              <p>Status</p>
              <select
                name="state"
                onChange={(e)=>setproductState(e.target.value)}
                value={formik.values.state}
                className={styles.formControl}
                id="">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className={styles.status}>
              <p>Is Featured</p>
              <select
                name="isFeatured"
                onChange={(e)=>setIsFeatured(e.target.value)}
                value={formik.values.isFeatured}
                className={styles.formControl}
                id="">
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
            <div className={styles.insights}>
              <div>
                <p>Insights</p>
                <p>Total Sale</p>
              </div>
              <p>{sold} items sold</p>
            </div>
            <div className={styles.pOrganization}>
              <p>Product Organization</p>
              <div className={styles.title}>
                <p>Product Category</p>
                <input type="text"
                  name="category"
                  onChange={(e)=>setproductCategory(e.target.value)}
                  value={formik.values.category}
                  className={styles.formControl}
                   />
              </div>
              <div className={styles.title}>
                <p>Brand</p>
                <input type="text"
                  placeholder="Enter Product Brand"
                  name="brand"
                  onChange={(e)=>setproductBrand(e.target.value)}
                  value={formik.values.brand} />
              </div>
              <div className={styles.title}>
                <p>Alt Text</p>
                <input type="text"
                  placeholder="Enter Images Alt"
                  name="alt"
                  onChange={(e)=>setproductAlt(e.target.value)}
                  value={formik.values.alt} />
              </div>
              <div className={styles.title}>
                <p>SKU</p>
                <input type="text"
                  placeholder="Enter Product SKU"
                  name="sku"
                  onChange={(e)=>setproductSku(e.target.value)}
                  value={formik.values.sku} />
              </div>
              <div className={styles.title}>
                <p>Collection</p>
                <Select
  isMulti
  name="collectionName"
  options={collectionOptions}
  className="basic-multi-select"
  classNamePrefix="select"
  onChange={handleCollectionChange}
  value={collectionOptions && collectionOptions?.filter(option => formik?.values?.collectionName?.includes(option?.value))}
/>
               
              </div>
              <div className={styles.title}>
                <p>Tags</p>
                <input type="text"
                  placeholder="Enter Product Tags"
                  name="tags"
                  onChange={(e)=>setproductTags(e.target.value)}
                  value={formik.values.tags} />
              </div>
              
            </div>
            <div className={styles.metaDetails}>
              <p>Lebrra Information</p>
            <div className={styles.title}>
                <p>Meta Title</p>
                <input type="text"
                  placeholder="Enter Meta Title"
                  name="metaTitle"
                  onChange={(e)=>setmetaTitle(e.target.value)}
                  value={formik.values.metaTitle} />
              </div>
              <div className={styles.title}>
                <p>Meta Description</p>
                <textarea type="text"
                  placeholder="Enter Meta Description"
                  name="metaDesc"
                  onChange={(e)=>setmetaDesc(e.target.value)}
                  value={formik.values.metaDesc} />
              </div>
            </div>
          </div>
        </div>
        <div className="submit">
        </div>

      
    </div>
  )
}

export default AddProduct