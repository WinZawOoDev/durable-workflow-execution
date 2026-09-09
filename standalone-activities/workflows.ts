import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities.ts";

const { greet, triggerWebHook, paymentStatusHooks } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "1 minute",
});

export async function greetingWorkflow(name: string): Promise<string> {
  return await greet(name);
}

export async function webHookWorkFlow(): Promise<Record<string, any>> {
  return await triggerWebHook();
}

export async function paymentStatusHooksWorkflow({
  endpoint,
  status,
  amount,
  transactionId,
}: {
  endpoint: string;
  status: string;
  amount: string;
  transactionId: string;
}): Promise<Record<string, any>> {
  return await paymentStatusHooks({ endpoint, status, amount, transactionId });
}
