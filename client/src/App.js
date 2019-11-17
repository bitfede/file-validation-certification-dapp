import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import FileCertificatorPage from './components/FileCertificatorPage/FileCertificatorPage'
import NavBar from './components/NavBar/NavBar'
import FaqPage from './components/FaqPage/FaqPage'
import AboutPage from './components/AboutPage/AboutPage'

import AuthenticityContract from "./contracts/Authenticity.json";

import getWeb3 from "./utils/getWeb3";
import CryptoJS from "crypto-js";

// import default style
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import "./App.css";

class App extends Component {


  render() {

    return (
      <div className="App">
      <NavBar />
      <Router>
      <Route exact path="/" component={FileCertificatorPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/about" component={AboutPage} />

      </Router>
      <footer>
        <p className={"footerText"}>© 2020 | Made by <a target="_blank" href={"http://defaverifederi.co"}>Federico De Faveri</a></p>
        <p className={"footerText2"}>A <a target="_blank" href="https://blockchainlion.com">BlockchainLion</a> Project. Supported by <a target="_blank" href={"https://keenn.com"}>Keenn</a> R&D.</p>
    </footer>
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
