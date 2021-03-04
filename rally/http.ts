import fetch, {Response} from "node-fetch"
import * as Joi from "joi"
import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {CreatorCoinPrice,Balance} from "./types"
import {getDefaultCoin} from "./defaultCoin"

export async function getTotalCreatorCoinCount(coinSymbol:string):Promise<Result<number,Error>>{
    try{
        const json=(await fetchJson(`https://api.rally.io/v1/creator_coins/${coinSymbol}/summary`))
            .expect("fetch json");

        const nmbr=<number>Joi.attempt(json.totalCoins,Joi.number().required())

        return Ok(nmbr)
    }catch(e){
        return Err(e)
    }
}

export async function getTotalCreatorDefaultCoinCount():Promise<Result<number,Error>>{
    return getTotalCreatorCoinCount(getDefaultCoin())
}

export async function getCoinPrice(coinSymbol:string)
:Promise<Result<CreatorCoinPrice,Error>>{
    try{
        const json=(await fetchJson(`https://api.rally.io/v1/creator_coins/${coinSymbol}/price`))
            .expect("fetch json");

        const ccp=CreatorCoinPrice.createFromJson(json)
            .expect("create coin price");

        return Ok(ccp)
    }catch(e){
        return Err(e)
    }
}

export async function getDefaultCoinPrice()
:Promise<Result<CreatorCoinPrice,Error>>{
    return getCoinPrice(getDefaultCoin())
}


export async function getBalance(id:string):Promise<Result<Balance,Error>>{
    try{
        //TODO suppoer other idType - check docs
        const json=(await fetchJson(`https://api.rally.io/v1/users/rally/${id}/balance`))
            .expect("fetch json");

        const balance=(await Balance.createFromJson(json)).expect("creating balance")
        return Ok(balance)
    }catch(e){
        return Err(e)
    }
}

export async function getVolume(coinSymbol:string)
:Promise<Result<number,Error>>{
    try{
        //TODO suppoer other idType - check docs
        const json=(await fetchJson(`https://api.rally.io/v1/creator_coins/${coinSymbol}/summary`))
            .expect("fetch json");

        const nmbr=<number>Joi.attempt(json.totalTransaction,Joi.number().required())
        return Ok(nmbr)

    }catch(e){
        return Err(e)
    }
}

//utilities
async function fetchJson(url:string):Promise<Result<any,Error>>{
    try{
        const res=await fetch(url)
        correctStatus(res).expect("check status")
        return Ok(await res.json())
    }catch(e){
        return Err(e)
    }
}

function correctStatus(r:Response):Result<void,Error>{
    if(r.status <= 200 && r.status > 300){
        return Err(new Error(`code ${r.status}`))
    }
    return Ok.EMPTY
}