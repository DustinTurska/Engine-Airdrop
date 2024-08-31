import { Engine } from "@thirdweb-dev/engine";
import type { Address } from "thirdweb";
import * as dotenv from "dotenv";
dotenv.config();

// Joe said hardcode so lets hardcode it
const data = [
  {
    toAddress: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0xD5D144c27673B434D734edE9DfA3624e0aE37d80",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0xbbc9b6b9735A24EC398f386F67F5e7eE6aD71b25",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0x8307A1F7583016b755e9ea80Acd68CE81B07b70B",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0xEbF505D787CF9518DE9799F3eDE01b230188F251",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0xF4917bce28177aE3E8497199B3Ba0195e485E055",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0x8CACB20637a1b3F3fD1fB605Da3C3ECbC5A3778c",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0x0db0f8E971287F11C44a87D68b8014Df78Fe54E2",
    amount: "1000000000000000000",
  },
  {
    toAddress: "0x829d9E61EFb24636Ec631446859CF5c5D210f919",
    amount: "1000000000000000000",
  },
];

const engine = new Engine({
  url: "https://solutions-demo.engine-usw2.thirdweb.com",
  accessToken: process.env.ACCESS_TOKEN as string,
});

const CONTRACT_ADDRESS = "0x5A2AF40244F192291f00E7e4950725fE912C549B";
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
  console.log(
    `Processing chunk ${i + 1}/${chunks.length} with ${chunk.length} receivers`
  );

  // Log the data being sent
  console.log("Sending data:", {
    chainId: CHAIN_ID,
    contractAddress: CONTRACT_ADDRESS,
    backendWalletAddress: BACKEND_WALLET_ADDRESS,
    data: chunk,
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
      }
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

        // Extract and log the transactionHash
        const transactionHash = status.result.transactionHash;

        // Construct and log the Blockscout URL
        const blockscoutUrl = `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
        console.log("View transaction on Blockscout:", blockscoutUrl);
      } else if (status.result.status === "error") {
        console.error("Transaction failed", queueId);
        console.error(status.result.errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }

    // Wait a random amount of time between 0 and 2 seconds to avoid synchronising requests and overloading the engine
    await randomStagger();
  }
}

async function randomStagger() {
  return await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 2000)
  );
}
