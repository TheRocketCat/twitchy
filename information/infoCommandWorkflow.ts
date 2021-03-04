import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"
import {Document} from "mongoose"

import {InfoCommand} from "./types"
import {InfoCommandModel} from "./models"

export async function addInfoCommandWorkflow(channel:string,cmd:string,info:string,throttle?:number)
:Promise<Result<void,Error>>{
    try{
        //TODO check if cmd exists 

        const infoCmd=InfoCommand.create(channel,cmd,info,throttle)
            .expect("creating info command");

        (await (infoCmd.save())).expect("saving info command");

        return Ok.EMPTY
    }catch(e){ return Err(e) }
}

export async function deleteInfoCommandWorkflow(channel:string,cmd:string):Promise<Result<void,Error>>{
    const res=await InfoCommandModel.deleteOne({channel,cmd})
    if(!res.ok){
        return Err(new Error("not deleted"))
    }
    return Ok.EMPTY
}

export async function updateInfoCommandWorkflow(channel:string,cmd:string,info?:string,throttle?:number)
:Promise<Result<void,Error>>{
    const res=await InfoCommandModel.updateOne({channel,cmd},{channel,cmd,info,throttle})
    if(!res.ok){
        return Err(new Error("not updated"))
    }
    return Ok.EMPTY
}

export async function getInfoCommandWorkflow(channel:string,cmd:string)
:Promise<Result<InfoCommand,Error>>{
    const doc:Document<InfoCommand>=await InfoCommandModel.findOne({channel,cmd})
    if(!doc){
        return Err(new Error("not found"))
    }
    return Ok(doc)
}