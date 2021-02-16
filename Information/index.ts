import {Ok, Err,Result} from "ts-results"

//TMP BAD GLOBALS
const DB:Map<string,InfoCmd> = new Map()


// Workflows
export function AddInfoCommandWorkflow(cmd:AddInfoCmd):Result<any, Error>{
    try{
        const verifiedCmd=verifyInfoCmd(cmd).mapErr(e=>{throw e}).unwrap()
        const result=addCmd(verifiedCmd)

        return Ok(null)
    }catch(e){
        return Err(e)
    }
}

export function RemoveInfoCommandWorkflow(cmd:RemoveInfoCmd):Result<any,Error>{
    throw new Error("NOT IMPLEMENTED")
}

// CMD
export interface AddInfoCmd{
    commandUnverified:string
    infoUnverified:any
}

export interface RemoveInfoCmd{ }

// AddInfoCommandWorkflow info SUB FUNCTIONS

interface InfoCmd{
    command:string
    info:any
}

function verifyInfoCmd(cmd:AddInfoCmd):Result<InfoCmd,Error>{
    const infoCmd:InfoCmd={
        command:cmd.commandUnverified
        ,info:cmd.infoUnverified
    }
    return Ok(infoCmd)
}

function addCmd(verifiedCmd:InfoCmd):Result<null,Error>{
    if(DB.has(verifiedCmd.command)){
        return Err(new Error("already exists"))
    }
    DB.set(verifiedCmd.command,verifiedCmd)
    return Ok(null)
}