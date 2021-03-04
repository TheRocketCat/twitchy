import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {Userstate} from "tmi.js"

import {isOwner,UnauthorizedError} from "../auth"
import {TSC} from "../TwitchClientSingleton"

export async function join(channel:string,userstate:Userstate){
    if(isOwner(channel,userstate) == false){
        return Err(new UnauthorizedError())
    }

    saveChannelToDb(channel)
    //TODO cahce ?
    const res=await TSC.client.join(channel)
}

function saveChannelToDb(channel:string){ }