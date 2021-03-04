import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {InfoCommandModel} from "./models"

export class InfoCommand{
    private constructor(
        private channel:string
        ,private cmd:string
        ,private info:string
        ,private throttle?:number
        ){}

    async save():Promise<Result<void,Error>>{
        const infoCmd=new InfoCommandModel({
            channel:this.channel
            ,cmd:this.cmd
            ,info:this.info
            ,throttle:this.throttle
        })
        const res=await infoCmd.save()
        if(res != infoCmd){
            return Err(new Error("not saved"))
        }
        return Ok.EMPTY
    }

    static create(channel:string,cmd:string,info:string,throttle?:number):Result<InfoCommand,Error>{
        return Ok(new InfoCommand(channel,cmd,info,throttle))
    }
}