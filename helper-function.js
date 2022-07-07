// We can't have these function in our `helper-hardhat-config`
// Since these use the libary
// and it would be a circular dependecy
// untuk verify contract
const { run, network } = require("hardhat")
const { networkConfig } = require("./helper-hardhat-config")

const verify = async (contractAddress, args) => {
  console.log("Verifying Contract....")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified")
    } else {
      console.log(e)
    }
  }
}

module.exports = {
  verify,
}
