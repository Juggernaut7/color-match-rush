import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// cUSD contract address on Celo Sepolia
const CUSD_ADDRESS = "0x6c23508A9b310C5f2eb2e2eFeBeB748067478667";

const ColorMatchRushTreasuryModule = buildModule("ColorMatchRushTreasuryModule", (m) => {
  const cUSD = m.getParameter("cUSD", CUSD_ADDRESS);
  
  const treasury = m.contract("ColorMatchRushTreasury", [cUSD]);
  
  return { treasury };
});

export default ColorMatchRushTreasuryModule;


