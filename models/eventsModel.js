const mongoose=require("mongoose")

const eventsSchema=new mongoose.Schema({
    event:{
        type:String,
    },
},{
    timestamps:true
}
)

mongoose.models={}
export default mongoose.model("Events", eventsSchema);