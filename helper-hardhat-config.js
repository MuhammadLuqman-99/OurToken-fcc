const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on kovan
    42: {
        name: "kovan",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
}

const INITIAL_SUPPLY = "1000000000000000000000000"

const  developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    INITIAL_SUPPLY,
    developmentChains,
}