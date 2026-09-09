import { Client, Connection } from "@temporalio/client";
import { greetingWorkflow, paymentStatusHooksWorkflow, webHookWorkFlow } from "./workflows.ts";
import { nanoid } from "nanoid";
import { DEFAULT_TASK_QUEUE } from "./constant.ts";

async function run() {
  const connection = await Connection.connect({ address: "localhost:7233" });

  const client = new Client({ connection });

  const greetingClient = await client.workflow.start(greetingWorkflow, {
    taskQueue: DEFAULT_TASK_QUEUE,
    args: ["Temporal"],
    workflowId: `greeting-workflow-${nanoid()}`,
  });

  console.log(`Started greeting workflow ${greetingClient.workflowId}`);
  const result = await greetingClient.result();
  console.log(result);

  const webhookClient = await client.workflow.execute(webHookWorkFlow, {
    taskQueue: DEFAULT_TASK_QUEUE,
    workflowId: `webhook-workflow-${nanoid()}`,
  });

  console.log(
    `Executed webhook workflow result ${JSON.stringify(webhookClient)}`,
  );

  const paymentStatusHooksClient = await client.workflow.execute(paymentStatusHooksWorkflow, {
    taskQueue: DEFAULT_TASK_QUEUE,
    workflowId: `payment-status-hooks-workflow-${nanoid()}`,
    args: [
      {
        endpoint: "http://localhost:9000/payment-status",
        status: "received",
        amount: "100",
        transactionId: "txn_123456",
      },
    ],
  });

  console.log(
    `Executed payment status hooks workflow result ${JSON.stringify(paymentStatusHooksClient)}`,
  );

  connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
