"use client";
import React, { useState,useEffect } from "react";
import styles from "../src/app/collections/[cid]/collections.module.css";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useSearchParams, useRouter, usePathname } from "next/navigation";
import LoadingBar from "react-top-loading-bar"; // Import LoadingBar
import ProductCard from "./ProductCard";

const SearchProducts = ({data,collectionName}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sortOpen, setSortOpen] = useState(false);
  const [filter,setFilter]=useState(data?.filter)
  const [size, setSize] = useState("")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [color, setColor] = useState("")
  const [brand, setBrand] = useState("")

  const [progress, setProgress] = useState(0); // Progress state for LoadingBar

  const page = parseInt(searchParams.get("page") || "1");
  useEffect(()=>{
    setBrand(searchParams.get("brand"))
    setColor(searchParams.get("color"))
    setSize(searchParams.get("size"))
    setSearch(searchParams.get("search"))
    setSort(searchParams.get("sort") || "-createdAt")

  },[])

  const updateURL = (updatedParams) => {
    const params = new URLSearchParams();

    // Merge existing and new parameters
    if (updatedParams.page) params.set("page", updatedParams.page);
    if (updatedParams.search) params.set("search", updatedParams.search);
    if (updatedParams.size) params.set("size", updatedParams.size);
    if (updatedParams.color) params.set("color", updatedParams.color);
    if (updatedParams.brand) params.set("brand", updatedParams.brand);
    if(updatedParams.sort) params.set("sort",updatedParams.sort)

    // Push the updated URL without reloading
    setProgress(30);

    // Push the updated URL without reloading
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
    setTimeout(() => setProgress(100), 700);
  };
  const handlePageChange = (event, value) => {
    updateURL({ page: value,sort,size,color,brand,search });
  };


  const applyFilter=()=>{
    updateURL({page:1,sort,size,color,brand,search})
  }
  const clearFilter = () => {
    setBrand("");
    setColor("");
    setSort("");
    setSize("");
    setSearch(search)
      updateURL({ page:1, sort: "", size: "", color: "", brand: "" ,search:search});

  };


  const toggleBrand=(brands)=>{
    if(brand===brands){
      setBrand("")
    }
    else{
      setBrand(brands)
    }
  }
  const toggleColor=(colors)=>{
    if(color===colors){
      setColor("")
    }
    else{
      setColor(colors)
    }
  }
  const toggleSize=(sizes)=>{
    if(size===sizes){
      setSize("")
    }
    else{
      setSize(sizes)
    }
  }

  // Connect to MongoDB and fetch products

  const filterToggle = () => {
    setSortOpen((prev) => !prev);
  };
  return (
    <div className={styles.collections}>
    <LoadingBar
    color="var(--primary-color)"
    progress={progress}
    onLoaderFinished={() => setProgress(0)}
  />
    <div className={styles.overlay} style={{display:sortOpen?"block":"none"}}></div>
  <h1>{collectionName}</h1>
  <div className={styles.sortBtn}>
    <p onClick={filterToggle}><span>Sort & Filter</span> <span><CiFilter/></span></p>
  </div>

  <div className={styles.collectionProducts}>
    <div className={styles.sort} style={{bottom:sortOpen?0:"-100%"}}>
        <p className={styles.sortName}><span>Sort & Filter</span><span onClick={filterToggle}><IoMdClose/></span></p>
        <div className={styles.sortBtns}>
            <button onClick={clearFilter}>Clear All</button>
            <button onClick={applyFilter}>Apply</button>
        </div>
        <div className={styles.sortBy}>
          <p>Sort By</p>
            <select name="" id="" value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value="-createdAt">Releavance</option>
                <option value="price">Price (Low to High)</option>
                <option value="-price">Price (High to Low)</option>
                <option value="sold">Most Selling</option>
                <option value="-sold">Least Selling</option>
                <option value="-title">Title (Z to A)</option>
                <option value="title">Title (A to Z)</option>
            </select>
        </div>
        <p className={styles.sortName}>Filter By</p>
        <div className={styles.chooseBrand}>
            <div>
                <p>Brand</p>
                <p>+</p>
            </div>
            <ul>
                {
                    data && data?.filters?.brands?.map((item,index)=>{
                        return <li key={index} onClick={(e)=>toggleBrand(item)} style={{color:brand===item?"var(--primary-color)":"black",border:brand===item?"1px solid var(--primary-color)":"1px solid rgb(202, 202, 202)"}}>{item}</li>
                    })
                }

            </ul>
        </div>
        <div className={styles.chooseBrand}>
            <div>
                <p>Size</p>
                <p>+</p>
            </div>
            <ul>
            {
                    data && data?.filters?.sizes?.map((item,index)=>{
                        return <li key={index} onClick={(e)=>toggleSize(item)} style={{color:size===item?"var(--primary-color)":"black",border:size===item?"1px solid var(--primary-color)":"1px solid rgb(202, 202, 202)"}}>{item}</li>
                    })
                }
            </ul>
        </div><div className={styles.chooseBrand}>
            <div>
                <p>Colour</p>
                <p>+</p>
            </div>
            <ul>
            {
                    data && data?.filters?.colors?.map((item,index)=>{
                        return <li key={index} onClick={(e)=>toggleColor(item)} style={{color:color===item?"var(--primary-color)":"black",border:color===item?"1px solid var(--primary-color)":"1px solid rgb(202, 202, 202)"}}>{item}</li>
                    })
                }
            </ul>
        </div>
    </div>
    {
      data && data?.products?.length>0?
      <div className={styles.collectionPrdts}>
      <div className={styles.allPrdts}>
          {
              data?.products && data?.products.map((item,index)=>{
                  return <ProductCard key={index} item={item}/>
              })
          }
          
      </div>
      <div className={styles.pagination}>
      <Stack spacing={2}>
            <Pagination count={data?.pagination?.totalPages} page={page} onChange={handlePageChange}/></Stack>
      </div>
  </div>
  :
  <div className={styles.noData}>
  <p>No Products Found</p>
  <button onClick={clearFilter}>Clear Filter</button>
</div>
    }
   

  </div>
</div>
  )
}

export default SearchProducts
