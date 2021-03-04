import * as tmi from "tmi.js"


//TODO dubble check this is true, but seems like it or maybe username.lower
export function isOwner(channel:string,userstate:tmi.Userstate):boolean{
    return channel == "#"+userstate.username.toLowerCase()
}

//ERRORS
export class UnauthorizedError extends Error{
    constructor(){
        super()
        this.name="unauthorized error"
        this.message="user is not authorized"
    }
}