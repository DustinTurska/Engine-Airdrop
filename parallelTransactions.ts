import { Engine } from "@thirdweb-dev/engine";
import type { Address } from "thirdweb";
import * as dotenv from "dotenv";
dotenv.config();

const erc721Data = [
  {
    receiver: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56",
    quantity: 1,
  }
];

const erc1155Data = [
  {
    receiver: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56",
    tokenId: "0",
    quantity: 1,
  }
];

const erc20Data = [
  { toAddress: "0x7ADf64112b451Bb510a38d9D18063e9D0F42dF56", amount: "1000000000000000000" },
];

const CHAIN_ID_ERC721_ERC1155 = "17000";
const CHAIN_ID_ERC20 = "84532";
const BACKEND_WALLET_ADDRESS = process.env.BACKEND_WALLET as string;
const ERC721_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const ERC1155_CONTRACT_ADDRESS = process.env.EDITION_DROP_CONTRACT_ADDRESS as string;
const ERC20_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ACCESS_TOKEN as string,
});

async function claimERC721() {
  try {
    for (const entry of erc721Data) {
      const res = await engine.erc721.claimTo(
        CHAIN_ID_ERC721_ERC1155,
        ERC721_CONTRACT_ADDRESS,
        BACKEND_WALLET_ADDRESS,
        {
          receiver: entry.receiver,
          quantity: entry.quantity.toString(),
          txOverrides: {
            gas: "530000",
            maxFeePerGas: "1000000000",
            maxPriorityFeePerGas: "1000000000",
          },
        }
      );

      console.log("ERC721 Claim initiated, queue ID:", res.result.queueId);
      await pollToMine(res.result.queueId, "ERC721", CHAIN_ID_ERC721_ERC1155);
    }
  } catch (error) {
    console.log("Error claiming ERC721 tokens", error);
  }
}

async function claimERC1155() {
  try {
    for (const entry of erc1155Data) {
      const res = await engine.erc1155.claimTo(
        CHAIN_ID_ERC721_ERC1155,
        ERC1155_CONTRACT_ADDRESS,
        BACKEND_WALLET_ADDRESS,
        {
          receiver: entry.receiver,
          tokenId: entry.tokenId,
          quantity: entry.quantity.toString(),
          txOverrides: {
            gas: "530000",
            maxFeePerGas: "1000000000",
            maxPriorityFeePerGas: "1000000000",
          },
        }
      );

      console.log("ERC1155 Claim initiated, queue ID:", res.result.queueId);
      await pollToMine(res.result.queueId, "ERC1155", CHAIN_ID_ERC721_ERC1155);
    }
  } catch (error) {
    console.log("Error claiming ERC1155 tokens", error);
  }
}

async function airdropERC20() {
  const receivers: { toAddress: Address; amount: string }[] = erc20Data.map((entry) => ({
    toAddress: entry.toAddress as Address,
    amount: entry.amount,
  }));

  const chunks: typeof receivers[] = [];
  while (receivers.length) {
    chunks.push(receivers.splice(0, 250));
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing ERC20 chunk ${i + 1}/${chunks.length} with ${chunk.length} receivers`);

    try {
      const res = await engine.erc20.mintBatchTo(
        CHAIN_ID_ERC20,
        ERC20_CONTRACT_ADDRESS,
        BACKEND_WALLET_ADDRESS,
        { data: chunk }
      );

      console.log("ERC20 Batch queued, queue ID:", res.result.queueId);
      await pollToMine(res.result.queueId, "ERC20", CHAIN_ID_ERC20);
    } catch (error) {
      console.error("Error minting ERC20 batch:", error);
    }
  }
}

async function pollToMine(queueId: string, tokenType: string, chainId: string) {
  let mined = false;
  while (!mined) {
    try {
      const status = await engine.transaction.status(queueId);

      if (status.result.status === "mined") {
        mined = true;
        console.log(`Transaction mined! 🎉 ${tokenType} operation completed`, queueId);
        const transactionHash = status.result.transactionHash;
        if (transactionHash) {
          const blockExplorerUrl = getBlockExplorerUrl(chainId, transactionHash);
          console.log("View transaction on block explorer:", blockExplorerUrl);
        } else {
          console.log("Transaction hash is not available");
        }
      } else if (status.result.status === "error") {
        console.error(`${tokenType} operation failed`, queueId);
        console.error(status.result.errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
  }
}

function getBlockExplorerUrl(chainId: string, transactionHash: string): string {
  switch (chainId) {
    case "17000":
      return `https://holesky.beaconcha.in/tx/${transactionHash}`;
    case "84532":
      return `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
    default:
      return `Unknown block explorer for chain ID ${chainId}`;
  }
}

async function executeAll() {
  await Promise.all([claimERC721(), claimERC1155(), airdropERC20()]);
}

executeAll();