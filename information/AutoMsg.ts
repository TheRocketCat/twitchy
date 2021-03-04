import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {IClient} from "../shared/interfaces"
import {minToMilliSecs} from "../shared/utilities/time"

export class AutoMsg{

    private printInterval:number //miliseconds
    private lastUpdate:number //unix timestamp

    private message:string
    private channel:string

    private constructor(channel:string,msg:string,printInterval:number){
        this.channel=channel;
        this.message=msg;
        this.printInterval=minToMilliSecs(printInterval)
    }
    static create(channel:string,msg:string,printMinuteInterval:number)
    :Result<AutoMsg,Error>{
        if(printMinuteInterval < 5){
            return Err(new Error("minute less than 5"))
        }
        return Ok(new AutoMsg(channel,msg,printMinuteInterval))
    }

    async delete():Promise<Result<void,Error>>{
        return Ok.EMPTY 
    }

    async printMsg(client:IClient):Promise<Result<void,Error>>{
        if((this.lastUpdate + this.printInterval) < Date.now()){
            //docs say we cant know if this works, unless ther is a connection issue
            await client.say(this.channel, this.message).catch(err=>{
                console.error(err)
                return Err(new Error("printing message"))
            })
            return Ok.EMPTY
        }
    }

    async save():Promise<Result<void,Error>>{
        //TODO
        return Ok.EMPTY
    }

    async loadIntoCache():Promise<Result<void,Error>>{
        //TODO
        return Ok.EMPTY
    }
}