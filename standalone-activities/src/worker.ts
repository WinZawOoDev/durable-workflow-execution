import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities.ts";
import { fileURLToPath } from "node:url";
import { DEFAULT_NAMESPACE, DEFAULT_TASK_QUEUE } from "./constant.ts";

async function run() {

    const connection = await NativeConnection.connect({
        address: "localhost:7233",
    })

    const worker = await Worker.create({
        connection,
        namespace: DEFAULT_NAMESPACE,
        taskQueue: DEFAULT_TASK_QUEUE, 
        workflowsPath: fileURLToPath(
            new URL("./workflows.ts", import.meta.url)
        ),
        activities
    })

    await worker.run();

}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});