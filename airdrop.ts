import { Engine } from "@thirdweb-dev/engine";
import type { Address } from "thirdweb";

const engine = new Engine({
  url: "https://solutions-demo.engine-usw2.thirdweb.com",
  accessToken: "ACCESS_TOKEN",
});

const CONTRACT_ADDRESS = "0x9Ce6B8256a6df56F104018a8988f52BB094e91DF";
const CHAIN_ID = "84532";
const BACKEND_WALLET_ADDRESS = "0xEA539E14a34d3aD3C2B788920bcBd803aa52B6dD";

// Define the type for a receiver
type Receiver = {
    toAddress: Address;
    amount: string;
};

// Define your list of addresses here
const addresses: Address[] = [
    "0x71B6267b5b2b0B64EE058C3D27D58e4E14e7327f",
    "0xA1B2C3D4E5F67890123456789012345678901234",
    "0x5A9e17c8d6D7020C7E0b1b46A7B9fE50d6C3E5E2",
    "0x8B1D64f5c3F02b4C4D0eD4C15C6A3bF65F6aD9E3",
    "0x1F6eC7b3D8E3eB1D9F1F8F3eD7F2E8A0B2C3D4E5",
    "0x9E4A1b2D8F5C9e1D6A1C2B3D4E5F6A7B8C9D0E1",
    "0x4F7E1D6C2A9B3E0D8F6C5A4E3B2D1F8C9A0E1B2"
  ];

// Create a list of receivers using the addresses
const receivers: Receiver[] = addresses.map((address) => ({
  toAddress: address,
  amount: "1000000000000000000", // Adjust amount as needed
}));

// Chunk receivers into batches of 250
const chunks: Receiver[][] = [];
while (receivers.length) {
  chunks.push(receivers.splice(0, 250));
}

let numberMined = 0;

// For each chunk, mint the batch
chunks.forEach(async (chunk, i) => {
  // Wait a random amount of time between 0 and 2 seconds to avoid synchronizing requests and overloading the engine
  await randomStagger();

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
});

async function pollToMine(queueId: string) {
  let mined = false;
  while (!mined) {
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
    // Wait a random amount of time between 0 and 2 seconds to avoid synchronizing requests and overloading the engine
    await randomStagger();
  }
}

async function randomStagger() {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 2000),
  );
}
