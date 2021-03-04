import mongoose, {Schema} from "mongoose"

const infoCommandSchema=new Schema({
    cmd:String
    ,info:String
    ,channel:String
    ,throttle:Number
})

export const InfoCommandModel=mongoose.model("InfoCommand",infoCommandSchema)