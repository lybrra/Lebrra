const mongoose=require("mongoose")

const scrollSchema=new mongoose.Schema({
    images:[
        
    ],
    title:{
        type:String,
    },
    alt:{
        type:String,
    }

},{
    timestamps:true
}
)

mongoose.models={}
export default mongoose.model("Banner", scrollSchema);