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
          <p className={"aboutPara1"}>This project was built to learn and practice ethereum dapp development concepts.</p>
          <p>I then realized how clever the use of blockchain is for basic notarization of files.</p>
          <h2 className={"h2Titles"}>What is it</h2>
        </div>
      </>
    )
  }
}

export default AboutPage
