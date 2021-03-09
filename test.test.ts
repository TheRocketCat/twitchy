jest.mock("tmi.js")
import {Client} from "tmi.js"

import * as mongoose from "mongoose"
import {Ok} from "ts-results"

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
const CHANNEL="#"+MOCK_USERSTATE.username.toLowerCase()
const DEFAULT_CMD_HANDLER=function(msg:string){
	return createCommandHandler(new Client({}))(CHANNEL,MOCK_USERSTATE,msg)
}

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
