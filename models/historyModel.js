const mongoose =require("mongoose");
var historySchema = new mongoose.Schema(
    {
    name:{
        type: String,
      },
    title: {
        type: String,
        },
    sku:{
        type:String,
       
        },
    productchange:{
        type:String,
        },
        time:{
            type:Date,
        }
  });
mongoose.models={}

export default mongoose.model("History", historySchema);