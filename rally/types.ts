import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {IToString} from "../shared/interfaces"

import * as Joi from "joi"

export class CreatorCoinPrice implements IToString{
    readonly symbol:string
    readonly priceInUSD:number
    readonly priceInRLY:number

    private constructor(symbol:string,priceInUSD:number,priceInRLY:number){
        this.symbol=symbol
        this.priceInUSD=priceInUSD
        this.priceInRLY=priceInRLY
    }

    static createFromJson(data:any):Option<CreatorCoinPrice>{
        if(
            data.symbol == undefined ||
            data.priceInUSD == undefined ||
            data.priceInRLY==undefined
        ){
            return None
        }

        const priceInUSD=Number(data.priceInUSD)
        if(isNaN(priceInUSD)) return None
        const priceInRLY=Number(data.priceInRLY)
        if(isNaN(priceInRLY)) return None
        

        return Some(new CreatorCoinPrice(
            data.symbol
            ,priceInUSD
            ,priceInRLY
        ))
    }

    toString():string{
        return `${this.symbol}: ${this.priceInUSD} USD or ${this.priceInRLY} RLY`
    }
}

class BalanceLine{
    readonly coinKind:string
    readonly coinBalance:number
    readonly estimatedInUsd:number

    toString(){
        return `coin: ${this.coinKind} - balance: ${this.coinBalance} - estimateInUsd: ${this.estimatedInUsd}`
    }
}

export class Balance implements IToString{
    private static schema=Joi.array().items(
        Joi.object({
            coinKind:Joi.string()
            ,coinBalance:Joi.number()
            ,estimatedInUsd:Joi.number()
        })
    )
    readonly balance:BalanceLine[]

    private constructor(array:BalanceLine[]){
        this.balance=array
    }

    static async createFromJson(data:any){
        try{
            const res=await this.schema.validateAsync(data)
            return Ok(new Balance(res))
        }
        catch(e){
            return Err(e)
        }
    }

    toString():string{
        let str=""
        let i=0
        for(const b of this.balance){
            str+= b.toString()
            if(i < this.balance.entries.length){
                str += "\n"
            }
            i++
        }
        return "balance: " + str
    }
}



export function isCreatorCoinPrice(data:any):data is CreatorCoinPrice{
    if(
        data.symbol == undefined ||
        data.priceInUSD == undefined ||
        data.priceInRLY==undefined)
    {
        return false
    }
    return true
}