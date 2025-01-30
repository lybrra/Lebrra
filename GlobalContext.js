// GlobalContext.js
import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [myCarts, setMyCart] = useState([]);
  const [prdtOpens,setPrdtOpens]=useState(false)
  const [isApiCalled,setIsApiCalled]=useState(false)
  const [editOrderOpen,seteditOrderOpen]=useState(false)
  const [category,setCategory]=useState("")

  return (
    <GlobalContext.Provider value={{ myCarts, setMyCart,prdtOpens,setPrdtOpens,editOrderOpen,seteditOrderOpen,category,setCategory,isApiCalled,setIsApiCalled }} >
      {children}
    </GlobalContext.Provider>
  );
};
