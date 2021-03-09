jest.mock("tmi.js")
import {Client} from "tmi.js"

import * as mongoose from "mongoose"
import {Ok,Err} from "ts-results"

import {createCommandHandler} from "./commandHandler"
import {InfoCommand} from "./information/infoCommand"

beforeAll(async ()=>{
	return mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser:true,useUnifiedTopology:true})
})
afterAll(async ()=>{
	await mongoose.connection.dropDatabase()
	return mongoose.connection.close()
})
//GLOBALS
const MOCK_USERSTATE={
	username:"RocketCat"
}
const CHANNEL="#"+MOCK_USERSTATE.username.toLowerCase()
const RAW_CMD_HANDLER=createCommandHandler(new Client({}))
const DEFAULT_CMD_HANDLER=function(msg:string){
	return createCommandHandler(new Client({}))(CHANNEL,MOCK_USERSTATE,msg)
}

describe("InfoCommand Integration",()=>{
	const CMD="myCmd"
	const INFO_PROCESSED="information to print"
	const INFO_UNPROCESSED="\""+INFO_PROCESSED+"\""
	const THROTTLE=0

	test("!createInfoCommand",async()=>{
		let cmdRes=await DEFAULT_CMD_HANDLER(
			`!createInfoCommand ${CMD} ${INFO_UNPROCESSED} ${THROTTLE}`
		)

		expect(cmdRes).toBe(Ok.EMPTY)
	})
	test(`!${CMD}`,async()=>{
		let cmdRes=await DEFAULT_CMD_HANDLER(`!${CMD}`)

		expect(cmdRes)
		.toStrictEqual(InfoCommand.create(CHANNEL,CMD,INFO_PROCESSED,THROTTLE));
	})
	test(`!${CMD} wrong channel`,async()=>{
		let cmdRes=await RAW_CMD_HANDLER("wrongChannel", MOCK_USERSTATE, `!${CMD}`)
		expect(cmdRes.val).toHaveProperty("message")
	})
	test(`!noCmdLikeThis no such command`,async()=>{
		let cmdRes=await DEFAULT_CMD_HANDLER(`!noCmdLikeThis`)
		expect(cmdRes.val).toHaveProperty("message")
	})
	test("!updateInfoCmd",async()=>{
		const newInfo="\"new information to print\""
		const newThrottle=1;
		let cmdRes=await DEFAULT_CMD_HANDLER(
			`!updateInfoCmd ${CMD} ${newInfo} ${newThrottle}`
		)
		expect(cmdRes).toBe(Ok.EMPTY)

		cmdRes=await DEFAULT_CMD_HANDLER(`!${CMD}`)
		expect(cmdRes).toStrictEqual(Ok(InfoCommand.create(
			CHANNEL,CMD,newInfo,newThrottle
		)))
	})
	test("!deleteInfoCmd",async()=>{
		let cmdRes=await DEFAULT_CMD_HANDLER(`!deleteInfoCmd ${CMD}`)
		expect(cmdRes).toBe(Ok.EMPTY)

		cmdRes=await DEFAULT_CMD_HANDLER(`!${CMD}`)
		expect(cmdRes).toStrictEqual(Err(new Error("no such command")))
	})
})
