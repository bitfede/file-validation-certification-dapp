//CORE DEPENDENCIES
import React, { Component } from "react";
import Particles from 'react-particles-js';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AuthenticityContract from "../../contracts/Authenticity.json";
import getWeb3 from "../../utils/getWeb3";
import CryptoJS from "crypto-js";

//UI COMPONENTS
import { faChevronDown, faInfoCircle, faUpload, faStamp, faHourglassHalf, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ListGroup, ListGroupItem, Card, CardBody, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';

// assets & style
import extensions from '../../assets/fileIcons/';
import particlesConfig from '../../assets/backgrParticlesConfig.json';
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
      fileExtension: null,
      clickAnimation: 'shadow-pop-tr',
      clickAnimation2: '',
      fadeInAnimation: 'fade-in',
      errorBanner: true,
      isTxModalOpen: false,
      modalContent: null
    };
  }


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
      fileHash: this.state.fileHash,
      fileExtension: this.state.fileExtension
    }
    //triggers UI animation
    this.clickAnimation2()
    // Stores the file info into the blockchain
    await contract.methods.certifyFile(dataToWrite.fileSize, dataToWrite.fileHash, dataToWrite.fileExtension).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    this.getAcctHistory();
  };

  getAcctHistory = async () => {

    const { accounts, contract } = this.state;
    //call the get method of the contract
    let response
    try {
      response = await contract.getPastEvents("FileCertified", {
        filter: { author: accounts[0] },
        fromBlock: 6848381,
        toBlock: 'latest'
      });
    } catch (e) {
      console.error("[GETACCTHISTORY ERROR]", e);
      this.setState({web3: null, errorBanner: true}, this.forceUpdate)
      // return
    }
    //debug
    console.log(">>>>>>>>>", response, "getAcctHistory EVENTS>-----")
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
    const uplFileExtension = uplFile.name.split('.').pop()
    console.log(uplFile)
    const reader = new FileReader();
    reader.onload = (e) => {
      var arrayBuffer = e.target.result;

        var hashValue = CryptoJS.SHA256(this.arrayBufferToWordArray(arrayBuffer)).toString(CryptoJS.enc.Hex);
        this.setState({fileHash: hashValue, fileSize: uplFileSize, fileExtension: uplFileExtension}, () => {console.log("STATE >>", this.state)})
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

  toggleTxModal(keyElement) {
    let { isTxModalOpen } = this.state
    if (isTxModalOpen === false) {
      isTxModalOpen = true
      this.setState({
        isTxModalOpen,
        modalContent: this.state.accountHistory[keyElement]
      })
    } else {
      isTxModalOpen = false
      this.setState({
        isTxModalOpen,
        modalContent: null
      })
    }
  }

  timestampToDateStr(timestamp) {
    let theDate = new Date(timestamp * 1000)
    return theDate.toUTCString()
  }

  // UI RENDER FX

  outputFileHash = () => {
    if (this.state.fileHash === null) {
      return (null)
    }

    return (
      <div className={"stepsContainer"}>
        <h4 className={"tutorialSteps"}>Step 2:</h4>
        <p className={"tutorialParags"}>Review the metadata:</p>
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

    const interactions = this.state.accountHistory.map( (interaction, key) => {
      console.log("--> ", interaction)
      let myFileHash, iconImage, transactionID;
      myFileHash = interaction.returnValues.fileHash.substring(0, 15) + '...'
      transactionID = interaction.transactionHash.substring(0, 15) + '...'
      let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
      if (!extensions[interaction.returnValues.fileExtension]) {
        iconImage = extensions.file
      } else {
        iconImage = extensions[interaction.returnValues.fileExtension]
      }
      return (
          <Card className={"listItemTx"}  key={key}>
            <CardBody>
              <div className={"cardBodyCont"}>
                <div>
                  <img src={iconImage} className={"historyTxFileIcon"} />
                </div>
                <div className={"historyTxDataPointsCont"}>
                  <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
                  <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.returnValues.fileSize} bytes</b></p>
                  <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">🔐</span> Digital Signature: <b>{myFileHash}</b></p>
                  <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📒</span> Blockchain Transaction ID: <a target={"_blank"} href={`https://ropsten.etherscan.io/tx/${interaction.transactionHash}`}><b>{transactionID}</b></a> <FontAwesomeIcon icon={faExternalLinkAlt} /></p>
                  <div>
                    <Button onClick={() => this.toggleTxModal(key)} className={"getFileCertificate"}>Get Full Information</Button>
                  </div>
              </div>
              </div>

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

  generateModalContent() {
    const { modalContent } = this.state

    if (modalContent === null) {
      return null
    }

    console.log("MODALCONTENTTT", modalContent);

    return (
      <Modal animation={true} open={this.state.isTxModalOpen} toggle={() => this.toggleTxModal()}>
        <ModalHeader closeAriaLabel={"clusetubbon"}>
          File Notarization Details
        </ModalHeader>
        <ModalBody className={"modalBodyClass"}>

          <p><b>Submission Date:</b></p>
          <p>{this.timestampToDateStr(modalContent.returnValues.timestamp)}</p>
          <p><b>SHA256 File Hash:</b></p>
          <p><pre className={"modelHashData"}>{modalContent.returnValues.fileHash}</pre></p>
          <p><b>File Size:</b></p>
          <p>{modalContent.returnValues.fileSize}</p>
          <p><b>File Extension:</b></p>
          <p>{modalContent.returnValues.fileExtension}</p>
          <p><b>Blockchain Transaction:</b></p>
          <p className={"longParaTag"}><a target={"_blank"} href={`https://ropsten.etherscan.io/tx/${modalContent.transactionHash}`}><b>{modalContent.transactionHash}</b></a> <FontAwesomeIcon icon={faExternalLinkAlt} /></p>

        </ModalBody>
        <ModalFooter>
          <Button theme={"success"}>Download PDF Certificate</Button>
          <Button theme={"danger"} onClick={() => this.toggleTxModal()}>Close</Button>
        </ModalFooter>
      </Modal>
    )
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
            <h3 className={"mainh3title h3titleCta"}><Button onClick={ () => window.scrollTo({'behavior': 'smooth', 'left': 0, 'top': 450 }) } outline pill>CONTINUE</Button></h3>
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

      { this.generateModalContent() }
    </>
    )
  }
}

export default FileCertificatorPage
