import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"
import {Document} from "mongoose"

import {InfoCommand} from "./InfoCommand"

export async function createInfoCommandWorkflow(channel:string,cmd:string,info:string,throttle?:number)
:Promise<Result<void,Error>>{
    try{
        //TODO check if cmd exists 
        const infoCmd=InfoCommand.create(channel,cmd,info,throttle)
            .expect("creating info command");

        (await (infoCmd.save())).expect("saving info command");

        return Ok.EMPTY
    }catch(e){ return Err(e) }
}

export async function deleteInfoCommandWorkflow(channel:string,cmd:string):Promise<Result<void,Error>>{
	try{
		(await InfoCommand.delete(channel,cmd)).expect("deleting info command")
		return Ok.EMPTY
	}catch(e){ return Err(e) }
}

export async function updateInfoCommandWorkflow(channel:string,cmd:string,info?:string,throttle?:number)
:Promise<Result<void,Error>>{
	const infoCmd=(await InfoCommand.get(channel,cmd)).expect("no such channel command");

    (await infoCmd.update(cmd,info,throttle))
	.expect("updating info command");
    return Ok.EMPTY
}

export async function getInfoCommandWorkflow(channel:string,cmd:string)
:Promise<Result<InfoCommand,Error>>{
	try{
		console.log("channel:", channel)
		console.log("CMD:", cmd)
		const infoCmd=(await InfoCommand.get(channel,cmd))
		.expect("get info command");

		return Ok(infoCmd)
	}catch(e){return Err(e)}
}
