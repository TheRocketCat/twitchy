import {IClient} from "../Shared/Interfaces"
import {AutoMsg} from "./AutoMsg"
import {minToMilliSecs} from "../shared/utilities/time"

export class AutoMsgPrinter{
    private intervalId:NodeJS.Timeout
    private checkInterval:number //milliseconds

    private client:IClient

    private autoMsgs:AutoMsg[]

    constructor(client:IClient, minuteInterval:number){
        this.client=client
        this.checkInterval = minToMilliSecs(minuteInterval)
        this.autoMsgs=[]
    }

    start(){
        this.intervalId=setInterval(this.printMsgs,this.checkInterval)
    }
    stop(){
        clearInterval(this.intervalId)
    }

    printMsgs(){
        for(const msg of this.autoMsgs){
            msg.printMsg(this.client)
        }
    }

    loadMsgs(){

    }
}