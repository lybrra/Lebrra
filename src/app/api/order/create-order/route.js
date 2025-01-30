import sendEmail from "../../../../../controller/emailController"; // Update this path as per your setup
import Product from "../../../../../models/productModel"; // Your Product model
import Order from "../../../../../models/orderModel"; // Your Order model
import User from "../../../../../models/userModel"; // Your User model
import connectDb from "../../../../../config/connectDb";
// Function to update inventory after order creation
const processOrder = async (orderItems) => {
  try {
    // Iterate through each order item
    for (const orderItem of orderItems) {
      const { product, color, size, quantity } = orderItem;
      const productId = product;

      // Find the product in the database
      const foundProduct = await Product.findById(productId);

      // Find the variant matching the color and size
      const variant = foundProduct.variants.find(
        (variant) => variant.color === color && variant.size === size
      );

      if (variant) {
        // Check if there is enough quantity available
        if (variant.quantity >= quantity) {
          // Subtract the ordered quantity from the variant's quantity
          variant.quantity -= quantity;
          foundProduct.sold += quantity;
          await foundProduct.save();
        } else {
          throw new Error(`Not enough quantity available for ${color} - ${size}`);
        }
      } else {
        throw new Error(`Variant not found for ${color} - ${size}`);
      }
    }
    console.log("Inventory updated successfully");
  } catch (error) {
    console.error("Error updating inventory:", error.message);
  }
};

// Function to send email after 3 hours
const msgAfter3hour = async (firstname, ordernumber, email) => {
  await sendEmail({
    to: email,
    subject: "Tracking Details: Your Order is in Process!",
    text: "Tracking Details: Your Order is in Process!",
    htmlContent: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #333333; }
            p { color: #555555; }
            .order-details { margin-top: 20px; }
            .order-details p { margin: 5px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dddddd; font-size: 12px; color: #999999; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Tracking Details: Your Order is in Process!</h2>
            <p>Dear ${firstname},</p>

            <div class="order-details">
                <p><strong>Your Order Number is:</strong> #${ordernumber}</p>
                <p>Once your order is on its way, we'll promptly send you a tracking link for easy monitoring of its dispatch from our side.</p>
            </div>

            <p>Thank you for choosing <strong>Lebrra.com</strong> for your shopping needs!</p>

            <div class="footer">
                <p>&copy; 2024 Lebrra. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `
  });
};


const validateOrderPricesAndAmounts = async (orderItems, totalPrice, finalAmount, discount, shippingCost) => {
  try {
    let calculatedTotalPrice = 0;

    for (const orderItem of orderItems) {
      const { product, quantity, price: price } = orderItem;
      const productId = product;

      // Fetch product details from the database
      const foundProduct = await Product.findById(productId);

      if (!foundProduct) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Compare individual product prices
      if (foundProduct.price !== price) {
        throw new Error(
          `Price mismatch for product ${foundProduct.title}. Expected: ₹${foundProduct.price}, Received: ₹${price}`
        );
      }

      // Calculate the total price
      calculatedTotalPrice += foundProduct.price * quantity;

      // Optional: Validate inventory (as per your earlier logic)
      const variant = foundProduct.variants.find(
        (variant) =>
          variant.color === orderItem.color && variant.size === orderItem.size
      );

      if (!variant) {
        throw new Error(`Variant not found for color: ${orderItem.color}, size: ${orderItem.size}`);
      }

      if (variant.quantity < quantity) {
        throw new Error(`Not enough quantity available for ${orderItem.color} - ${orderItem.size}`);
      }
    }

    // Validate total price
    if (calculatedTotalPrice !== totalPrice) {
      throw new Error(
        `Total price mismatch. Expected: ₹${calculatedTotalPrice}, Received: ₹${totalPrice}`
      );
    }

    // Calculate the expected final amount
    const expectedFinalAmount = calculatedTotalPrice - discount + shippingCost;

    // Validate final amount
    if (expectedFinalAmount !== finalAmount) {
      throw new Error(
        `Final amount mismatch. Expected: ₹${expectedFinalAmount}, Received: ₹${finalAmount}`
      );
    }

    console.log("All prices and amounts validated successfully");
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function POST(req,res){
  const body = await req.text(); // Read the raw body as a string
  const parsedBody = JSON.parse(body); // Parse the string as JSON

  const { shippingInfo, orderItems, totalPrice, finalAmount, shippingCost, orderType, discount, paymentInfo, tag, isPartial } = parsedBody;
  try {
    await connectDb()

    await validateOrderPricesAndAmounts(orderItems, totalPrice, finalAmount, discount, shippingCost);

    for (const orderItem of orderItems) {
      const { product, color, size, quantity } = orderItem;
      const productId = product;

      // Find the product in the database
      const foundProduct = await Product.findById(productId);

      if (!foundProduct) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Find the variant matching the color and size
      const variant = foundProduct.variants.find(
        (variant) => variant.color === color && variant.size === size
      );

      if (!variant) {
        throw new Error(`Variant not found for ${color} - ${size}`);
      }

      // Check if there is enough quantity available
      if (variant.quantity < quantity) {
        throw new Error(`Not enough quantity available for ${color} - ${size}`);
      }
    }

    // If inventory is sufficient, create the order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      finalAmount,
      shippingCost,
      orderType,
      discount,
      paymentInfo,
      tag,
      isPartial
    });
    const order1=await Order.findById(order._id).populate("orderItems.product")
    if (tag === 'Lebrra') {
      const orderItemsString = order1?.orderItems.map((item) => {
        return `Name: ${item.product.title}, Color: ${item.color || ""}, Size: ${item.size || ""}`;
      }).join('\n');
      
      await sendEmail({
        to: `${shippingInfo.email}`,
        subject: "Confirmation: Your Order is in Process!",
        text: "Confirmation: Your Order is in Process!",
        htmlContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                h2 { color: #333333; }
                p { color: #555555; }
                .order-details { margin-top: 20px; }
                .order-details p { margin: 5px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dddddd; font-size: 12px; color: #999999; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Confirmation: Your Order is in Process!</h2>
                <p>Dear ${shippingInfo.firstname},</p>
                <p>We've successfully received your order with the following details:</p>

                <div class="order-details">
                    <p><strong>Order Number:</strong> #${order.orderNumber}</p>
                    <p><strong>Total Amount:</strong> ₹${finalAmount}</p>
                    <p><strong>Order Items:</strong> ${orderItemsString}</p>
                    <p><strong>Payment Method:</strong> ${orderType}</p>
                    <p><strong>Shipping Address:</strong> ${shippingInfo.address} ${shippingInfo.city} ${shippingInfo.state} ${shippingInfo.pincode}</p>
                    <p><strong>Anticipated Delivery Date:</strong> Within 3 to 5 working days.</p>
                </div>

                <p>Thank you for choosing <strong>Lebrra.com</strong> for your shopping needs!</p>

                <div class="footer">
                    <p>&copy; 2024 Lebrra. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
      });
    }

    const { firstname, lastname, email, phone, address } = shippingInfo;

    // Check if the user already exists
    let user = await User.findOne({ email });

    // If the user doesn't exist, create a new user
    if (!user) {
      user = await User.create({
        email,
        firstname,
        lastname,
        mobile: phone,
        address
      });
    }

    // Update the inventory
    await processOrder(orderItems);

    // Schedule a message after 3 hours
    setTimeout(() => {
      msgAfter3hour(shippingInfo.firstname, order.orderNumber, shippingInfo.email);
    }, 10800000); // 3 hours in milliseconds

  
    
    return Response.json(
      { success: true, status: "Order Created",amount:order.finalAmount,firstname:order.shippingInfo.firstname,orderNumber:order.orderNumber },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Creating Order:", error.message);
    return Response.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
};

