import React, { Component } from "react";
import Sketch from "./Sketch";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="app">
        <Sketch />
      </div>
    );
  }
}

export default App;
