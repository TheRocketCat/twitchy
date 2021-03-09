import * as mongoose from "mongoose"
import {InfoCommand} from "./information/infoCommand"
import {createInfoCommandWorkflow} from "./information/infoCommandWorkflows"

//TODO add pass
(async ()=> {
	await mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true,useUnifiedTopology:true});
	await createInfoCommandWorkflow("channel","cmd","my info",50)

	await mongoose.connection.close()
})()
