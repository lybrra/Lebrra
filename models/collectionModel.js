const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var collectionSchema = new mongoose.Schema(
  {
  title:{
    type:String,
},
category:{
  type:String,
},
banner:[

],
metaTitle:{
    type:String,
},
metaDesc:{
    type:String,
},
isFeatured:{
  type:Boolean,
  default:false,
},
handle:{
  type:String,
  unique: true,
  sparse: true,
  lowercase: true,
},
order:{
  type:Number,
},
desc:{
  type:String,
},
collections:[
    {
      title:{
        type:String,
    },
    category:{
      type:String,
    },
    banner:[

    ],
    metaTitle:{
        type:String,
    },
    metaDesc:{
        type:String,
    },
    isFeatured:{
      type:Boolean,
      default:false,
    },
    handle:{
      type:String,
      lowercase: true,
    },
    order:{
      type:Number,
    },
    desc:{
      type:String,
    },

    }
],
},
  {
    timestamps: true,
  }
);
mongoose.models={}
export default mongoose.model("Collection", collectionSchema);