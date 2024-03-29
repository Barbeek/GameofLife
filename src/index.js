import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { ButtonToolbar } from 'react-bootstrap';

class Box extends React.Component {
    selectBox = () => {
        this.props.selectBox(this.props.rows, this.props.cols);
    }
    render () {
        return (
            <div
                className={this.props.boxClass}
                id={this.props.boxId}
                onClick={this.selectBox}
            />
        )
    }
}
class Grid extends React.Component {
    render () {
        const width = this.props.cols * 14;
        var rowsArr = [];
        var boxClass = "";

        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.rows; j++) {
                let boxId = i + "_" + j;
                boxClass = this.props.gridFull[i][j] ? "box on" : "box false";
                rowsArr.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        boxId={boxId}
                        rows={i}
                        cols={j}
                        selectBox={this.props.selectBox}
                    />
                )
            }
        }

        return (
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        )
    }
}

class Buttons extends React.Component {
    handleSelect = (evt) => {
        this.props.gridSize(evt); 
    }

    render() {
        return (
            <div className="center">
                <ButtonToolbar>
                    <button className="btn btn-default" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className="btn btn-default" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className="btn btn-default" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className="btn btn-default" onClick={this.props.slow}>
                        Slow
                    </button>
                    <button className="btn btn-default" onClick={this.props.fast}>
                        Fast
                    </button>
                    <button className="btn btn-default" onClick={this.props.seed}>
                        Seed
                    </button>
                </ButtonToolbar>
            </div>
        )
    }
}

class Main extends React.Component {
    constructor () {
        super();
        this.speed = 80;
        this.rows = 40;
        this.cols = 40;
        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
        }
    }

    selectBox = (row, col) => {
        let gridCopy =  arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        })
    }

    seed = () => {
        let gridCopy =  arrayClone(this.state.gridFull);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }

            }
        }
        this.setState({
            gridFull: gridCopy
        })
    }

    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed);
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
    }

    slow = () => {
        this.speed = 1000;
        this.playButton();
    }

    fast = () => {
        this.speed = 80;
        this.playButton();
    }

    clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.setState({
            gridFull: grid,
            generation: 0 
        }); 
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

        for (let y = 0; y < this.rows; y++) {  
            for (let x = 0; x < this.cols; x++) {    
                let neighbors = this.calculateNeighbors(g, x, y);    
                if (g[y][x]) {      
                    if (neighbors === 2 || neighbors === 3) {        
                        g2[y][x] = true;     
                    } else {        
                        g2[y][x] = false;
                    }    
                } else {      
                    if (!g[y][x] && neighbors === 3) {        
                        g2[y][x] = true;      
                    }    
                }  
            }
        }

		// for (let i = 0; i < this.rows; i++) {
		//   for (let j = 0; j < this.cols; j++) {
		//     let count = 0;
		//     if (i > 0) if (g[i - 1][j]) count++;
		//     if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		//     if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		//     if (j < this.cols - 1) if (g[i][j + 1]) count++;
		//     if (j > 0) if (g[i][j - 1]) count++;
		//     if (i < this.rows - 1) if (g[i + 1][j]) count++;
		//     if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		//     if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		//     if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		//     if (!g[i][j] && count === 3) g2[i][j] = true;
		//   }
		// }
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}

    componentDidMount() {
        this.seed();
        this.playButton();
    }

    render () {
        return (
            <div>
                <h1>The Game of Life</h1>
                <Buttons
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}
                    gridSize={this.gridSize}
                />
                <Grid 
                    gridFull={this.state.gridFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />
                <h2>Generations : {this.state.generation}</h2>
            </div>
        )
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));
  