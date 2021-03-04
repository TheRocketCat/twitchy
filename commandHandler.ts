import {Userstate} from "tmi.js"
import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {TSC} from "./TwitchClientSingleton"
import {isOwner} from "./auth"

import {IClient,IToString} from "./shared/interfaces"
//handlers
import {createNewAutoMsgHandler} from "./information/twitchApi"
import {
  getCoinCountHandler
  ,getCoinPriceHandler
  ,getBalanceHandler
  ,getVolumeHandler
} from "./rally/twitchApi"

export function createCommandHandler(client:IClient)
:(channel:string,userstate:Userstate,msg:string)=>Promise<Result<IToString | string | void,Error>>{
  return async function(channel:string,userstate:Userstate,msg:string)
  :Promise<Result<IToString | string | void,Error>>{
    //TODO this is only bc i have only 1 account
    //if (self) { return; } // Ignore messages from the bot
    //only react to commands
    if(msg.charAt(0) != "!") return
    //idk if this works properly, username type isnt specified
    else if(userstate.username == undefined){
        return Err(new Error("missing username"))
    }

    // Remove whitespace from chat message
    const command = msg.trim().split(" ")
    const commandName = command[0]

    //TODO handle command results
    let cmdResult:Result<IToString | string | void ,Error>
    switch(commandName){
      case "!createAutoMsg":
        cmdResult=await createNewAutoMsgHandler(channel,userstate,msg);
        break
      case "!coinCount":
        cmdResult=await getCoinCountHandler(msg)
        break
      case "!coinPrice":
        cmdResult=await getCoinPriceHandler(msg)
        break
      case "!balance":
        cmdResult=await getBalanceHandler(msg)
        break
      case "!volume":
        cmdResult=await getVolumeHandler(msg)
        break
      default:
        if(isOwner(channel, userstate)) return Ok.EMPTY
        client.whisper(userstate.username,"no such command")
        return Err(new Error("no such command"))
    }
    if(cmdResult.err){
        console.error(cmdResult.val)
    }
    client.say(channel,makeResponseString(cmdResult))
    return cmdResult
  }
}

function makeResponseString(cmdResult:Result<IToString | string | void,Error>)
:string{
  if(cmdResult.err){
    //TODO more elaborate error for when users messed up
    return "command failled"
  }

  if(cmdResult == Ok.EMPTY){
    return "command succeded"
  }

  const value = <IToString|string>cmdResult.unwrap()
  if(typeof value == "string"){
    return value
  }

  return value.toString()
} 