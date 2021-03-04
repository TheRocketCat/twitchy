import {
    getCoinPrice
    ,getTotalCreatorCoinCount
} from "./http"

import {CreatorCoinPrice} from "./types"

test("getTotalCreatorCoinCount", async ()=>{
    let res= await getTotalCreatorCoinCount("FAN")

    expect(res.ok).toBe(true)

    const unwrap=res.unwrap()
    expect(unwrap).toBeDefined()
})

test("getCoinPrice",async()=>{
    let res=await getCoinPrice("FAN")
    expect(res.ok).toBe(true)
    expect(res.unwrap()).toBeInstanceOf(CreatorCoinPrice)

    res=await getCoinPrice("asdklqwusancakqwdeoianasdkjwhiuhasdbnckjhaiduildkjha")
    expect(res.ok).toBe(false)
})