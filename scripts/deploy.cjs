const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FHEShieldSecure contract...");

  // Get the contract factory
  const FHEShieldSecure = await ethers.getContractFactory("FHEShieldSecure");

  // Deploy the contract
  const fheShieldSecure = await FHEShieldSecure.deploy();

  // Wait for deployment to complete
  await fheShieldSecure.waitForDeployment();

  const contractAddress = await fheShieldSecure.getAddress();
  console.log("FHEShieldSecure deployed to:", contractAddress);

  // Verify the contract on Etherscan (optional)
  if (network.name === "sepolia") {
    console.log("Waiting for block confirmations...");
    await fheShieldSecure.deploymentTransaction()?.wait(6);
    
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

  console.log("Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network.name);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: network.name,
    deployer: await fheShieldSecure.runner?.getAddress(),
    timestamp: new Date().toISOString(),
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
