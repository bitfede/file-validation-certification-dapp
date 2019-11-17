//CORE DEPENDENCIES
import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

//UI COMPONENTS

// assets & style
import "./AboutPage.css";

class AboutPage extends Component {

  constructor() {
    super()
    this.state = {
      test: null
    };
  }

  componentDidMount = async () => {
    try {

      this.setState({ test: "ok" });

    } catch (error) {
      // Catch any errors for any of the above operations.
      return (<h1>Error</h1>);
      console.error(error);
    }

  };


  // UI RENDER FX

  render() {


    return (
      <>
        <div id={"globalCont"}>
          <h1 id={"mainAboutTitle"}>About</h1>
          <p className={"aboutPara"}>This project was built to learn and practice ethereum dapp development concepts.</p>
          <p className={"aboutPara"}>I then realized how clever the use of blockchain is for basic notarization of files.</p>
          <h2 className={"h2Titles"}>What is it</h2>
          <p className={"aboutPara"}>This is a web frontend that interact with a smart contract throught the web3.js library. The smart contract accepts file metadata as input and writes it with a timestamp in the ethereum blockchain.</p>
          <p className={"aboutPara"}>This effectively <b>notarizes</b> a file because the file hash that is written on the blockchain cannot be deleted, so you are also always able to prove that the file was never changed by simply comparing the current and timestamped hash values.</p>
          <h2 className={"h2Titles"}>What can I use it for?</h2>
          <p className={"aboutPara"}>Take a picture of your car and timestamp it to undeniably prove insurance companies that today your car was not scratched.</p>
          <p className={"aboutPara"}>Timestamp a contract pdf's hash as soon as you and your client sign it, so you always have an uncorruptible proof of what you signed</p>
          <p className={"aboutPara"}>Ownership of patents or intellectual property when you cannot afford a lawyer. Timestamp the hash of your creations' files and prove that you owned these files at that date.</p>
          <p className={"aboutPara"}>And many more examples...</p>
          <h2 className={"h2Titles"}>Work in progress</h2>
          <p className={"aboutPara"}>I am developing this dapp on my free time, now it is in beta and running on a testnet.</p>
          <h2 className={"h2Titles"}>Thanks</h2>
          <p className={"aboutPara"}>Special thanks to the <a target="_blank" href="https://keenn.com">Keenn</a> agency for the engineering support.</p>
        </div>
      </>
    )
  }
}

export default AboutPage
