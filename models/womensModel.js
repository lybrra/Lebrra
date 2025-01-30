const mongoose=require("mongoose")

const womenSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    order:{
        type:Number,
    },
    handle:{
        type:String,
        required:true,
    },
    images:[

    ],
    metaDesc:{
        type:String,
    },
    metaTitle:{
        type:String,
    },
    status:{
        default:"active",
        type:String,
    },
    category:{
        type:String
    },
    products:[

    ],
    productCount:{
        type:Number
    },
    isTrending:{
        type:String,
        default:"false"
    },
    mostTrending:{
        type:String,
        default:"false"
    },

},{
    timestamps:true
}
)

mongoose.models={}
export default mongoose.model("Women", womenSchema);