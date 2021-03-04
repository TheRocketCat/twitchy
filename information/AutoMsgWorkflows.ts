import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {IClient} from "../shared/interfaces"
import {AutoMsg} from "./AutoMsg"


//WORKFLOWS
export async function createNewAutoMsg(channel:string, msg:string,printInterval:number)
:Promise<Result<void,Error>>{
    try{
        const autoMsg=AutoMsg.create(channel,msg,printInterval)
            .expect("creating auto message");

        (await autoMsg.save()).expect("saving auto msg");

        //TODO cache repositorty pattern ?
        (await autoMsg.loadIntoCache()).expect("loading into auto msg cache");

        return Ok.EMPTY
    }catch(e){
        return Err(e)
    }
}

export async function deleteAutoMsg(channel:string,name:string):Promise<Result<void,Error>>{
    return Ok.EMPTY
}