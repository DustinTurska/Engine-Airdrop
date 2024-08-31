import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

// Hardcoded data
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
  // Add other entries as needed
];

const CHAIN_ID = "84532";
const BACKEND_WALLET_ADDRESS = "0x...";

// Transform the hardcoded data into the new request format
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
    const response = await axios.post(
      `ENGINE_URL/${CHAIN_ID}/send-transaction-batch`,
      receivers, // Pass the receivers array as the body
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
          'x-backend-wallet-address': BACKEND_WALLET_ADDRESS,
        },
      }
    );

    console.log("Batch sent, response:", response.data);
  } catch (error: any) { // Explicitly type error as 'any'
    if (axios.isAxiosError(error)) {
      console.error("Error sending batch:", error.response ? error.response.data : error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

sendTransactionBatch();
