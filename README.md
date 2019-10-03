# File Integrity & Existence Certificate Dapp

This Decentralized Application will take a SHA256 digital signature of your file and write it to the Ethereum blockchain to prove its existence at the present time and future integrity.

## Installation

Clone the repo and `npm install` inside the root folder and inside the `client/` folder.

## Run and Test on a local blockchain

Run `truffle develop` or start Ganache, make sure the correct port is specified in the `truffle-config.js` file.

Then run `truffle compile` to compile the solidity contracts into bytecode, and finally run `truffle migrate` to deploy them to the local blockchain.

Then `cd` into the `client` folder and run `npm start` to start the front end on `localhost:3000`.

You should now be on the browser, make sure you have MetaMask installed. Connect with MetaMask to the `Localhost PORT_NUMBER` blockchain.

Send some ether to the metamask address using the truffle console by entering `web3.eth.sendTransaction({ from: accounts[0], to: '0x123_YOUR_METAMASK_ADDRESS', value: 10000000000000000000 })`. This sends 10 ETH to MetaMask.

You are now ready to use the dApp on localhost.

*Keep in mind that every time you restart the local blockchain you have to migrate your contracts again and also reset MetaMask by going to SETTINGS > ADVANCED > RESET ACCOUNT.*

## Deploy on testnet

TODO
