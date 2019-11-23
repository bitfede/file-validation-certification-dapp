//CORE DEPENDENCIES
import React, { Component } from "react";
import Particles from 'react-particles-js';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AuthenticityContract from "../../contracts/Authenticity.json";
import getWeb3 from "../../utils/getWeb3";
import CryptoJS from "crypto-js";

//UI COMPONENTS
import { faChevronDown, faInfoCircle, faUpload, faStamp, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ListGroup, ListGroupItem, Card, CardBody, Button } from 'shards-react'

// assets & style
import particlesConfig from '../../assets/backgrParticlesConfig.json'
import "./FileCertificatorPage.css";

class FileCertificatorPage extends Component {

  constructor() {
    super()
    this.state = {
      accountHistory: null,
      web3: null,
      accounts: null,
      contract: null,
      fileHash: null,
      fileSize: null,
      fileExt: null,
      clickAnimation: 'shadow-pop-tr',
      clickAnimation2: '',
      fadeInAnimation: 'fade-in',
      errorBanner: true
    };
  }
  // TODO
  // make event listener for addr and list addr tx filter by `from: user_addr`


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
      console.error("[WEB3 ERROR]",error);
      this.setState({web3: null, errorBanner: true}, this.forceUpdate)
      return (<h1>connection error</h1>);
    }
  };

  certifyFile = async () => {
    const { accounts, contract } = this.state;
    const dataToWrite = {
      fileSize: this.state.fileSize,
      fileHash: this.state.fileHash
    }
    //triggers UI animation
    this.clickAnimation2()
    // Stores the file info into the blockchain
    await contract.methods.certifyFile(dataToWrite.fileSize, dataToWrite.fileHash).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    this.getAcctHistory();
  };

  getAcctHistory = async () => {

    const { accounts, contract } = this.state;
    //call the get method of the contract
    let response
    try {
      response = await contract.methods.getHistory().call({ from: accounts[0] });
    } catch (e) {
      console.error("[GETACCTHISTORY ERROR]", e);
      this.setState({web3: null, errorBanner: true}, this.forceUpdate)
      // return
    }
    //debug
    console.log(">>>>>>>>>", response, "getAcctHistory method-----")
    //update the state with new value and unlock the UI
    this.setState({accountHistory: response, errorBanner: false})

    console.log("KONTRAKT", contract);
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
    console.log("*******", e.target.files[0].name)
    const uplFile = e.target.files[0]
    const uplFileSize = uplFile.size
    const uplFileExt = uplFile.name.split('.').pop()
    console.log(uplFile)
    const reader = new FileReader();
    reader.onload = (e) => {
      var arrayBuffer = e.target.result;

        var hashValue = CryptoJS.SHA256(this.arrayBufferToWordArray(arrayBuffer)).toString(CryptoJS.enc.Hex);
        this.setState({fileHash: hashValue, fileSize: uplFileSize, fileExt: uplFileExt}, () => {console.log("STATE >>", this.state)})
    }
    reader.readAsArrayBuffer(uplFile);
  }

  clickAnimation = (e) => {
    this.setState({clickAnimation: 'shadow-pop-tr-inverse'})

    setTimeout( () => {
      this.setState({clickAnimation: 'shadow-pop-tr'})
    }, 100)
  }

  clickAnimation2 = (e) => {
    this.setState({clickAnimation2: 'pulsate-bck', fadeInAnimation: ''})

    setTimeout( () => {
      this.setState({clickAnimation2: ''})
    }, 500)
  }


  // UI RENDER FX

  outputFileHash = () => {
    if (this.state.fileHash === null) {
      return (null)
    }

    return (
      <div className={"stepsContainer"}>
        <h4 className={"tutorialSteps"}>Step 2:</h4>
        <p className={"tutorialParags"}>Review the metadata</p>
        <div className={"fileMetadataCont"}>
          <p className={"fileSignature fade-in"}>
            <u>SHA256 DIGITAL SIGNATURE:</u> <strong>{this.state.fileHash}</strong>
          </p>
          <p className={"fileSize fade-in"}><u>FILE SIZE (BYTES):</u></p>
          <p className={"fileSize2 fade-in"}><strong>{this.state.fileSize}</strong></p>
        </div>
      </div>
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
      const truncatedHash = interaction.fileHash.substring(0, 7)
      let dateStamp = new Date(interaction.timestamp * 1000)
      return (
        <Card className={"listItemTx"} key={counter++}>
          <CardBody>
            <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
            <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.fileSize}</b> bytes</p>
            <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">✍️</span>  Digital Signature: <b>{truncatedHash}...</b></p>
          </CardBody>

      </Card>
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
      <div className={"stepsContainer"}>
        <h4 className={"tutorialSteps"}>Step 3:</h4>
        <p className={"tutorialParags"}>Timestamp the metadata into the blockchain</p>
        <Button className={`${this.state.fadeInAnimation} ${this.state.clickAnimation2} certifyFileFinalBtn`} theme="success" onClick={() => this.certifyFile()} disabled={!this.state.fileHash} style={{padding: '20px'}}><FontAwesomeIcon icon={faStamp} ></FontAwesomeIcon>CERTIFY FILE</Button>
      </div>
    )
  }

  outputParticles() {
    if (this.state.errorBanner === false) {
      return (
        <Particles
          canvasClassName={"backParticles"}
          params={particlesConfig}
        />
      )
    }
  }


  render() {

    //load a loading screen on first load and errors
    if (!this.state.web3 || this.state.errorBanner === true) {
      return (
        <div className={"globalErrCont"}>
          <p>Loading Web3, accounts, and contract...</p>
          <FontAwesomeIcon className={"icon-spin"} size={"lg"} icon={faHourglassHalf} />
          <div className={"connectErrMsg"}>
            <h2>Troubleshooting:</h2>
            <p>If nothing happens, it means that no web3 compatible wallet was found or a connection error occurred.</p>
            <p>Keep in mind that you need a <a target="_blank" href="https://tokenmint.io/blog/web-3-enabled-ethereum-wallets-and-browsers.html">web3-enabled wallet</a> in order to interact with the ethereum blockchain through this web application.</p>
            <p>This dApp was built and tested using <a target="_blank" href="https://metamask.io/">Metamask</a>. It was not formally tested with other wallets.</p>
            <p className={"testnetWarning"}>ALSO MAKE SURE YOU ARE CONNECTED TO THE ROPSTEN TESTNET</p>
          </div>
        </div>
      );
    }


    return (
      <>
      {this.outputParticles()}
      <div className={"globalCont"} justify="center">
        <section>
          <div id={"heroTitles"}>
            <h1 className={"mainh1title"}>Decentralized File Notarization</h1>
            <h2 className={"mainh2title"}>Certify the Existence of any file</h2>
            <p className={"introPara"}>By writing a timestamped digital signature of your file into the ethereum blockchain, you can mathematically prove its existence and its integrity over time. <a href="https://en.wikipedia.org/wiki/File_verification">Click here to learn more</a>.</p>
            <h3 className={"mainh3title h3titleCta"}><Button onClick={ () => window.scrollTo({'behavior': 'smooth', 'left': 0, 'top': 400 }) } outline pill>CONTINUE</Button></h3>
          </div>
          <div className={"chevronContainer"}>
            <FontAwesomeIcon id={"chevron1"} className={"chevrons shake-vertical"} size='lg' icon={faChevronDown} />
          </div>

          <div id="fileUplCont">
            <div className={"stepsContainer"}>
            <h4 className={"tutorialSteps"}>Step 1:</h4>
            <p className={"tutorialParags"}>Select the file that you want to notarize</p>
            </div>
            <Button size={'lg'} onClick={() => this.clickAnimation()} className={`certifyBtn ${this.state.clickAnimation}`}><label htmlFor="fileCert"> <FontAwesomeIcon id={"uploadIcon"} icon={faUpload} />CHOOSE FILE</label></Button>
            <input id="fileCert" name="fileCert" type="file" onChange={(e) => this.uploadFile(e)} />


            {this.outputFileHash()}
            {this.renderCertifyBtn()}

          </div>
      </section>

      <div className={"pastInterContainer"}>
          <h2 className={"mainh2title pastInteractionsTit"}>Previous Interactions</h2>
          {this.outputHistory()}
      </div>

    </div>
    </>
    )
  }
}

export default FileCertificatorPage
