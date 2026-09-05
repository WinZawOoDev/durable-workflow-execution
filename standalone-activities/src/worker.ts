import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities.js";

async function run() {

    const connection = await NativeConnection.connect({
        address: "localhost:7233",
    })


    try {
        const worker = await Worker.create({
            connection,
            namespace: "default",
            taskQueue: "standalone-activities",
            workflowsPath: require.resolve("./worker.ts"),
            activities
        })

        await worker.run();
    } finally {
        await connection.close();
    }

}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
