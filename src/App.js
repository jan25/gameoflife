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
        <h2>Game of Life</h2>
        <Sketch />
      </div>
    );
  }
}

export default App;
