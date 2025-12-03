import { Inngest } from "inngest";
import {serve} from "inngest/next";
import { createFunction } from "inngest/next/function";


// inggest functions demo 
const hellowWorld = createFunction(
    {id:"hellow-world"},
    {event:"app/hellow-world"},
    async({event,step})=>{
        await step.sleep("wait-a-moment",3000)
        return{message:`Hello World! from the event ${event.name}`}
    }
)

export const inngest = new Inngest({
    id:"finance-tracker-app",
    name:"AI Finance Tracker App Inngest",
})

export default serve({
    client:inngest,
    functions:[
        hellowWorld,
    ]
})



