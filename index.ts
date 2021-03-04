import * as tmi from "tmi.js"
import {
    Result ,Ok ,Err
    ,Option ,Some ,None
} from "ts-results"

import {IClient,IToString} from "./shared/interfaces"
import {TSC} from "./TwitchClientSingleton"
import {AutoMsgPrinter} from "./information/AutoMsgPrinter"
import {createCommandHandler} from "./commandHandler"
//handlers
import {createNewAutoMsgHandler} from "./information/twitchApi"
import {getCoinCountHandler, getCoinPriceHandler} from "./rally/twitchApi"

const autoMsgPrinter=new AutoMsgPrinter(TSC.client, 5)

//TODO
/**
 * get channels joined when started
 */


//TODO
//whisper commands
TSC.init();
TSC.client.on('connected', onConnectedHandler);

function onConnectedHandler (addr, port) {
  TSC.client.on('message', createCommandHandler(TSC.client));
  autoMsgPrinter.start()
  console.log("im vibing!")
}