jest.mock("node-fetch")
jest.mock("tmi.js")
import fetch from "node-fetch"
const {Response} = jest.requireActual("node-fetch")

import {Client} from "tmi.js"

import {CreatorCoinPrice,Balance} from "./rally/types"

//TESTED
import {createCommandHandler} from "./commandHandler"

//GLOBALS
const COIN_SYMBOL="RocketCat";
const MOCK_USERSTATE={
    username:"RocketCat"
}
const CHANNEL=MOCK_USERSTATE.username
const CMD_HANDLER=createCommandHandler(new Client({}))

test("!coinPrice {coin symbol}",async ()=>{
    (fetch as unknown as jest.Mock)
    .mockReturnValue(Promise.resolve(new Response(`
        {
            "symbol":"${COIN_SYMBOL}"
            ,"priceInUSD":"1"
            ,"priceInRLY":"2"
        }
    `)));
    const cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!coinPrice ${COIN_SYMBOL}`
    )
    expect(cmdRes.ok).toBe(true)

    const unwrap=<CreatorCoinPrice>cmdRes.unwrap()
    expect(unwrap).toBeInstanceOf(CreatorCoinPrice)
    expect(unwrap.symbol).toBe(COIN_SYMBOL)
    expect(unwrap.priceInUSD).toBe(1)
    expect(unwrap.priceInRLY).toBe(2)
})

test("!coinCount {coin symbol}",async ()=>{
    (fetch as unknown as jest.Mock)
    .mockReturnValue(Promise.resolve(new Response(`
        {
            "totalSupporters":"1"
            ,"totalTransaction":"2"
            ,"totalSupportVolume":"3"
            ,"totalCoins":"4"
        }
    `)));
    const cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!coinCount ${COIN_SYMBOL}`
    )
    expect(cmdRes.ok).toBe(true)

    const unwrap=<string>cmdRes.unwrap()
    expect(typeof unwrap).toBe("number")
    expect(unwrap).toBe(4)
})

test("!balance {id}",async ()=>{
    (fetch as unknown as jest.Mock)
    .mockReturnValue(Promise.resolve(new Response(`
        [
            {"coinKind":"RLY","coinBalance":"2","estimatedInUsd":"3"},
            {"coinKind":"FAN","coinBalance":"0.2","estimatedInUsd":"0.3"},
            {"coinKind":"STANZ","coinBalance":"7.5","estimatedInUsd":"8"}
        ]
    `)));

    const cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!balance mydummyid`
    )

    expect(cmdRes.ok).toBe(true)
    const unwrap=<Balance>cmdRes.unwrap()
    expect(unwrap).toBeInstanceOf(Balance)

    const RLY=unwrap.balance[0]
    expect(RLY.coinKind).toBe("RLY")
    expect(RLY.coinBalance).toBe(2)
    expect(RLY.estimatedInUsd).toBe(3)

    const FAN=unwrap.balance[1]
    expect(FAN.coinKind).toBe("FAN")
    expect(FAN.coinBalance).toBe(0.2)
    expect(FAN.estimatedInUsd).toBe(0.3)

    const STANZ=unwrap.balance[2]
    expect(STANZ.coinKind).toBe("STANZ")
    expect(STANZ.coinBalance).toBe(7.5)
    expect(STANZ.estimatedInUsd).toBe(8)
})

test("!volume [coin symbol]",async ()=>{
    (fetch as unknown as jest.Mock)
    .mockReturnValue(Promise.resolve(new Response(`
        {
            "totalSupporters": 310,
            "totalTransaction": 517,
            "totalSupportVolume": 131171.06,
            "totalCoins": 140997.31779
        }
    `)));

    const cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!volume ${COIN_SYMBOL}`
    )

    expect(cmdRes.ok).toBe(true)
    const unwrap=cmdRes.unwrap()
    expect(unwrap).toBe(517)
})

test("!createInfoCmd",async ()=>{
    let cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!createInfoCmd ${CHANNEL} !info "my testing info" 5`
    )
    expect(cmdRes.ok).toBe(true)

    cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!updateInfoCmd ${CHANNEL} !info "my info" 2`
    )
    expect(cmdRes.ok).toBe(true)

    cmdRes=await CMD_HANDLER(
        CHANNEL
        ,MOCK_USERSTATE
        ,`!getInfoCmd ${CHANNEL} !info`
    )
    expect(cmdRes.ok).toBe(true)
    let unwrap=cmdRes.unwrap()
})
