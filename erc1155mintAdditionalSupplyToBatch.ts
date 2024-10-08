import { Engine } from "@thirdweb-dev/engine";
import * as dotenv from "dotenv";
dotenv.config();

// Hardcoding data here for example but ideally should import from a csv
const receivers = [
"0x04d0c90A28C842DeC69DEc186Ea7346E9F66bb4B",
"0xe6a44FA6a2c56a7072b317Df408307FD0Cb70dA4",
"0x9c47B567f2d936136963c5b1863fbb3B65D62641",
"0x66C5a0b40990Ce99DaF9D0697eb3577bCb947937",
"0x2DdF909c12cfb0f0345a5E16E016bAD09716Bd7D",
"0xeE76770c13203DF2aCf3E8A9D730BbD698A675D7",
"0x0293D30359Df295159471B1Bb860Bfa1F91c7281",
"0x408c96Eb2136bCeb9073fD5697050F1eaB740097",
"0x1912f3A1857786DEAd9CcBC547F893e672683a3a",
"0xF7c13a83BeF3cd813D1cD1eA03B3A2b2e277693c",
"0x57B10E52343239b70b38D7e2B753BB69C4c07272",
"0x34cdA292B237763C1A54eAFCA0263f5C80f64142",
"0x58CCeE6AAcb5A91B803174a27D00216EB151eD85",
"0x39C1FEe7751DEae2d096b00550e4ffd98b62E92b",
"0xdEba1e85460c6E2FA977957c74c01449aEB65A8a",
"0x87E31ba9c88d27a0E859758Dc932a545E921fbDC",
"0xfE8B9D9d53840A1dc3C0d1e93B0c1Be8c63a0601",
"0x87a709481E43a34888cfBDeb6cBD90cc0aB4050B",
"0x1D470D66F8DBc52ACD46d2E9651AB48eB53aE298",
"0x669bc5D03958c5845031cFB2A215C3a86e973d12",
"0xADC91E65C852fEC719b86Ec5df7282f6Ef69ED54",
"0x60c5d96f0F008DB17C7529A286A76b22d8dF0C03",
"0xd3e13EEE9735cFFa5c82c9921a7424723Fc3FaeD",
"0x2B77cdEE4BEf73F9C8954a454b79E7E098C69230",
"0x026Ea32f758e6C3568a1b3f92f7F198921406200",
"0x46Ae20Fc3388832F0eE226E48405B4999aF020a3",
"0x899a0C4f242755D60ee7e778A2028E9aea6568b0",
"0x75229C8268AE845e9eB0b71144B1b493C72d8fB3",
"0x44Fe94dA964F873c0Eb240239933c018E6C4B3a9",
"0x400019F0fDc5033EBc668C7DEf7Cd145f011D4b0",
"0x3f7F66d62d57cb845775E2E63dF84a650C16493f",
"0x725563176A245baAEB21db69BD88346B4508E937",
"0xD130dc0952D8d5C74D9281D482b032C5a5525eb4",
"0x4D2a5B20Ba0005c880Ac938C02ac95ad9bD9134b",
"0x7Fc2f609813a51569749CC2B204c667d159a5d64",
"0x0d62aE5C4A2Dc6dbe5Efe58b74826b14400a1b5C",
"0xFDa184B30b3f7729C71BceEE1501264F6730b13A",
"0x061324C578691C2dd59Dd88f01aB64FCD3dE168D",
"0xf3FEfcE047E6439d9239dfA9E273B8CC71C6362A",
"0xD7E32AceE48bd0a77eB3107e59805D8F92815158",
"0x504bFeFA2A64f94A7E279Ae86D7C70C3C3aEB6a3",
"0xAE0631d8396E303281009F3673a8af7eF72970Cb",
"0x1caA1dBCc3dFAE991753bA682260EE09F3597201",
"0xfd75E006748B3BbBe6c229Fa4CbB864f9EaEC563",
"0xa391e9Ae0531f08177FdA61b10ed7D5bc7b85D85",
"0x7447a510617849fbDA5f4c67cABaB7F85Cb7643d",
"0x5eE6e94F07B178CFD9e8612c7b068Fb02ee321c8",
"0x012c139f070a9488113900Bcbb7BEF9d9b5fC564",
"0x1f75565A55125c326Cfb0697403Fe2A5F06828ef",
"0xe7C98955CCAb0Dea3aBB84BD44931ac8F3573b1A",
"0x964749d012C7BfDB6C0aea15d2785b7C9b44Ea70",
"0x7E97eA36f716eCF7FD96C9378248C02B374A01F1",
"0x9fd17B99a2185f6296fd7791B6301895e166dB66",
"0x6A0Eea04C509064b59802E076C5048ce3076B446",
"0x7DEf305d7E26be1c7f0CB1605C9cd574d1Ba61E8",
"0x560055af1c4E1704ea812dfE5d48918555a3c277",
"0x17A0188c8440EdD428A28bC603227458e211EfdD",
"0xA55EE33825Fd7abAcD036282Aa091F9Fa9B2D5aa",
"0xfB0bd21b79cb6BDF8f2E61cE4D8cbeb707eeFA26",
"0x15a2BF6aE03477F4B42822B05e17D35EfDFf0dF2",
"0x7C3C7925A4E518Dc2A21C3e54337A059BD823AaE",
"0x0AEd321B58F290Cf4c605441d913B13A1E0aE19A",
"0x37D18a1594d756B3b239Dc6723e7E3cD12dDF9a9",
"0x06121bD2EA945b74D0b35e03Dd915E0909E00f4d",
"0xdb1a6Bc611fd813443B955C7F443669C0585e698",
"0xcF217455054aEbCbff53ccba63cb77D5e3305EC7",
"0x480c427c501FF62b540676B6dEF94024799DEB91",
"0xdb337AF2A0b261a85901d7Abc2D247f21fa4A312",
"0x11052028626D85c591bA6B8B0477ed35aE7625F6",
"0xC3C6ee48B67EEf88495b0E335077393A268b8964",
"0xED01ED1c118Ad5518Cecf0789E0bF2258AA2948B",
"0x93d15ceB4b0E70fF2B264A3E2FA8493E3Abf5923",
"0xC8FC5045e245cdBd9B0D3C2EA5B94a901bF4A36D",
"0xF4c02b56D7FC7c9Ba099F7B0a4C708A6C533f941",
"0xf9BEBc6824F0E3676705fd60D53BB30D47f61f21",
"0x0750f984606a9314A9FF77E8F4228A0A135508D7",
"0x6319d7b9d268F5158b770fDa54aF44468e761682",
"0x7B7485eDEE6fBe2aE3374Ef189a0E35a40953183",
"0x15293b064F0ABA185B6feEb74dd35efbFA40974e",
"0x4Ea502dEBcA893Ad88892dDc7c83929632050a16",
"0xd2Cc1784428CDf356c76d55606eC2C6cefE6b074",
"0x830aC842DAC9499474dF30a7b9b9Bc22c57C8de4",
"0x620379461AbdFE7604887eD640314fEaaBf3aF35",
"0xDC95AFC789f10ecfC99993Dc453687C476335927",
"0xF067163cC30877bDEdc33dA57060a11e11c67D67",
"0xd10Ac7D04e623Ad2D52910133768f12C5E2a82E1",
"0x84179CE05a1f13dF1df7a16506f7EBcD973ffe0F",
"0x116599A09813c4281Bb4310C99a345756d527ddF",
"0x1e49D9bB33137aC68fA713c872427B5F2A71401E",
"0xc918Ca17D8f5036a5092AC022cd4bB8BF601B7d6",
"0x416EEDE21277e02578815c964c6efFf5107b523d",
"0x3B5a475ed9555B15609eeD55D9515c3cB25Fce2B",
"0x8C98a0a4228f12ad8b9b7D8efb8636db96F7AD1d",
"0x2581763eD0318Ec4d8D47C39a1D2EAA28cda35B6",
"0x90683a749A99eB6F9BdFb9bC9fa6dD5E16D8bD24",
"0x17e5Eb4c686f1092E2A84Bd5aB6Bc778EcFEbDEd",
"0xE43E55eFD9Adc6A7b3331434eF71c167bb9Fa912",
"0x2fB51F1253739b8BD2600453E5Df04aa0310b12C",
"0x222332A30c32AE8764d1a03aEaB316723AB92a5e",
"0x334c531F30926963a482B5d8fBFE168b349f0316"
];

const tokenId = "0";
const additionalSupply = "10"; // Amount of additional supply to mint for each receiver
const batchSize = 20; // Number of addresses to process in each batch

const CHAIN_ID = "17000";
const BACKEND_WALLET_ADDRESS = process.env.BACKEND_WALLET as string;
const CONTRACT_ADDRESS = process.env.EDITION_CONTRACT_ADDRESS as string;

const engine = new Engine({
  url: process.env.ENGINE_URL as string,
  accessToken: process.env.ACCESS_TOKEN as string,
});

async function mintAdditionalSupplyToBatch(batch: string[]) {
  const mintPromises = batch.map(receiver =>
    engine.erc1155.mintAdditionalSupplyTo(
      CHAIN_ID,
      CONTRACT_ADDRESS,
      BACKEND_WALLET_ADDRESS,
      {
        receiver: receiver,
        tokenId: tokenId,
        additionalSupply: additionalSupply,
        txOverrides: {
          gas: "500000",
          maxFeePerGas: "1000000000",
          maxPriorityFeePerGas: "1000000000",
        },
      }
    )
  );

  const results = await Promise.all(mintPromises);
  return results.map(res => ({ queueId: res.result.queueId, receiver: batch[results.indexOf(res)] }));
}

async function pollToMine(queueId: string, receiver: string) {
  let mined = false;
  while (!mined) {
    try {
      const status = await engine.transaction.status(queueId);

      if (status.result.status === "mined") {
        mined = true;
        console.log(`Transaction mined! 🥳 Additional supply minted for receiver ${receiver}`, queueId);
        const transactionHash = status.result.transactionHash;
        const blockExplorerUrl = `https://holesky.beaconcha.in/tx/${transactionHash}`;
        console.log("View transaction on the blockexplorer:", blockExplorerUrl);
      } else if (status.result.status === "error") {
        console.error(`Additional supply mint failed for receiver ${receiver}`, queueId);
        console.error(status.result.errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
    }
  }
}

async function processBatches() {
  for (let i = 0; i < receivers.length; i += batchSize) {
    const batch = receivers.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(receivers.length / batchSize)}`);
    
    try {
      const mintResults = await mintAdditionalSupplyToBatch(batch);
      
      for (const result of mintResults) {
        await pollToMine(result.queueId, result.receiver);
      }
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error);
    }
    
    // Optional: Add a delay between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

processBatches();