import * as tmi from "tmi.js"
import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {TSC} from "../TwitchClientSingleton"
import {createNewAutoMsg} from "./AutoMsgWorkflows"
import {isOwner,UnauthorizedError} from "../auth"
import {WrongAmountOfArgsError} from "../shared/errors"

//HANDLERS

//!createNewAutoMsg "{message}" {interval in minutes}
export async function createNewAutoMsgHandler(channel:string,userstate:tmi.Userstate,msg:string)
:Promise<Result<void,Error>>{
    try{
        if(isOwner(channel,userstate)==false){
            return Err(new UnauthorizedError())
        }
        
        const cmdArgs=extractCommandArgs(msg)
            .expect("extracting command arguments")
            .expect("no arguments given");

        if(cmdArgs.length != 2){
            //return Err(new Error("wrong arguments amount"))
            return Err(new WrongAmountOfArgsError())
        }

        const message=cmdArgs[0]
        const printInterval=Number(cmdArgs[1])
        if(isNaN(printInterval)){
            return Err(new TypeError("argument two isnt number"))
        }

        return createNewAutoMsg(channel, message, printInterval)
    }catch(e){
        return Err(new Error(e))
    }
}

//extracts strings and numbers into args
function extractCommandArgs(cmd:string):Result<Option<string[]>,Error>{
    try{
        const match=cmd.match(/[0-9]+|\".*\"/g)
        if(match == null){
            return Ok(None)
        }
        else if(match.length > 0){
            return Ok(Some(match))
        }else return Ok(None)
    }catch(e){
        return Err(e)
    }
}

//exported for testing only
export const testables={
    extractCommandArgs
}