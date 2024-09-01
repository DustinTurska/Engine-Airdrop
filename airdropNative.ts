import { Engine } from "@thirdweb-dev/engine";
import * as dotenv from "dotenv";
dotenv.config();

// Hardcoding data here for example but ideally should import from a csv
const data = [
  {
    toAddress: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56",
    amount: "10000000000000000",
  },
  {
    toAddress: "0xD5D144c27673B434D734edE9DfA3624e0aE37d80",
    amount: "10000000000000000",
  },
  {
    toAddress: "0xbbc9b6b9735A24EC398f386F67F5e7eE6aD71b25",
    amount: "10000000000000000",
  },
  {
    toAddress: "0x8307A1F7583016b755e9ea80Acd68CE81B07b70B",
    amount: "10000000000000000",
  },
  {
    toAddress: "0xEbF505D787CF9518DE9799F3eDE01b230188F251",
    amount: "10000000000000000",
  },
  {
    toAddress: "0xF4917bce28177aE3E8497199B3Ba0195e485E055",
    amount: "10000000000000000",
  },
  {
    toAddress: "0x8CACB20637a1b3F3fD1fB605Da3C3ECbC5A3778c",
    amount: "10000000000000000",
  },
  {
    toAddress: "0x0db0f8E971287F11C44a87D68b8014Df78Fe54E2",
    amount: "10000000000000000",
  },
  {
    toAddress: "0x829d9E61EFb24636Ec631446859CF5c5D210f919",
    amount: "10000000000000000",
  },
];

const CHAIN_ID = "17000";
const BACKEND_WALLET_ADDRESS = process.env.BACKEND_WALLET as string;

// Initialize the Engine
const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ACCESS_TOKEN as string,
});

const receivers = data.map((entry) => ({
  toAddress: entry.toAddress,
  value: entry.amount,
  data: "0x", // Replace with actual data if needed
  txOverrides: {
    gas: "530000",
    maxFeePerGas: "1000000000",
    maxPriorityFeePerGas: "1000000000",
    value: entry.amount,
  },
}));

async function sendTransactionBatch() {
  try {
    const res = await engine.backendWallet.sendTransactionBatch(
      CHAIN_ID,
      BACKEND_WALLET_ADDRESS,
      undefined,
      receivers.map((receiver) => ({
        toAddress: receiver.toAddress,
        value: receiver.value,
        data: receiver.data,
        txOverrides: {
          gas: receiver.txOverrides.gas,
          maxFeePerGas: receiver.txOverrides.maxFeePerGas,
          maxPriorityFeePerGas: receiver.txOverrides.maxPriorityFeePerGas,
          value: receiver.txOverrides.value,
        },
      }))
    );

    const queueIds: string[] = res.result.queueIds;
    console.log(
      "Transactions queued, queue IDs:",
      queueIds,
      "... waiting on the blockchain ..."
    );

    // Poll for each queue ID
    for (const queueId of queueIds) {
      await pollToMine(queueId);
    }
  } catch (error) {
    console.log("Error transferring Native", error);
  }
}

async function pollToMine(queueId: string) {
  let mined = false;
  while (!mined) {
    try {
      const status = await engine.transaction.status(queueId);

      if (status.result.status === "mined") {
        mined = true;
        console.log("Transaction mined! 🥳 Native has been sent", queueId);
        // Extract and log the transaction has
        const transactionHash = status.result.transactionHash;
        // Construct and log the Blockexplorer Url, make sure to update this based on your chain and explorer of choice
        const blockExplorerUrl = `https://holesky.beaconcha.in/tx/${transactionHash}`;
        console.log("View transaction on the blockexplorer:", blockExplorerUrl);
      } else if (status.result.status === "error") {
        console.error("Airdrop failed", queueId);
        console.error(status.result.errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
  }
}

sendTransactionBatch();