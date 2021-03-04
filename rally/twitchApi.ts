import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"
import * as Joi from "joi"

import {CreatorCoinPrice,Balance} from "./types"
import {WrongAmountOfArgsError} from "../shared/errors"

import {
    getTotalCreatorCoinCount
    ,getTotalCreatorDefaultCoinCount
    ,getCoinPrice
    ,getDefaultCoinPrice
    ,getBalance
    ,getVolume
} from "./http"

//!coinCount [coin symbol]
export async function getCoinCountHandler(msg:string):Promise<Result<number,Error>>{
    const args=extractArgs(msg)

    if(args[1] == undefined){
        return getTotalCreatorCoinCount(args[1])
    }else{
        return getTotalCreatorDefaultCoinCount()
    }
}


//!coinPrice [coin symbol]
export async function getCoinPriceHandler(msg:string)
:Promise<Result<CreatorCoinPrice,Error>>{
    const args=extractArgs(msg)

    if(args[1] != undefined){
        return getCoinPrice(args[1])
    }else{
        return getDefaultCoinPrice()
    }
}

//!balance {id}
export async function getBalanceHandler(msg:string)
:Promise<Result<Balance,Error>>{
    const args=extractArgs(msg)

    if(args.length != 2){
        return Err(new WrongAmountOfArgsError())
    }

    try { Joi.assert(args[1], Joi.string()) }
    catch(e){return Err(e)}

    return getBalance(args[1])
}

//!volume [coin symbol]
export async function getVolumeHandler(msg:string)
:Promise<Result<number,Error>>{
    const args=extractArgs(msg)

    //TODO add support for default coin later
    if(args.length != 2){
        return Err(new WrongAmountOfArgsError())
    }

    return getVolume(args[1])
}

//utility functions
function extractArgs(msg:string):string[]{
    return msg.split(" ")
}

//for unit tests only
export const unitTests={
    extractArgs
}