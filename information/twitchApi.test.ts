import * as tmi from "tmi.js"

import {
    createNewAutoMsgHandler
} from "./twitchApi"


//mocks
const channel="x"
const userstate:tmi.Userstate={ username:"x" }

test("wrong argument length",async ()=>{
    let msg="!createNewAutoMsg hsj ow 1"
    let res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.err).toBe(true)

    msg="!createNewAutoMsg hsj "
    res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.err).toBe(true)

    msg="!createNewAutoMsg \"hsj\"  "
    res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.err).toBe(true)
})

test("wrong argument types",async ()=>{
    let msg="!createNewAutoMsg 2 2"
    let res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.err).toBe(true)

    msg="!createNewAutoMsg wrong 2"
    res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.err).toBe(true)

    msg="!createNewAutoMsg \"good\" wrong"
    res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.err).toBe(true)
})

test("correctly called", async()=>{
    const msg="!createNewAutoMsg \"my message\" 5"
    const res=await createNewAutoMsgHandler(channel,userstate,msg)
    expect(res.ok).toBe(true)
})
