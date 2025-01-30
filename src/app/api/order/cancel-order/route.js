import connectDb from "../../../../../config/connectDb";
import authMiddleware from "../../../../../controller/authController";
import Order from "../../../../../models/orderModel";
import Product from "../../../../../models/productModel";
export async function PUT(request){
    const {searchParams}=new URL(request.url)
    const id = searchParams.get("id")
    const token = searchParams.get("token")

    try {
        await connectDb()
        await authMiddleware(token)
      // Fetch the order
      const order = await Order.findById(id);
  
      if (!order) {
        return Response.json({ message: "Order not found" },{status:400});
      }
  
      // Retrieve order items
      const orderItems = order.orderItems;
  
      // Increase inventory for each order item
      for (const orderItem of orderItems) {
        const { product, color, size, quantity } = orderItem;
        const productId = product._id;
  
        // Find the product in the database
        const foundProduct = await Product.findById(productId);
  
        // Find the variant matching the color and size
        const variant = foundProduct.variants.find(
          (variant) => variant.color === color && variant.size === size
        );
  
        if (variant) {
          // Check if there is enough quantity available
            // Subtract the ordered quantity from the variant's quantity
            variant.quantity += quantity;
            foundProduct.sold -= quantity;
            await foundProduct.save();
  
        } else {
          console.error(`Variant not found for ${color} - ${size}`);
        }
      }
  
      // Update order type to 'Cancelled'
      order.orderType = 'Cancelled';
      await order.save();
  
      return Response.json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling order:", error);
      return Response.json({ message: "Server Error" },{status:500});
    }
  }