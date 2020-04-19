import React, { Component } from "react";
import p5 from "p5";
import _ from "lodash";
import "./Sketch.css";

const FRAME_RATE = 7;
const CELL_SIZE = 15;
const ROWS = 40;
const COLS = 40;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CELL_PADDING = CELL_SIZE / 10;

class Sketch extends Component {
  sketch = (p) => {
    this.ctx = p;

    p.setup = () => {
      this.ctx.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      this.ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
        let row = parseInt(this.ctx.mouseX / CELL_SIZE);
        let col = parseInt(this.ctx.mouseY / CELL_SIZE);
        this.makeAlive(row, col);
        this.ctx.redraw();
      }
      return false;
    };

    p.mouseClicked = () => {
      if (this.paused) {
        let row = parseInt(this.ctx.mouseX / CELL_SIZE);
        let col = parseInt(this.ctx.mouseY / CELL_SIZE);
        this.makeAlive(row, col);
        this.ctx.redraw();
      }
      return false;
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.myRef = React.createRef();

    this.ctx = null;
    this.cells = [[]];
    this.paused = false;
  }

  componentDidMount() {
    this.p5 = new p5(this.sketch, this.myRef.current);
  }

  render() {
    return (
      <div id="sketch" ref={this.myRef}>
        <h2>Sketch</h2>
      </div>
    );
  }

  drawGrid() {
    for (let i = 0; i < ROWS; ++i) {
      for (let j = 0; j < COLS; ++j) {
        this.ctx.line(
          i * CELL_SIZE,
          j * CELL_SIZE,
          i * CELL_SIZE,
          (j + 1) * CELL_SIZE
        );
        this.ctx.line(
          i * CELL_SIZE,
          j * CELL_SIZE,
          (i + 1) * CELL_SIZE,
          j * CELL_SIZE
        );
      }
    }
  }

  setupRandomGrid() {
    let [x, y] = [ROWS / 2, COLS / 4];
    let gilder = [
      [x, y - 1],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ];
    this.cells = [];
    for (let i = 0; i < ROWS + 4; ++i) {
      let row = [];
      for (let j = 0; j < COLS + 4; ++j) {
        row.push(_.findIndex(gilder, (c) => c[0] === i && c[1] === j) !== -1);
      }
      this.cells.push(row);
    }
  }

  fillCells() {
    this.ctx.noStroke();
    for (let i = 2; i < ROWS + 2; ++i) {
      for (let j = 2; j < COLS + 2; ++j) {
        if (this.cells[i][j]) {
          this.ctx.fill(51);
          this.ctx.rect(
            i * CELL_SIZE + CELL_PADDING,
            j * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING
          );
          this.ctx.fill("white");
        } else {
          this.ctx.fill("white");
          this.ctx.rect(
            i * CELL_SIZE + CELL_PADDING,
            j * CELL_SIZE + CELL_PADDING,
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
    for (let i = 0; i < ROWS + 4; ++i) {
      let row = [];
      for (let j = 0; j < COLS + 4; ++j) {
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
        if (nrow < 0 || ncol < 0 || nrow >= ROWS + 4 || ncol >= COLS + 4)
          continue;
        if (this.cells[nrow][ncol]) n++;
      }
    }
    return n;
  }

  makeAlive(row, col) {
    console.log("makeAlive", row, col);
    this.cells[row][col] = true;
  }
}

export default Sketch;
