import {Universe} from "../pkg/hello_wasm";
import {memory} from "../pkg/hello_wasm_bg";

const CELL_SIZE = 5;
const GRID_COLOR = "#CCC";
const ALIVE_COLOR = "#FFF";
const DEAD_COLOR = "#000"

const universe = Universe.new(0.343);
const width = universe.get_width();
const height = universe.get_height();

console.log(universe.get_rate());

// const pre = document.getElementById("game-of-life-canvas");
let canvas = document.getElementById('canvas');
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;
let ctx = canvas.getContext('2d');

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, col) => {
    return row * width + col;
};

const bitIsSet = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << (n % 8);
    return (arr[byte] & mask) === mask;
};

const drawCells = () => {
    const cellsPtr = universe.get_cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col)

            ctx.fillStyle = bitIsSet(idx, cells)
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            )
        }
    }

    ctx.stroke();
};

const renderLoop = () => {

    drawGrid();
    drawCells();

    universe.tick();
    requestAnimationFrame(renderLoop);
};

window.renderLoop = renderLoop;

requestAnimationFrame(renderLoop);
