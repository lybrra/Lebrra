"use client"
import React, { useContext, useEffect, useState } from 'react'
import styles from '../../src/app/lebrra-admin/admin.module.css'
import { IoSearch } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import Products from './products/Products';
import Orders from './orders/Orders';
import Home from './home/Home';
import LoadingBar from "react-top-loading-bar"; // Import LoadingBar
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { GlobalContext } from '../../GlobalContext';
import Category from './category/Category';
import Abandoned from './abandoneds/Abandoned';
import Banners from './banners/Banners';
import Coupons from './coupons/Coupons';
import { IoIosEyeOff,IoMdClose,IoMdEye } from "react-icons/io";
import toast from 'react-hot-toast';
import Image from 'next/image';

const Admin = () => {
    const {setCategory,setPrdtOpens}=useContext(GlobalContext)
const [ham,setHam]=useState(false)
const [menu,setMenu]=useState("home")
const [searchBar,setSearchBar]=useState(false)
const [searchValue,setSearchValue]=useState("")
const [searchItems,setSearchItems]=useState(null)
const [searchLoad,setSearchLoad]=useState(true)
  const [progress, setProgress] = useState(0); // Progress state for LoadingBar
const router=useRouter()
const pathname=usePathname()
const toggleHam=()=>{
    setHam((prev)=>!prev)
}

const updateURL = () => {
    // Create a new URLSearchParams object from the current URL's search parameters
    const searchParams = new URLSearchParams(window.location.search);
    // Remove the 'page' and 'state' parameters from the searchParams
    searchParams.delete('page');
    searchParams.delete('state');
    searchParams.delete('prdt');
    // Update the URL using router.push with the modified search parameters
    router.push(`${pathname}?${searchParams.toString()}`, undefined, { scroll: true });
    // Optionally, use a setTimeout for any other actions after the URL update
    setTimeout(() => setProgress(100), 500);
  };;

const menuToggle=(menuVal)=>{
    setMenu(menuVal)
    setHam(false)
    updateURL()
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('pageName',menuVal);
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
    
}

const [login,setLogin]=useState(false)
const [show,setShow]=useState(false)
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [user,setUser]=useState("")
// Change password modal state
const [showChangePwd,setShowChangePwd]=useState(false)
const [showPwd,setShowPwd]=useState(false)
const [currentPassword,setCurrentPassword]=useState("")
const [newPassword,setNewPassword]=useState("")
const [confirmNewPassword,setConfirmNewPassword]=useState("")
useEffect(()=>{
    const user1=JSON.parse(localStorage.getItem("user"))
if(user1){
    setUser(user1)
}
else{
    setUser("")
}

},[])
useEffect(()=>{
    if(user===""){
        setLogin(true)
    }
    else if(user && user?.token!==""){
setLogin(false)
    }
    else{
        console.log("no token")
        setLogin(true)

    }
},[user])

const loginForm=async()=>{
    if(email==="" || password===""){
        toast.error("Please Fill Details Correct")
    }
    else{
try{
    const response=await fetch("/api/user/admin-login",{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({email:email,password:password})
    })
    const data=await response.json()
    if(response.ok){
        localStorage.setItem("user",JSON.stringify(data))
        toast.success("Login Successfully")
        setUser(data)
    }
    else{
        toast.error("Login Failed")
    }
}
catch(err){
    toast.error("Login Failed")
}
    }
}

const logoutClick=()=>{
    localStorage.removeItem("user")
    setUser("")
}

const handleChangePassword = async () => {
    try{
        if(currentPassword==="" || newPassword==="" || confirmNewPassword===""){
            toast.error("Please fill all fields")
            return
        }
        if(newPassword.length < 6){
            toast.error("New password must be at least 6 characters")
            return
        }
        if(newPassword !== confirmNewPassword){
            toast.error("Passwords do not match")
            return
        }
        const token=user?.token
        if(!token){
            toast.error("Not authorized. Please login again.")
            return
        }
        const res=await fetch(`/api/user/change-password?token=${token}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({currentPassword,newPassword,confirmNewPassword})
        })
        const data = await res.json()
        if(res.ok){
            toast.success("Password updated. Please login again.")
            // reset and logout
            setShowChangePwd(false)
            setCurrentPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
            localStorage.removeItem("user")
            setUser("")
            setLogin(true)
        }
        else{
            toast.error(data?.message || "Failed to update password")
        }
    }catch(err){
        toast.error("Something went wrong")
    }
}


const searchOpen=async()=>{
    if(searchValue!==""){
        try{
            setSearchLoad(true)
            const response=await fetch(`/api/products/search?search=${searchValue}&limit=50`)
            const data=await response.json()
            console.log(data)
            if(data.success){
                setSearchItems(data.products)
                setSearchLoad(false)
                setSearchBar(true)
            }
            else{
                setSearchItems(null)
                setSearchLoad(false)
                setSearchBar(true)
            }

        }catch(err){
            console.log("Error fetching products")
        }
    }
}
const handleonKeyDown=async(event)=>{
        if (event.key === 'Enter' && searchValue!=="") {
            try{
                setSearchLoad(true)
                const response=await fetch(`/api/products/search?search=${searchValue}&limit=50`)
                const data=await response.json()
                console.log(data)
                if(data.success){
                    setSearchItems(data.products)
                    setSearchLoad(false)
                    setSearchBar(true)
                }
                else{
                    setSearchItems(null)
                    setSearchLoad(false)
                    setSearchBar(true)
                }
    
            }catch(err){
                console.log("Error fetching products")
            }
        }
}
const clearSearch=()=>{
    setSearchLoad(false)
    setSearchItems(null)
    setSearchBar(false)
    setSearchValue("")
}

const searchItemClick=(val)=>{
    setMenu("products")
    setHam(false)
    setSearchLoad(false)
    setSearchItems(null)
    setSearchBar(false)
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('prdt',val);
    searchParams.set('pageName',"products");

    setPrdtOpens(true)
    // Update the URL using router.push with the modified search parameters
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
}
const overlayClick=()=>{
    setHam(false)
    setSearchLoad(false)
    setSearchItems(null)
    setSearchBar(false)
    setSearchValue("")
}
const searchParams=useSearchParams()
const pageName=searchParams.get("pageName") || ""
const [currentPage,setCurrentPage]=useState(pageName)
useEffect(()=>{
    setCurrentPage(pageName)
},[pageName])

  const [collectionState,setcollectionState] = useState([])
    useEffect(() => {
      const getCollections=async()=>{
        try{
            const response=await fetch(`/api/collection/getallcollections`)
            const data=await response.json()
            if(response.ok){
              setcollectionState(data);
            }
            else{
                console.log("Unable to fetch collections")
            }
        }
        catch(err){
            console.log(err)
        }
    }
    getCollections()
  }, []);

  return (
    <div className={styles.admin}>
        <LoadingBar
    color="var(--primary-color)"
    progress={progress}
    onLoaderFinished={() => setProgress(0)}
    
  />
  {
    login?
    <div className={styles.loginPage}>
            <div className={styles.loginForm}>
                <p style={{textAlign:"center",fontSize:'20px',fontWeight:500,letterSpacing:'1px',marginBottom:"15px",color:'black'}}>Hello Admin 👋</p>
                <div>
                <input type="email" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                
                <div>
                <input type={show?"text":"password"} placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <IoIosEyeOff style={{display:show?"flex":"none"}} className={styles.eyeIcon} onClick={(e)=>setShow(false)}/>
                <IoMdEye style={{display:show?"none":"flex"}} className={styles.eyeIcon} onClick={(e)=>setShow(true)}/>
                </div>
                <button onClick={loginForm}>LOGIN</button>
            </div>
        </div>
        :
        <div className={styles.adminBody}>
            <div className={styles.overlay} style={{display:(ham || searchBar)?"block":"none"}} onClick={overlayClick}></div>
            <div className={styles.adminLeft}>
<p onClick={toggleHam} style={{color:"black"}}><RxHamburgerMenu/></p>
<div className={styles.search}>
                        <input type="text"  placeholder='Search For Products...' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} onKeyDown={handleonKeyDown}/>
                        {
                            searchBar?
                            <button onClick={clearSearch}><IoMdClose/></button>
:
<button onClick={searchOpen}><IoSearch/></button>

                        }
                        <div className={styles.searchOptions} style={{display:searchBar?"grid":"none"}}>
                            {
                                (searchItems?.length===0 || searchItems===null)?
                                <p className={styles.noItem}>{
                                    (searchItems?.length===0 || searchItems===null)?
                                    "No Items...":
                                    searchLoad?
                                    "Loading....":
                                    ""
                                    }</p>
                                    :
                                    <div className={styles.searchItems}>
                                        {
                                            searchItems?.map((item,index)=>{
                                                return <div className={styles.searchItem} key={index} onClick={()=>searchItemClick(item?._id)}>
                                                <Image src={item?.images[0]?.url || item?.images[1]?.url} alt={item?.title} width={200} height={100} style={{width:"50%",height:"auto"}}/>
                                                <p>{item?.sku}</p>
                                                <p>{item?.title}</p>
                                            </div>
                                            })
                                        }
                                    
                                </div>


                            }
                           
                           
                        </div>
                    </div>
                    <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                    <button onClick={logoutClick}>Logout</button>
                    <button onClick={()=>setShowChangePwd(true)}>Change Password</button>
                    </div>

                <div className={styles.adminMenu} style={{left:ham?0:"-100%"}}>
                    <ul>
                        <li onClick={(e)=>menuToggle("home")}>Home</li>
                        <li onClick={(e)=>menuToggle("orders")}>Orders</li>
                        <li onClick={(e)=>menuToggle("products")}>Products</li>
                        <li onClick={(e)=>menuToggle("collection")}>Collections</li>
                        <li onClick={(e)=>menuToggle("abandoned")}>Abandoneds</li>
                        <li onClick={(e)=>menuToggle("coupon")}>Coupons</li>
                        <li onClick={(e)=>menuToggle("blogs")}>Blogs</li>
                        <li onClick={(e)=>menuToggle("banners")}>Banners</li>
                    </ul>
                </div>
            </div>
            <div className={styles.adminRight}>
{

    currentPage==="products"?
    <Products collectionState={collectionState}/>
    :currentPage==="orders"?
    <Orders/>
    :currentPage==="collection"?
    <Category collections={collectionState}/>
    :currentPage==="abandoned"?
    <Abandoned/>
    :currentPage==="banners"?
    <Banners/>
    :currentPage==="coupon"?
    <Coupons/>
    :currentPage==="home"?
    <Home/>
    :
    <Home/>
}
            </div>
        </div>
  }
        {/* Change Password Modal */}
        <div className={styles.loginPage} style={{display:showChangePwd?"flex":"none", position:"fixed", top:0, left:0, width:"100vw", height:"100vh", zIndex:3}}>
            <div className={styles.loginForm}>
                <p style={{textAlign:"center",fontSize:'18px',fontWeight:600,letterSpacing:'0.5px',marginBottom:"15px",color:'black'}}>Change Password</p>
                <div>
                    <input type={showPwd?"text":"password"} placeholder='Current Password' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
                    <IoIosEyeOff style={{display:show?"flex":"none"}} className={styles.eyeIcon} onClick={(e)=>setShowPwd(false)}/>
                    <IoMdEye style={{display:show?"none":"flex"}} className={styles.eyeIcon} onClick={(e)=>setShowPwd(true)}/>
                </div>
                <div>
                    <input type={showPwd?"text":"password"} placeholder='New Password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                    <IoIosEyeOff style={{display:show?"flex":"none"}} className={styles.eyeIcon} onClick={(e)=>setShowPwd(false)}/>
                    <IoMdEye style={{display:show?"none":"flex"}} className={styles.eyeIcon} onClick={(e)=>setShowPwd(true)}/>
                </div>
                <div>
                    <input type={showPwd?"text":"password"} placeholder='Confirm New Password' value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} />
                    <IoIosEyeOff style={{display:show?"flex":"none"}} className={styles.eyeIcon} onClick={(e)=>setShowPwd(false)}/>
                    <IoMdEye style={{display:show?"none":"flex"}} className={styles.eyeIcon} onClick={(e)=>setShowPwd(true)}/>
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                <button onClick={handleChangePassword}>Update</button>
                <button onClick={()=>setShowChangePwd(false)} style={{backgroundColor:'#777'}}>Cancel</button>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Admin
