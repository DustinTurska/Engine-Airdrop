import { Engine } from "@thirdweb-dev/engine";
import * as dotenv from "dotenv";
dotenv.config();

// Should import from csv but here we are hardcoding this
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
  }
];

const CHAIN_ID = "84532";
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
      receivers.map(receiver => ({
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

    console.log("Batch sent, response:", res);
  } catch (error) {
    console.error("Error sending batch:", error);
  }
}

sendTransactionBatch();
