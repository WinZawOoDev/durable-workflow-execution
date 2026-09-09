export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!, welcome to the standalone activities project.`;
}

export async function triggerWebHook(): Promise<Record<string, any>> {
  const res = await fetch(`http://localhost:9000`, {method: "POST"});
  const data = await res.json();

  return data as Record<string, any>;
}

export async function paymentStatusHooks({
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
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhooks-signature": "aHvj7WKQPFB1KU00WkUhJAtKXAHal40t",
    },
    body: JSON.stringify({ status, amount, transactionId: transactionId }),
  });

  const data = await res.json();
  return data as Record<string, any>;
}
