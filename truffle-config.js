const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      // host: "localhost",
      port: 9545,
      network_id: "5777"
    },
    ropsten: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 3,
      gas: 4700000,
      from: "0x8874d4a8296fc415d0d8289b6d0682c964b78668"
    },
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 4,
      gas: 4700000,
      from: "0x6a1335bcc64630802a3edfbcdfea84de45608b27"
    }
  }
};
