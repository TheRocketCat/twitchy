import {Userstate} from "tmi.js"
import * as Joi from "joi"
import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {isOwner,UnauthorizedError} from "../auth"
import {WrongAmountOfArgsError} from "../shared/errors"
import {extractCommandArgs} from "../shared/utilities/args"
import {InfoCommand} from "./infoCommand"
//workflows
import {createNewAutoMsg} from "./autoMsgWorkflows"
import {
	createInfoCommandWorkflow
	,getInfoCommandWorkflow
	,deleteInfoCommandWorkflow
	,updateInfoCommandWorkflow
} from "./infoCommandWorkflows"

//!createNewAutoMsg "{message}" {interval in minutes}
export async function createNewAutoMsgHandler(channel:string,userstate:Userstate,msg:string)
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

export async function createInfoCommandHandler(channel:string,userstate:Userstate, msg:string)
:Promise<Result<void,Error>>{
	try{
        if(isOwner(channel,userstate)==false){
            return Err(new UnauthorizedError())
        }
		const unverifiedArgs=extractCommandArgs(msg)
			.expect("bad arguments")
			.expect("no arguments given");

		//this function ensures type safety ?
		const args:Array<any>=Joi.attempt(unverifiedArgs ,Joi.array().items(
			Joi.string().required()
			,Joi.string().required()
			,Joi.number()
	   ))
	
		return createInfoCommandWorkflow(channel,args[0],args[1],args[2])
	}catch(e){
		return Err(e)
	}
}
export async function updateInfoCommandHandler(channel:string,userstate:Userstate,msg:string)
:Promise<Result<void,Error>>{
	try{
		if(isOwner(channel,userstate)==false){
			return Err(new UnauthorizedError())
		}
		
		const unverifiedArgs=extractCommandArgs(msg)
		const args = Joi.attempt(unverifiedArgs,Joi.array().items(
			Joi.string().alphanum().required()
			,Joi.string().required()
			,Joi.number().integer().greater(1)
		));


		updateInfoCommandWorkflow(channel,args[0],args[1],args[2])
	}catch(e){return Err(e)}
}

export async function deleteInfoCommandHandler(channel:string,userstate:Userstate,msg:string)
:Promise<Result<void,Error>>{
	try{
		if(isOwner(channel,userstate)==false){
			return Err(new UnauthorizedError())
		}
		const unverifiedArgs=extractCommandArgs(msg)
		const args = Joi.attempt(unverifiedArgs,Joi.array().items(
			Joi.string().alphanum().required()
		));

		deleteInfoCommandWorkflow(channel,args[0])
	}catch(e){return Err(e)}
}

export async function getInfoCommandHandler(channel:string, msg:string)
:Promise<Result<InfoCommand,Error>>{
	//call with remove command symbol
	return getInfoCommandWorkflow(channel,msg.substring(1))
}
