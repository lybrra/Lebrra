"use client"
import React, { useState,useEffect } from 'react'
import styles from  './home.module.css'
import { SlCalender } from "react-icons/sl";
import { IoBagHandleOutline } from "react-icons/io5";
import { usePathname, useRouter } from 'next/navigation';
// import {getOrders, getYearlyData,getTodayData,getYesterdayData,getWeekData,getCustomData, getLastData} from '../../features/auth/authSlice'


const Home = () => {
  const [maxData,setMaxData]=useState("Month")
  const [chartData,setChartData]=useState("Today")
  const [eventData,setEventData]=useState("Today")
  const router=useRouter()
  const pathname=usePathname()
  useEffect(()=>{
    const searchParams = new URLSearchParams();
    searchParams.set('pageName',"home");
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: true });
      },[])

  const maxDataChange=(e)=>{
    setMaxData(e.target.value)
  }

  const [totalCount1, setTotalCount1] = useState(0);
  const [totalCount2, setTotalCount2] = useState(0);
  const [totalCount3, setTotalCount3] = useState(0);
  const [totalCount4, setTotalCount4] = useState(0);
  const [totalCount5, setTotalCount5] = useState(0);
  const [totalCount6, setTotalCount6] = useState(0);

const [startDate,setStartDate]=useState()
const [ednDate,setEndDate]=useState()
//   const dispatch=useDispatch()
  const [monthlyDataState,setmonthlyDataState]=useState([])
  const [yearlyDataState,setyearlyDataState]=useState([])
  const [todayDataState,settodayDataState]=useState([])
  const [weekDataState,setweekDataState]=useState([])
  const [yesterdayDataState,setyesterdayDataState]=useState([])
  const [monthlyDataEvent,setmonthlyDataEvent]=useState([])
  const [yearlyDataEvent,setyearlyDataEvent]=useState([])
  const [todayDataEvent,settodayDataEvent]=useState([])
  const [weekDataEvent,setweekDataEvent]=useState([])
  const [yesterdayDataEvent,setyesterdayDataEvent]=useState([])
  const [customDataState,setcustomDataState]=useState([])
  const [orderState,setorderState]=useState([])
  useEffect(()=>{
    const getMonthlyData=async()=>{
        try{
            const response=await fetch('/api/order/getordersdata')
            const data=await response.json()
            if(response.ok){
                setmonthlyDataState(data.monthdata)
                setyearlyDataState(data.yeardata)
                setweekDataState(data.weekdata)
                setyesterdayDataState(data.yesterdaydata)
                settodayDataState(data.todaydata)

            }
            else{
                console.log("Unable to fetch minthly data")
            }
        }
        catch(err){
            console.log(err)
        }
    }
  const getDataEvents=async()=>{
    try{
        const response=await fetch('/api/chart/get-event')
        const data=await response.json()
        if(response.ok){
            setmonthlyDataEvent(data.monthdata)
            setyearlyDataEvent(data.yeardata)
            setweekDataEvent(data.weekdata)
            setyesterdayDataEvent(data.yesterdaydata)
            settodayDataEvent(data.todaydata)

        }
        else{
            console.log("Unable to fetch minthly data")
        }
    }
    catch(err){
        console.log(err)
    }
}
    const getOrders=async()=>{
      try{
          const response=await fetch('/api/user/getallorders?limit=10')
          const data=await response.json()
          if(response.ok){
              setorderState(data.orders)
          }
          else{
              console.log("Unable to fetch orders")
          }
      }
      catch(err){
          console.log(err)
      }
  }
  getMonthlyData()
getOrders()
getDataEvents()
  },[])

  useEffect(() => {
    // Function to count the total number of objects
    if(todayDataState && todayDataState.length>0){
      const countObjects = () => {
        let count = 0;
        todayDataState[0]?.items?.forEach((array) => {
          count += array.length; // Add the length of each array to the total count
        });
        setTotalCount5(count); // Update the state with the total count
      };
  
      countObjects();
    } // Call the function when the component mounts or arraysOfObjects changes
  }, [todayDataState]);
  useEffect(() => {
    // Function to count the total number of objects
    if(yearlyDataState && yearlyDataState.length>0){
      const countObjects = () => {
        let count = 0;
        yearlyDataState[0]?.items?.forEach((array) => {
          count += array.length; // Add the length of each array to the total count
        });
        setTotalCount4(count); // Update the state with the total count
      };
  
      countObjects();
    }
     // Call the function when the component mounts or arraysOfObjects changes
  }, [yearlyDataState]);
  useEffect(() => {
    // Function to count the total number of objects
    if(customDataState && customDataState.length>0){
      const countObjects = () => {
        let count = 0;
        customDataState[0]?.items?.forEach((array) => {
          count += array.length; // Add the length of each array to the total count
        });
        setTotalCount6(count); // Update the state with the total count
      };
  
      countObjects();
    }
     // Call the function when the component mounts or arraysOfObjects changes
  }, [customDataState]);
  useEffect(() => {
    // Function to count the total number of objects
    if(monthlyDataState && monthlyDataState.length>0){
      const countObjects = () => {
        let count = 0;
        monthlyDataState?.forEach((item) => {
          item?.items?.forEach((array)=>{
            count += array.length; // Add the length of each array to the total count

          })
        });
        setTotalCount3(count); // Update the state with the total count
      };
  
      countObjects();
    }
     // Call the function when the component mounts or arraysOfObjects changes
  }, [monthlyDataState]);
  useEffect(() => {
    // Function to count the total number of objects
    if(weekDataState && weekDataState.length>0){
      const countObjects = () => {
        let count = 0;
        weekDataState[0]?.items?.forEach((array) => {
          count += array.length; // Add the length of each array to the total count
        });
        setTotalCount2(count); // Update the state with the total count
      };
  
      countObjects();
    }
     // Call the function when the component mounts or arraysOfObjects changes
  }, [weekDataState]);
  useEffect(() => {
    // Function to count the total number of objects
    if(yesterdayDataState && yesterdayDataState.length>0){
      const countObjects = () => {
        let count = 0;
        yesterdayDataState[0]?.items?.forEach((array) => {
          count += array.length; // Add the length of each array to the total count
        });
        setTotalCount1(count); // Update the state with the total count
      };
  
      countObjects();
    }
     // Call the function when the component mounts or arraysOfObjects changes
  }, [yesterdayDataState]);
  const [tot,setTot]=useState()
  const [inc,setInc]=useState()
  const [ite,setIte]=useState()
useEffect(()=>{
setTot(yearlyDataState && yearlyDataState[0]?.count)
setInc(yearlyDataState && yearlyDataState[0]?.amount)
setIte(totalCount4 )
},[yearlyDataState,totalCount4])
const customDateGet=async()=>{
        try{
            const response=await fetch(`/api/order/getordersdata/getcustomdata?startDate=${startDate}&endDate=${ednDate}`)
            const data=await response.json()
            if(response.ok){
                setcustomDataState(data)

            }
            else{
                console.log("Unable to fetch minthly data")
            }
        }
        catch(err){
            console.log(err)
        }
}
   

useEffect(()=>{
  setTot(customDataState && customDataState[0]?.totalCount)
  setInc(customDataState && customDataState[0]?.totalIncome)
  setIte(totalCount6)
},[customDataState,totalCount6])
const [m1,setM1]=useState(0)
const [m2,setM2]=useState(0)

useEffect(()=>{
let m3=0
let m4=0
monthlyDataState && monthlyDataState?.map((item)=>{
m3+=item?.count
m4+=item?.amount
})
setM1(m3)
setM2(m4)
},[monthlyDataState])
  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <div className={styles.total}>
          <div className={styles.dataDiv}>
          <div>
          <SlCalender className={styles.topIcon} />
          <p className={styles.data}>Today Data</p>
          </div>
          </div>
          <div className={styles.flexy}>
            <div>
                <p>Orders</p>
                <p><span>{todayDataState && todayDataState[0]?.totalCount}</span></p>
            </div>
            <div>
                <p>Income</p>
                <p>&#8377;<span>{Math.floor(todayDataState && todayDataState[0]?.totalIncome)}</span></p>
            </div>
            <div>
                <p>Items</p>
                <p><span>{totalCount5}</span></p>
            </div>
          </div>
         </div>
         <div className={styles.total}>
          <div className={styles.dataDiv}>
         <div> <IoBagHandleOutline className={styles.topIcon} />
          <p className={styles.data}>{maxData} Data</p></div>
            <select name="" id="" className={styles.select} value={maxData} onChange={maxDataChange}>
              <option value="Yesterday">Yesterday</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
              <option value="Year">This Year</option>
            </select>
            
          </div>
          <div className={styles.flexy}>
            <div>
                <p>Orders</p>
                <p><span>{
                  maxData==="Month"?monthlyDataState && m1
                  :
                  maxData==="Year"?yearlyDataState && yearlyDataState[0]?.count
                  :
                  maxData==="Week"?weekDataState && weekDataState[0]?.totalCount
                  :
                yesterdayDataState && yesterdayDataState[0]?.totalCount
                  
                  }</span></p>
            </div>
            <div>
                <p>Income</p>
                <p>&#8377;<span>{
                  maxData==="Month"?monthlyDataState && Math.floor(m2)
                  :
                  maxData==="Year"?yearlyDataState && Math.floor(yearlyDataState[0]?.amount)
                  :
                  maxData==="Week"?weekDataState && Math.floor(weekDataState[0]?.totalIncome)
                  :
                yesterdayDataState && Math.floor(yesterdayDataState[0]?.totalIncome)
                  
                  }</span></p>
            </div>
            <div>
                <p>Items</p>
                <p><span>{
                  
                    maxData==="Month"?totalCount3
                    :
                    maxData==="Year"?totalCount4
                    :
                    maxData==="Week"?totalCount2
                    :
                  totalCount1
                    
                    
                  }</span></p>
            </div>
          </div>
         </div>
         <div className={styles.total}>
          <div className={styles.dataDiv}>
         <div> <IoBagHandleOutline className={styles.topIcon} />
          </div>
            <div className={styles.custom}>
              <input type="date" name="" id="" onChange={(e)=>setStartDate(e.target.value)}/>
              <input type="date" name="" id="" onChange={(e)=>setEndDate(e.target.value)}/>

            </div>
            <button onClick={customDateGet}>Apply</button>
            
          </div>
          <div className={styles.flexy}>
            <div>
                <p>Orders</p>
                <p><span>{

tot
                  
                  }</span></p>
            </div>
            <div>
                <p>Income</p>
                <p>&#8377;<span>{

Math.floor(inc)

                  }</span></p>
            </div>
            <div>
                <p>Items</p>
                <p><span>{
                  
ite
                    
                    
                  }</span></p>
            </div>
          </div>
         </div>



      </div>
      <div className={styles.bottom}>
        <div className={styles.chart}>
          <div className={styles.leftChart}>
            <div className={styles.chartHead}>
              <p>Events Data</p>
              <select name="" id="" value={eventData} onChange={(e)=>setEventData(e.target.value)}>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
              </div>
            <div className={styles.chartBody}>
            <div className={styles.cities}>
              <p>Events</p>
                  <div>
                    {
                      eventData==="Today"?
                      todayDataEvent?.map((item,index)=>{
                        return <p key={index}>
                          <span>{item?.event}</span>
                          <span>{item?.users}</span>
                        </p>
                      })
                      :
                      eventData==="Yesterday"?
                      yesterdayDataEvent?.map((item,index)=>{
                        return <p key={index}>
                          <span>{item?.event}</span>
                          <span>{item?.users}</span>
                        </p>
                      })
                      :
                      eventData==="Week"?
                      weekDataEvent?.map((item,index)=>{
                        return <p key={index}>
                          <span>{item?.event}</span>
                          <span>{item?.users}</span>
                        </p>
                      })
                      :
                      eventData==="Month"?
                      monthlyDataEvent?.map((item,index)=>{
                        return <p key={index}>
                          <span>{item?.event}</span>
                          <span>{item?.users}</span>
                        </p>
                      })
                      :
                      eventData==="Year"?
                      yearlyDataEvent?.map((item,index)=>{
                        return <p key={index}>
                          <span>{item?.event}</span>
                          <span>{item?.users}</span>
                        </p>
                      })
                      :
                      <p>No Data</p>
                    }
                    
                  </div>
            </div>
            </div>
            
          </div>

        </div>
        <div className={styles.orders}>
          <p className={styles.heading}>Recent Orders</p>
          <div className={styles.table}>
            <table>
              <tbody>
            {
 orderState?.slice(Math.max(orderState?.length - 10, 0))?.reverse()?.map((item, index) => {
    return (
      <tr key={index}>
        <td><p>{item?.shippingInfo?.firstname}</p></td>
        <td><p>{item?.orderType}</p></td>
        <td>&#8377; {item?.finalAmount}</td>
        <td><p>{item?.orderItems?.length} items</p></td>
      </tr>
    );
  })
}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
