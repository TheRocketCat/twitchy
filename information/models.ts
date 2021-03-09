import {Schema, model} from "mongoose"

const infoCommandSchema=new Schema({
    cmd:String
    ,info:String
    ,channel:String
    ,throttle:Number
})

export const InfoCommandModel=model("InfoCommand",infoCommandSchema)
