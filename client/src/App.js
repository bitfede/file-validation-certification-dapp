import React, { Component } from "react";
import AuthenticityContract from "./contracts/Authenticity.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {

  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuthenticityContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuthenticityContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    // console.log(this.state, "##################")
    // Stores a given value, 5 by default.
    await contract.methods.set(124).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    console.log(response, "runexample method-----")
    //
    // // Update state with the result.
    this.setState({ storageValue: response });
  };

  refreshValue = async () => {
    const { accounts, contract } = this.state;

    //call the get method of the contract
    const response = await contract.methods.get().call();
    //debug
    console.log(response, "refreshValue method-----")
    //update the state with new value
    this.setState({storageValue: response})
  }

  uploadFile = async (e) => {
    console.log("*******")
    const file = e.target.files[0]
    console.log(file)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Certify the Existence of your file</h1>
        <p>By writing a timestamped digital signature of your file into the ethereum blockchain, you can matematically prove its existence and its integrity over time. <a href="#">Click here to learn more</a>.</p>
        <h2>Upload your file</h2>
        <div id="fileUplCont">
          <input type="file" id="fileCert" onChange={(e) => this.uploadFile(e)} />
        </div>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div><button onClick={() => this.refreshValue()}>Refresh Value</button></div>
      </div>
    );
  }
}

export default App;


//extra content to put:
// Please note that you files will NOT be uploaded and your data remain safe locally.
//
// All computation are done locally within your HTML browser.
// File Hashes can be used to verify the data integrity/identify e.g. game patches, virus identification
// It is possible for hash collision to happen (two different files have the same hashes), but very unlikely.
// If the downloaded files have different hashes than given, please do not open!
// Maximum supported local file size = 3G (1024 * 3M).
