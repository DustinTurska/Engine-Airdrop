import { Engine } from "@thirdweb-dev/engine";
import type { Address } from "thirdweb";

// Joe said hardcode so lets hardcode it
const data = [
  {
    toAddress: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56",
    amount: "1000000000000000000"
  },
  {
    toAddress: "0xD5D144c27673B434D734edE9DfA3624e0aE37d80",
    amount: "1000000000000000000"
  },
  {
    toAddress: "0xbbc9b6b9735A24EC398f386F67F5e7eE6aD71b25",
    amount: "1000000000000000000"
  }
];

const engine = new Engine({
  url: "https://solutions-demo.engine-usw2.thirdweb.com",
  accessToken: "ENGINE_ACCESS_TOKEN",
});

const CONTRACT_ADDRESS = "0x9Ce6B8256a6df56F104018a8988f52BB094e91DF";
const CHAIN_ID = "84532";
const BACKEND_WALLET_ADDRESS = "0xEA539E14a34d3aD3C2B788920bcBd803aa52B6dD";

// Define the type for a receiver
type Receiver = {
  toAddress: Address;
  amount: string;
};

// Use the hardcoded data
const receivers: Receiver[] = data.map((entry) => ({
  toAddress: entry.toAddress as Address,
  amount: entry.amount,
}));

// Chunk receivers into batches of 250
const chunks: Receiver[][] = [];
while (receivers.length) {
  chunks.push(receivers.splice(0, 250));
}

let numberMined = 0;

// for each chunk, mint the batch
chunks.forEach(async (chunk, i) => {
  console.log(`Processing chunk ${i + 1}/${chunks.length} with ${chunk.length} receivers`);

  // Log the data being sent
  console.log("Sending data:", {
    chainId: CHAIN_ID,
    contractAddress: CONTRACT_ADDRESS,
    backendWalletAddress: BACKEND_WALLET_ADDRESS,
    data: chunk
  });

  // wait a random amount of time between 0 and 2 seconds to avoid synchronising requests and overloading the engine. Crashed Engine too many times here
  await randomStagger();

  try {
    const res = await engine.erc20.mintBatchTo(
      CHAIN_ID,
      CONTRACT_ADDRESS,
      BACKEND_WALLET_ADDRESS,
      {
        data: chunk,
      },
    );

    const queueId = res.result.queueId;
    console.log("Batch queued, queue ID: ", queueId, "... now waiting to mine");
    await pollToMine(queueId);
  } catch (error) {
    console.error("Error minting batch:", error);
  }
});

async function pollToMine(queueId: string) {
  let mined = false;
  while (!mined) {
    try {
      const status = await engine.transaction.status(queueId);

      if (status.result.status === "mined") {
        mined = true;
        console.log("Transaction mined! 🎉", queueId);
        console.log(`Mined batches ${++numberMined}/${chunks.length}`);
      } else if (status.result.status === "error") {
        console.error("Transaction failed", queueId);
        console.error(status.result.errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }

    // wait a random amount of time between 0 and 2 seconds to avoid synchronising requests and overloading the engine
    await randomStagger();
  }
}

async function randomStagger() {
  return await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 2000),
  );
}
