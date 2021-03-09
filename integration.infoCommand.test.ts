jest.mock("tmi.js")
import {Client} from "tmi.js"

import * as mongoose from "mongoose"

import {createCommandHandler} from "./commandHandler"

beforeAll(async ()=>{
	return mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser:true,useUnifiedTopology:true})
})
afterAll(async ()=>{
	//await mongoose.connection.dropDatabase()
	return mongoose.connection.close()
})
//GLOBALS
const MOCK_USERSTATE={
	username:"RocketCat"
}
const CHANNEL=MOCK_USERSTATE.username
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

		expect(cmdRes.val).not.toHaveProperty("message")
	})
	test(`!${CMD}`,async()=>{
		let cmdRes=await DEFAULT_CMD_HANDLER(`!${CMD}`)
		console.log(cmdRes)
		expect(cmdRes.val).not.toHaveProperty("message")
		let info=cmdRes.unwrap()
		expect(cmdRes.val).not.toHaveProperty("message")
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
		let cmdRes=await DEFAULT_CMD_HANDLER(`!updateInfoCmd ${CMD} ${newInfo} ${newThrottle}`)
		expect(cmdRes.val).not.toHaveProperty("message")

		cmdRes=await DEFAULT_CMD_HANDLER(`!${CMD}`)
		expect(cmdRes.val).not.toHaveProperty("message")
		const info=cmdRes.unwrap()
		expect(info).toBe(newInfo)
	})
	test("!deleteInfoCmd",async()=>{
		let cmdRes=await DEFAULT_CMD_HANDLER(`!deleteInfoCmd ${CMD}`)
		expect(cmdRes.val).not.toHaveProperty("message")

		cmdRes=await DEFAULT_CMD_HANDLER(`!${CMD}`)
		expect(cmdRes.val).toHaveProperty("message")
	})
})
