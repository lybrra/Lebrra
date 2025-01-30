const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var abondendSchema = new mongoose.Schema(
  {
    tag:{
      type:String,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    shippingInfo:{
      firstname:{
        type:String,
      },
      lastname:{
        type:String,
      },
      email:{
        type:String,
      },
      phone:{
        type:Number,
      },
      address:{
        type:String,
      },
      city:{
        type:String,
      },
      state:{
        type:String,
      },
      pincode:{
        type:Number,
      },
      mobile:{
        type:Number,
        // required:true
      },
    },
    orderItems:[{
      product:{
        type:mongoose.Schema.Types.ObjectId,
      ref:"Product",
      },
      color:{
        type:String,
      },
      size:{
        type:String,
      },
      quantity:{
        type:Number,
      },
      price:{
        type:Number,
      },
    }],
    month:{
      type:String,
      default:new Date().getMonth()
    },
    totalPrice:{
      type:Number,
    },
    shippingCost:{
      type:Number,
    },
    orderType:{
      type:String,
    },
    discount:{
      type:Number,
    },
    finalAmount:{
      type:Number,
    },
    isPartial:{
      type:Boolean
    },
    orderCalled:{
      type:String,
    },
  },
  {
    timestamps: true,
  }
);
abondendSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      const latestOrder = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
      let latestOrderNumber = 0;

      if (latestOrder && latestOrder.orderNumber) {
        latestOrderNumber = parseInt(latestOrder.orderNumber.replace(/[^\d]/g, ''), 10);
      }

      const tagPrefix = this.tag === "Lebrra" ? "VM000" : "RV000";
      const newOrderNumber = `${tagPrefix}${latestOrderNumber + 1}`;
      this.orderNumber = newOrderNumber;
    }
    next();
  } catch (error) {
    next(error);
  }
});

mongoose.models={}
export default mongoose.model("Abondend", abondendSchema);