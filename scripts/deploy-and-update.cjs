const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 开始部署 FHEShieldSecure 合约到 Sepolia 测试网...");

  // 检查环境变量
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ 请设置 PRIVATE_KEY 环境变量");
  }

  if (!process.env.SEPOLIA_RPC_URL) {
    throw new Error("❌ 请设置 SEPOLIA_RPC_URL 环境变量");
  }

  console.log("✅ 环境变量检查通过");

  // 获取合约工厂
  const FHEShieldSecure = await ethers.getContractFactory("FHEShieldSecure");
  console.log("📦 合约工厂创建成功");

  // 部署合约
  console.log("⏳ 正在部署合约...");
  const fheShieldSecure = await FHEShieldSecure.deploy();

  // 等待部署完成
  await fheShieldSecure.waitForDeployment();
  const contractAddress = await fheShieldSecure.getAddress();
  
  console.log("✅ 合约部署成功!");
  console.log("📍 合约地址:", contractAddress);

  // 等待几个区块确认
  console.log("⏳ 等待区块确认...");
  await fheShieldSecure.deploymentTransaction()?.wait(6);

  // 验证合约
  if (network.name === "sepolia") {
    console.log("🔍 正在验证合约...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ 合约验证成功");
    } catch (error) {
      console.log("⚠️  合约验证失败:", error.message);
    }
  }

  // 创建部署信息
  const deploymentInfo = {
    contractAddress,
    network: network.name,
    deployer: await fheShieldSecure.runner?.getAddress(),
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    gasUsed: fheShieldSecure.deploymentTransaction()?.gasLimit?.toString(),
  };

  // 保存部署信息
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("📄 部署信息已保存到 deployment-info.json");

  // 更新 .env 文件
  console.log("🔧 更新 .env 文件...");
  const envPath = '.env';
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
    );
    envContent = envContent.replace(
      /DEPLOYMENT_TIMESTAMP=.*/,
      `DEPLOYMENT_TIMESTAMP=${new Date().toISOString()}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env 文件已更新");
  }

  // 更新合约地址到 useContract.ts
  console.log("🔧 更新合约地址到 useContract.ts...");
  const contractPath = 'src/hooks/useContract.ts';
  if (fs.existsSync(contractPath)) {
    let contractContent = fs.readFileSync(contractPath, 'utf8');
    contractContent = contractContent.replace(
      /const CONTRACT_ADDRESS = '0x\.\.\.';/,
      `const CONTRACT_ADDRESS = '${contractAddress}';`
    );
    fs.writeFileSync(contractPath, contractContent);
    console.log("✅ useContract.ts 已更新");
  }

  console.log("\n🎉 部署完成!");
  console.log("=".repeat(50));
  console.log("📋 部署摘要:");
  console.log(`📍 合约地址: ${contractAddress}`);
  console.log(`🌐 网络: ${network.name}`);
  console.log(`👤 部署者: ${deploymentInfo.deployer}`);
  console.log(`⏰ 时间: ${deploymentInfo.timestamp}`);
  console.log("=".repeat(50));
  
  console.log("\n📝 下一步:");
  console.log("1. 检查 deployment-info.json 文件");
  console.log("2. 验证 .env 文件中的合约地址");
  console.log("3. 运行 'npm run dev' 启动前端");
  console.log("4. 在 Sepolia 测试网上测试 FHE 功能");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
