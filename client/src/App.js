import React, { Component } from "react";
import AuthenticityContract from "./contracts/Authenticity.json";
import getWeb3 from "./utils/getWeb3";
import CryptoJS from "crypto-js";


import "./App.css";

class App extends Component {

  state = {
    accountHistory: null,
    web3: null,
    accounts: null,
    contract: null,
    fileHash: null,
    fileSize: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      //
      // // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuthenticityContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuthenticityContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getAcctHistory);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  certifyFile = async () => {
    const { accounts, contract } = this.state;
    const dataToWrite = {
      fileSize: this.state.fileSize,
      fileHash: this.state.fileHash
    }
    // Stores the file info into the blockchain
    await contract.methods.certifyFile(dataToWrite.fileSize, dataToWrite.fileHash).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    this.getAcctHistory();
  };

  getAcctHistory = async () => {
    const { accounts, contract } = this.state;
    //call the get method of the contract
    const response = await contract.methods.getHistory().call({ from: accounts[0] });
    //debug
    console.log(">>>>>>>>>", response, "getAcctHistory method-----")
    //update the state with new value
    this.setState({accountHistory: response})
  }

  arrayBufferToWordArray = (ab) => {
  var i8a = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
  }

  uploadFile = async (e) => {
    console.log("*******")
    const uplFile = e.target.files[0]
    const uplFileSize = uplFile.size
    console.log(uplFile)
    const reader = new FileReader();
    reader.onload = (e) => {
      var arrayBuffer = e.target.result;

        var hashValue = CryptoJS.SHA256(this.arrayBufferToWordArray(arrayBuffer)).toString(CryptoJS.enc.Hex);
        this.setState({fileHash: hashValue, fileSize: uplFileSize}, () => {console.log("STATE >>", this.state)})
    }
    reader.readAsArrayBuffer(uplFile);
  }

  outputFileHash = () => {
    if (this.state.fileHash === null) {
      return (<p>No File Uploaded</p>)
    }

    return (
      <p>This file's digital signature is: <b>{this.state.fileHash}</b> </p>
    )

  }

  outputHistory = () => {
    if (this.state.accountHistory === null) {
      return (<p>Loading past interactions...</p>)
    }
    let counter = 0;
    const interactions = this.state.accountHistory.map( (interaction) => {
      console.log("--> ", interaction)
      let dateStamp = new Date(interaction.timestamp * 1000)
      return (
        <div key={counter++} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '50px', padding: '10px', border: '2px solid black'}}>
          <p>File Size: <b>{interaction.fileSize}</b> bytes</p>
          <p style={{textAlign: 'start'}}>Digital Signature: <b>{interaction.fileHash}</b></p>
          <p>TimeStamp: <b>{dateStamp.toUTCString()}</b></p>
        </div>
      )
    })

    return (
      <div>
        {interactions}
      </div>
    )
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Certify the Existence of any file</h1>
        <p>By writing a timestamped digital signature of your file into the ethereum blockchain, you can matematically prove its existence and its integrity over time. <a href="https://en.wikipedia.org/wiki/File_verification">Click here to learn more</a>.</p>
        <h2>Upload your file</h2>
        <div id="fileUplCont" >
          <input type="file" id="fileCert" onChange={(e) => this.uploadFile(e)} />
        </div>
        <div>
          {this.outputFileHash()}
        </div>
        <div>
          <p>Text descr:</p>
          <button onClick={() => this.certifyFile()} disabled={!this.state.fileHash} style={{padding: '20px'}}>CERTIFY FILE SIGNATURE ON BLOCKCHAIN</button>
        </div>
        <hr />
        <h2>Previous Interactions</h2>
        {this.outputHistory()}
        <hr />
        <p style={{fontSize: '0.5rem'}}>created by fgdf</p>
        {/*<div><button onClick={() => this.refreshValue()}>Refresh Value</button></div>*/}
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
