"use client"
import React,{useState} from 'react'
import styles from './trackorder.module.css'
import Link from 'next/link'
import toast from 'react-hot-toast'
const page = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [orders,setOrders]=useState([])

    const fetchOrdersByEmail = async (email) => {
      try {
        const response = await fetch(`/api/order/get-orders?email=${email}`, {
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
          setOrders(data.orders)
          setShow(true)
          return data.orders;
        } else {
          throw new Error(data.message || "No orders found.");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        alert(`An error occurred: ${error.message}`);
      }
    };
    
    // Usage Example    

    const trackOrder=()=>{
      if(email==="" || !email){
        toast.error("Please Provide a Valid Email")
      }
      else{
        fetchOrdersByEmail(email)
      }
    }
  return (
    <div className={styles.ordersPage}>
    <p className={styles.ordersHead}>Track Your Order</p>
    <div className={styles.emailField}>
      <input
        type="email"
        placeholder='Enter Your Email...'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={trackOrder}>Track</button>
    </div>
    {show && (
      <div>
        {orders ? (
          <div className={styles.allOrders}>
            {orders?.slice()?.reverse()?.map((item, index) => (
              <div className={styles.order} key={index}>
                <div className={styles.number}>
                  <p>Order No.</p>
                  <p>{item?.orderNumber}</p>
                </div>
                <div className={styles.items}>
                  {item?.orderItems?.map((items, indexes) => (
                    <div className={styles.item} key={indexes}>
                      <img src={items?.product?.images?.[0]?.url} alt="" />
                      <div className={styles.right}>
                        <p className={styles.name}>{items?.product?.title}</p>
                        <p className={styles.color}><span>Color:</span>{items?.color}</p>
                        <p className={styles.size}><span>Size:</span>{items?.size}</p>
                        <p className={styles.qty}><span>Qty:</span>{items?.quantity}</p>
                        <p className={styles.price}><span>Price:</span>Rs. {items?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.info}>
                  <ul>
                    <li>Name</li>
                    <li>Status</li>
                    <li>Date</li>
                    <li>Order Type</li>
                    <li>Subtotal</li>
                    <li>Shipping</li>
                    <li>Discount</li>
                    <li>Total</li>
                  </ul>
                  <ul>
                    <li>{item?.shippingInfo?.firstname}</li>
                    <li>{item?.orderStatus}</li>
                    <li>{new Date(item?.createdAt).toLocaleDateString()}</li>
                    <li>{item?.orderType}</li>
                    <li>Rs. {item?.totalPrice}</li>
                    <li>Rs. {item?.shippingCost}</li>
                    <li>Rs. {item?.discount}</li>
                    <li>Rs. {item?.finalAmount}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noData}>
            <img src="https://i.pinimg.com/originals/6f/fd/64/6ffd64c5366898c59bbc91d9aec935c3.png" alt="" />
            <p>{error ? "Sorry We don't have any data." : "Loading..."}</p>
            <p>Kindly check your email again.</p>
           <Link href="/"><button>SHOP NOW</button></Link>
          </div>
        )}
      </div>
    )}
  </div>
  )
}

export default page
