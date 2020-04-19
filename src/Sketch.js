import React, { Component } from "react";
import p5 from "p5";
import _ from "lodash";
import "./Sketch.css";

const GAME_HEIGHT_PER = 0.8;
const GAME_WIDTH_PER = 1;
const FRAME_RATE = 7;
const CELL_SIZE = 15;
const CELL_PADDING = CELL_SIZE / 10;

class Sketch extends Component {
  sketch = (p) => {
    this.ctx = p;

    p.setup = () => {
      this.ctx.createCanvas(this.gameAreaWidth, this.gameAreaHeight);
      this.ctx.rect(0, 0, this.gameAreaWidth, this.gameAreaHeight);
      this.ctx.frameRate(FRAME_RATE);
      this.drawGrid();
      this.setupRandomGrid();
    };

    p.draw = () => {
      this.fillCells();
      if (!this.paused) {
        this.nextGeneration();
      }
    };

    p.keyPressed = () => {
      if (this.ctx.keyCode === 32) {
        this.paused = !this.paused;
        if (this.paused) this.ctx.noLoop();
        else this.ctx.loop();
      }
      return false;
    };

    p.mouseDragged = () => {
      if (this.paused) {
        let row = parseInt(this.ctx.mouseY / CELL_SIZE);
        let col = parseInt(this.ctx.mouseX / CELL_SIZE);
        this.makeAlive(row, col);
        this.ctx.redraw();
      }
      return false;
    };

    p.mouseClicked = () => {
      if (this.paused) {
        let row = parseInt(this.ctx.mouseY / CELL_SIZE);
        let col = parseInt(this.ctx.mouseX / CELL_SIZE);
        this.makeAlive(row, col);
        this.ctx.redraw();
      }
      return false;
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.gameAreaRef = React.createRef();

    this.ctx = null;
    this.cells = [[]];
    this.paused = false;
    this.rows = this.cols = 0;
  }

  componentDidMount() {
    const gameAreaNode = this.gameAreaRef.current.getBoundingClientRect();
    this.gameAreaHeight = gameAreaNode.height * GAME_HEIGHT_PER;
    this.gameAreaWidth = gameAreaNode.width * GAME_WIDTH_PER;
    this.rows = parseInt(this.gameAreaHeight / CELL_SIZE) + 1;
    this.cols = parseInt(this.gameAreaWidth / CELL_SIZE) + 1;
    this.p5 = new p5(this.sketch, this.gameAreaRef.current);
  }

  render() {
    return (
      <div id="sketch" ref={this.gameAreaRef}>
        <h2>Sketch</h2>
      </div>
    );
  }

  drawGrid() {
    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.cols; ++j) {
        this.ctx.line(
          j * CELL_SIZE,
          i * CELL_SIZE,
          j * CELL_SIZE,
          (i + 1) * CELL_SIZE
        );
        this.ctx.line(
          j * CELL_SIZE,
          i * CELL_SIZE,
          (j + 1) * CELL_SIZE,
          i * CELL_SIZE
        );
      }
    }
  }

  setupRandomGrid() {
    let [x, y] = [this.rows / 2, this.cols / 2];
    let gilder = [
      [x, y - 1],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ];
    this.cells = [];
    for (let i = 0; i < this.rows + 4; ++i) {
      let row = [];
      for (let j = 0; j < this.cols + 4; ++j) {
        // row.push(_.findIndex(gilder, (c) => c[0] === i && c[1] === j) !== -1);
        row.push(_.random(0, 1) === 1);
      }
      this.cells.push(row);
    }
  }

  fillCells() {
    this.ctx.noStroke();
    for (let i = 2; i < this.rows + 2; ++i) {
      for (let j = 2; j < this.cols + 2; ++j) {
        if (this.cells[i][j]) {
          this.ctx.fill(51);
          this.ctx.rect(
            (j - 2) * CELL_SIZE + CELL_PADDING,
            (i - 2) * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING
          );
          this.ctx.fill("white");
        } else {
          this.ctx.fill("white");
          this.ctx.rect(
            (j - 2) * CELL_SIZE + CELL_PADDING,
            (i - 2) * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING
          );
          this.ctx.fill("white");
        }
      }
    }
    this.ctx.stroke("black");
    this.ctx.fill("white");
  }

  nextGeneration() {
    let newCells = [];
    for (let i = 0; i < this.rows + 4; ++i) {
      let row = [];
      for (let j = 0; j < this.cols + 4; ++j) {
        row.push(this.isAlive(i, j));
      }
      newCells.push(row);
    }
    this.cells = newCells;
  }

  isAlive(row, col) {
    let n = this.countAliveNeighbors(row, col);
    if (this.cells[row][col]) {
      return n > 1 && n < 4;
    } else {
      return n === 3;
    }
  }

  countAliveNeighbors(row, col) {
    let n = 0;
    for (let dx of [-1, 0, 1]) {
      for (let dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;
        let nrow = row + dx;
        let ncol = col + dy;
        if (
          nrow < 0 ||
          ncol < 0 ||
          nrow >= this.rows + 4 ||
          ncol >= this.cols + 4
        )
          continue;
        if (this.cells[nrow][ncol]) n++;
      }
    }
    return n;
  }

  makeAlive(row, col) {
    this.cells[row + 2][col + 2] = true;
  }
}

export default Sketch;
