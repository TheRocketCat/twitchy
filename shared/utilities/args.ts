import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

//extracts strings and numbers into args
export function extractCommandArgs(cmd:string):Result<Option<string[]>,Error>{
    try{
        const match=cmd.match(/[0-9]+|\".*\"|\'.*\'|[a-zA-Z]+/g).slice(1)
        if(match == null){
            return Ok(None)
        }
        else if(match.length > 0){
			for(let i=0;i<match.length;i++){
				match[i]=match[i].replace(/"/g,"")
				match[i]=match[i].replace(/'/g,"")
			}
            return Ok(Some(match))
        }else return Ok(None)
    }catch(e){
        return Err(e)
    }
}
