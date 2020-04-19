import React, { Component } from "react";
import p5 from "p5";
import _ from "lodash";
import { getGosperGlider } from "./scripts/GosperGlider";
import "./Sketch.css";

const GAME_HEIGHT_PER = 1;
const GAME_WIDTH_PER = 1;
const FRAME_RATE = 10;
const CELL_SIZE = 15;
const CELL_PADDING = CELL_SIZE / 10;

const ALIVE_COLOR = "#ffff99";
const CANVAS_BG = "#808080";
const GRID_LINE_COLOR = "#d9d9d9";

let maybeMobileSite = false;

class Sketch extends Component {
  sketch = (p) => {
    this.ctx = p;

    p.setup = () => {
      this.ctx.createCanvas(this.gameAreaWidth, this.gameAreaHeight);
      this.ctx.frameRate(FRAME_RATE);
      this.ctx.background(CANVAS_BG);
      this.drawGrid();
      this.setupRandomGrid();
    };

    p.draw = () => {
      this.fillCells();
      if (!this.paused) {
        this.nextGeneration();
      }
    };

    // Mobile site events

    if (maybeMobileSite) {
      p.touchStarted = () => {
        this.paused = !this.paused;
        if (this.paused) this.ctx.noLoop();
        else this.ctx.loop();
        return false;
      };
    }

    // Desktop events

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
    this.activeCells = new Set();
    this.paused = false;
    this.rows = this.cols = 0;
  }

  componentDidMount() {
    const gameAreaNode = this.gameAreaRef.current.getBoundingClientRect();
    this.gameAreaHeight = gameAreaNode.height * GAME_HEIGHT_PER;
    this.gameAreaWidth = gameAreaNode.width * GAME_WIDTH_PER;
    if (this.gameAreaWidth < 500) {
      maybeMobileSite = true;
    }
    this.rows = parseInt(this.gameAreaHeight / CELL_SIZE) + 1;
    this.cols = parseInt(this.gameAreaWidth / CELL_SIZE) + 1;
    this.p5 = new p5(this.sketch, this.gameAreaRef.current);
  }

  render() {
    return <div id="sketch" ref={this.gameAreaRef}></div>;
  }

  drawGrid() {
    this.ctx.stroke(GRID_LINE_COLOR);
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
    this.ctx.stroke("black");
  }

  setupRandomGrid() {
    let gg = getGosperGlider();
    if (maybeMobileSite) {
      gg = _.zip(...gg);
    }
    for (let i = 0; i < gg.length; ++i) {
      for (let j = 0; j < gg[i].length; ++j) {
        if (gg[i][j]) {
          this.activeCells.add(this.toHash(i + 4, j + 4));
        }
      }
    }
  }

  toHash(row, col) {
    return row * this.cols + col;
  }

  fromHash(h) {
    return [parseInt(h / this.cols), h % this.cols];
  }

  fillCells() {
    this.ctx.noStroke();
    for (let i = 2; i < this.rows + 2; ++i) {
      for (let j = 2; j < this.cols + 2; ++j) {
        if (this.activeCells.has(this.toHash(i, j))) {
          this.ctx.fill(ALIVE_COLOR);
          this.ctx.rect(
            (j - 2) * CELL_SIZE + CELL_PADDING,
            (i - 2) * CELL_SIZE + CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING,
            CELL_SIZE - 2 * CELL_PADDING
          );
          this.ctx.fill("white");
        } else {
          this.ctx.fill(CANVAS_BG);
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
    let newAlive = new Set();
    for (let i = 0; i < this.rows + 4; ++i) {
      for (let j = 0; j < this.cols + 4; ++j) {
        if (this.isAlive(i, j)) {
          newAlive.add(this.toHash(i, j));
        }
      }
    }
    this.activeCells = newAlive;
  }

  isAlive(row, col) {
    let n = this.countAliveNeighbors(row, col);
    if (this.activeCells.has(this.toHash(row, col))) {
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
        if (this.activeCells.has(this.toHash(nrow, ncol))) n++;
      }
    }
    return n;
  }

  makeAlive(row, col) {
    let h = this.toHash(row + 2, col + 2);
    this.activeCells.add(h);
  }
}

export default Sketch;
