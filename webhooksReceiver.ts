import { createServer } from "node:http";
import { randomUUID } from "crypto";

const appState = {
  requestId: "",
  requestCount: 0,
};

const server = createServer(async (req, res) => {
  console.log("Request received:", "Method:", req.method, "URL:", req.url);

  const url = new URL(req.url ?? "", `http://${req.headers.host}`);

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Method Not Allowed" }));
    return;
  }

  const webhooksSignature = req.headers["x-webhooks-signature"];
  if (!webhooksSignature) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Missing Webhooks Signature" }));
    return;
  }

  if (url.pathname.startsWith("/payment-status")) {
    console.log("Payment status webhook received");

    const requestBody = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        resolve(body);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });

    console.log("Payment status request body:", requestBody);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Payment status received" }));
    return;
  }

  appState.requestId = randomUUID();
  appState.requestCount += 1;

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const responsePayload = {
    message: `Request received with Method: ${req.method}, URL: ${url.pathname}`,
    ...appState,
  };

  res.end(JSON.stringify(responsePayload));
  return;
});

const PORT = 9000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
