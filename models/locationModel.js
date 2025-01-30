const mongoose=require("mongoose")

const locationSchema=new mongoose.Schema({
    city:{
        type:String,
    },
    state:{
        type:String,
    },
},{
    timestamps:true
}
)

mongoose.models={}
export default mongoose.model("Location", locationSchema);