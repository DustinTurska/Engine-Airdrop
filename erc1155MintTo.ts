import { Engine } from "@thirdweb-dev/engine";
import * as dotenv from "dotenv";
dotenv.config();

const data = [
  {
    receiver: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56",
    metadataWithSupply: {
        "metadata": {
            "name": "My Engine NFT",
            "description": "This is my token created via Engine",
            "image": "ipfs://QmSvVdTWEzE1JExVYxwJHhaNDzAyzJEJWA1tWbHbnT6E9V/0.avif"
        },
        "supply": "5"
    },
  }
];

const CHAIN_ID = "17000";
const BACKEND_WALLET_ADDRESS = process.env.BACKEND_WALLET as string;
const CONTRACT_ADDRESS = process.env.EDITION_CONTRACT_ADDRESS as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ACCESS_TOKEN as string,
});

async function mintTo() {
    try {
      for (const entry of data) {
        const res = await engine.erc1155.mintTo(
          CHAIN_ID,
          CONTRACT_ADDRESS,
          BACKEND_WALLET_ADDRESS,
          {
            receiver: entry.receiver,
            metadataWithSupply: entry.metadataWithSupply,
            txOverrides: {
              gas: "530000",
              maxFeePerGas: "1000000000",
              maxPriorityFeePerGas: "1000000000",
            },
          }
        );
  
        console.log("Claim initiated, queue ID:", res.result.queueId);
        await pollToMine(res.result.queueId);
      }
    } catch (error) {
      console.log("Error claiming ERC1155 tokens", error);
    }
  }

async function pollToMine(queueId: string) {
  let mined = false;
  while (!mined) {
    try {
      const status = await engine.transaction.status(queueId);

      if (status.result.status === "mined") {
        mined = true;
        console.log("Transaction mined! 🥳 ERC1155 token has been claimed", queueId);
        const transactionHash = status.result.transactionHash;
        const blockExplorerUrl = `https://holesky.beaconcha.in/tx/${transactionHash}`;
        console.log("View transaction on the blockexplorer:", blockExplorerUrl);
      } else if (status.result.status === "error") {
        console.error("Claim failed", queueId);
        console.error(status.result.errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
  }
}

mintTo();