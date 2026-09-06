import {Client, Connection} from '@temporalio/client'
import {greetingWorkflow} from './workflows.ts'
import {nanoid} from 'nanoid'
import { DEFAULT_TASK_QUEUE } from './constant.ts';

async function run(){
  
  const connection = await Connection.connect({address: 'localhost:7233'});
    
  const client = new Client({connection})
  
    const handle = await client.workflow.start(greetingWorkflow, {
    taskQueue: DEFAULT_TASK_QUEUE,
    args: ['Temporal'],
    workflowId: `greeting-workflow-${nanoid()}`
  }) 

  console.log(`Started workflow ${handle.workflowId}`)
  const result = await handle.result()
  console.log(result) 

}


run().catch((err) => {
    console.error(err)
    process.exit(1)
})