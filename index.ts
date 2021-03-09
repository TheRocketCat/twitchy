import {TSC} from "./shared/twitchClientSingleton"
import {AutoMsgPrinter} from "./information/autoMsgPrinter"
import {createCommandHandler} from "./commandHandler"

import * as mongoose from "mongoose"

//TODO add pass
mongoose.connect('mongodb://localhost:27017/twitchy', {
	useUnifiedTopology:true
	,useNewUrlParser: true
}
);

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
