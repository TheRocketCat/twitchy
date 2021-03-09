import {InfoCommand} from "./InfoCommand"
import * as mongoose from "mongoose"

beforeAll(async ()=>{
	return mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser:true,useUnifiedTopology:true})
})
afterAll(async ()=>{
	await mongoose.connection.dropDatabase()
	return mongoose.connection.close()
})

describe("InfoCommand",()=>{
	let INFO_COMMAND:InfoCommand = undefined
	const CHANNEL="testChannel"
	const CMD="testCmd"
	const INFO="info to print"
	const THROTTLE=5
	test("create", ()=>{
		const res=InfoCommand.create(CHANNEL,CMD,INFO,THROTTLE)
		expect(res.ok).toBe(true)
		INFO_COMMAND=res.unwrap()
		expect(INFO_COMMAND).toBeInstanceOf(InfoCommand)
		expect(INFO_COMMAND.channel).toBe(CHANNEL)
		expect(INFO_COMMAND.cmd).toBe(CMD)
		expect(INFO_COMMAND.info).toBe(INFO)
		expect(INFO_COMMAND.throttle).toBe(THROTTLE)
	})
	test("save",async ()=>{
		const res=await INFO_COMMAND.save()
		expect(res.ok).toBe(true)
	})
	test("get",async ()=>{
		const res=await InfoCommand.get(CHANNEL,CMD)
		expect(res.some).toBe(true)

		const ic=res.unwrap()
		expect(ic).toBeInstanceOf(InfoCommand)
		expect(ic.channel).toBe(CHANNEL)
		expect(ic.cmd).toBe(CMD)
		expect(ic.info).toBe(INFO)
		expect(ic.throttle).toBe(THROTTLE)
	})
	test("update",async ()=>{
		const newCmd="newCmd"
		const newInfo="\"new info string\""
		const newThrottle=10
		await INFO_COMMAND.update(newCmd,newInfo,newThrottle)
		const res=await InfoCommand.get(CHANNEL,newCmd)
		expect(res.some).toBe(true)
		const ic=res.unwrap()
		expect(ic.channel).toBe(CHANNEL)
		expect(ic.cmd).toBe(newCmd)
		expect(ic.info).toBe(newInfo)
		expect(ic.throttle).toBe(newThrottle)
	})
	test("delete",async ()=>{
		const res=await INFO_COMMAND.delete()
		expect(res.ok).toBe(true)
		
		const opt=await InfoCommand.get(CHANNEL,CMD)
		expect(opt.none).toBe(true)
	})
})
