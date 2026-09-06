import {Client, Connection} from '@temporalio/client'
import {greetingWorkflow} from './workflows.ts'
import {nanoid} from 'nanoid'

async function run(){
  
  const connection = await Connection.connect({address: 'localhost:7233'});
    
  const client = new Client({connection})
  
  const handle = await client.workflow.start(greetingWorkflow, {
    taskQueue: 'greeting-workflow',
    args: ['Hello World'],
    workflowId: `greeting-workflow-${nanoid()}`
  }) 
 
  console.log(`Started workflow ${handle.workflowId}`)

  console.log(await handle.result())

}


run().catch((err) => {
    console.error(err)
    process.exit(1)
})