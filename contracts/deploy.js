const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FHE Shield Secure Contract...");
  
  // Get the contract factory
  const FHEShieldSecure = await ethers.getContractFactory("FHEShieldSecure");
  
  // Deploy the contract
  const fheShieldSecure = await FHEShieldSecure.deploy();
  
  // Wait for deployment to complete
  await fheShieldSecure.waitForDeployment();
  
  const contractAddress = await fheShieldSecure.getAddress();
  
  console.log("FHE Shield Secure deployed to:", contractAddress);
  console.log("Contract owner:", await fheShieldSecure.owner());
  
  // Verify contract on Etherscan (optional)
  if (network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await fheShieldSecure.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
