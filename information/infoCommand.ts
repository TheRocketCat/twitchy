import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"
import {Document} from "mongoose"

import {InfoCommandModel} from "./models"

export class InfoCommand{
    private constructor(
        private _channel:string
        ,private _cmd:string
        ,private _info:string
        ,private _throttle?:number
	){}

    async save():Promise<Result<void,Error>>{
        const infoCmd=new InfoCommandModel({
            channel:this.channel
            ,cmd:this.cmd
            ,info:this.info
            ,throttle:this.throttle
        })
        const res=await infoCmd.save()
        if(res != infoCmd){
            return Err(new Error("not saved"))
        }
        return Ok.EMPTY
    }

	async update(cmd?:string,info?:string,throttle?:number):Promise<Result<void,Error>>{
		const res=await InfoCommandModel.updateOne({channel:this._channel, cmd:this._cmd},{
			cmd,info,throttle
		})
		if(!res.ok) return Err(new Error("not updated"))
		else if(!res.nModified) return Err(new Error("not updated"))
		return Ok.EMPTY
	}

	async delete():Promise<Result<void,Error>>{
		return InfoCommand.delete(this.channel,this.cmd)
	}

	static async delete(channel:string,cmd:string):Promise<Result<void,Error>>{
		const res=await InfoCommandModel.deleteOne({channel,cmd})
		if(!res.ok){
			return Err(new Error("execution error"))
		}
		return Ok.EMPTY
	}

	static async get(channel:string,cmd:string):Promise<Option<InfoCommand>>{
		const doc:Document<InfoCommand>=await InfoCommandModel.findOne({channel,cmd})
		console.log(doc)
		if(!doc){
			return None
		}
		return Some(new InfoCommand(doc["channel"],doc["cmd"],doc["info"],doc["throttle"]))
	}


    static create(channel:string,cmd:string,info:string,throttle?:number):Result<InfoCommand,Error>{
		const firstLet=cmd.charAt(0)
		const match=firstLet.match(/[a-zA-Z]/)
		if(match.index==null){
			return Err(new Error("commands cant start with cmd symbold"))
		}

        return Ok(new InfoCommand(channel,cmd,info,throttle))
    }

	get channel():string{ return this._channel }
	get cmd():string{ return this._cmd }
	get info():string{ return this._info }
	get throttle():number | undefined{ return this._throttle }
}
