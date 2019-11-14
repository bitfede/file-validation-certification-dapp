//CORE DEPENDENCIES
import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AuthenticityContract from "../../contracts/Authenticity.json";
import getWeb3 from "../../utils/getWeb3";
import CryptoJS from "crypto-js";

//UI COMPONENTS
import { FlexboxGrid, Button } from 'rsuite';
import { List, Panel, Icon } from 'rsuite';

// style
import "./FileCertificatorPage.css";

class FileCertificatorPage extends Component {

  state = {
    accountHistory: null,
    web3: null,
    accounts: null,
    contract: null,
    fileHash: null,
    fileSize: null
  };

  // TODO
  // make event listener for addr and list addr tx filter by `to:contract_acct`


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3(); //PASS AS PROP
      //
      // Use web3 to get the user's accounts.
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
      return (<h1>connection error</h1>);
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
      return (null)
    }

    return (
      <p className={"fileSignature"}>This file's digital signature is: <b>{this.state.fileHash}</b> </p>
    )

  }

  outputHistory = () => {
    if (this.state.accountHistory === null) {
      return (<p>Loading past interactions...</p>)
    } else if (this.state.accountHistory.length === 0) {
      return (<p>You haven't yet certified a file with this metamask address.</p>)
    }
    let counter = 0;
    const interactions = this.state.accountHistory.map( (interaction) => {
      console.log("--> ", interaction)
      let dateStamp = new Date(interaction.timestamp * 1000)
      return (
        <Panel header={dateStamp.toUTCString().slice(0, 16)} shaded collapsible className={"listItemTx"} key={counter++}>
          <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
          <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.fileSize}</b> bytes</p>
          <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">✍️</span>  Digital Signature: <b>{interaction.fileHash}</b></p>
        </Panel>
      )
    })

    return (
      <div className={"pastInteractionBox"}>
        {interactions}
      </div>
    )
  }

  renderCertifyBtn() {
    if (!this.state.fileHash) {
      return (
        null
      )
    }

    return (
      <Button onClick={() => this.certifyFile()} disabled={!this.state.fileHash} style={{padding: '20px'}}>CERTIFY FILE ON THE BLOCKCHAIN</Button>
    )
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <FlexboxGrid className={"globalCont"} justify="center">
        <FlexboxGrid.Item align={"middle"} colspan={24} md={12}>
        <h1 className={"mainh1title"}>Decentralized File Certifier dApp</h1>
        <h2 className={"mainh2title"}>Certify the Existence of any file</h2>
        <p className={"introPara"}>By writing a timestamped digital signature of your file into the ethereum blockchain, you can matematically prove its existence and its integrity over time. <a href="https://en.wikipedia.org/wiki/File_verification">Click here to learn more</a>.</p>
        <h3 className={"mainh3title"}>Upload your file</h3>

        <div id="fileUplCont">
          <label className={"fileCertLabel"} htmlFor="fileCert"><Icon id={"uploadIcon"} icon='upload2' size="lg" /><span>Tap here to start uploading</span></label>
          <input id="fileCert" name="fileCert" type="file" onChange={(e) => this.uploadFile(e)} />
        </div>

        <div>
          {this.outputFileHash()}
        </div>
        <div>

          {this.renderCertifyBtn()}

        </div>
        </FlexboxGrid.Item>
        <hr  />
        <FlexboxGrid.Item align={"middle"} colspan={24} md={12}>
        <h2 className={"mainh2title"}>Previous Interactions</h2>
        {this.outputHistory()}
        <hr />
        <p style={{fontSize: '0.5rem'}}>created by fgdf</p>
        {/*<div><button onClick={() => this.refreshValue()}>Refresh Value</button></div>*/}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  }
}

export default FileCertificatorPage
