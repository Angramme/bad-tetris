let canvas, ctx, player, loop;
let score = 0;

let colors = [
	"#000",
	"#445522",
	"purple",
	"orange",
	"yellow",
	"green",
	"blue",
	"red",
	"pink",
	"#a1f442",
	"#aa66ff",
	"#66aaff",
	"#ffaa66",
	"#558800",
	"#0e3660",
	"#593209",
	"#9e1450"
];

let grid = createMatrix(20,12);

class PLAYER{
	constructor(){ this.reset(); }
	reset(){
		this.matrix = getRandomShape();
		this.pos = {x: ( grid[0].length*0.5|0 )-( this.matrix[0].length*0.5|0 ), y:0};

		this.timeStep = 0;
		this.fallInterval = 1000; //1 second

		if( colideMatrix( this.matrix, grid, this.pos ) ) lose();
	}
	draw(){
		drawMatrix(this.matrix, this.pos);
	}
	update(tOffset){
		this.timeStep += tOffset || 0;
		if(this.timeStep > this.fallInterval){
			this.drop();
		}
	}
	drop(){
		this.timeStep = 0;
		this.pos.y ++;

		if( colideMatrix( this.matrix, grid, this.pos ) ){
			this.pos.y --;
			
			for(let j=0; j<this.matrix.length; j++){
				for(let i=0; i<this.matrix[j].length; i++){
					let val = this.matrix[j][i];
					if(val !== 0){
						try{ grid[j+this.pos.y][i+this.pos.x] = val; }
						catch(err){}
					}
				}
			}

			popRows();

			this.reset();
			return(true);
		}
	}
	fallDown(){
		while( !this.drop() );
	}
	move(dir){
		this.pos.x += dir;

		if( colideMatrix( this.matrix, grid, this.pos ) ) this.pos.x -= dir;
	}
	rotate(dir){
		rotateMatrix(this.matrix, dir);
		let offset = 1;
		let oPos = this.pos;
		while( colideMatrix( this.matrix, grid, this.pos ) ){
			this.pos.x += offset;
			offset = -offset + (offset<0?1:-1);

			if(offset>this.matrix[0].length){
				this.pos = oPos;
				break;
			}
		}
	}
}
player = new PLAYER();

window.onload = () => {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.scale(30,30);

	draw();
}

window.onkeydown = e => {
	switch(e.keyCode){
		case 37:
			player.move(-1);
			break;
		case 39:
			player.move(1);
			break;
		case 40:
			player.drop();
			break;
		case 81:
			player.rotate(-1);
			break;
		case 65:
			player.rotate(-1);
			break;
		case 69:
			player.rotate(1);
			break;
		case 68:
			player.rotate(1);
			break;
		case 32:
			player.fallDown();
			break;
		default:
			console.log("pressed key of index:", e.keyCode);
	}
}

let [prevTime, timeOffset] = [0,0];

function draw(timeStamp){
	let timeOffset = timeStamp - prevTime;
	prevTime = timeStamp;

	ctx.fillStyle = "#111";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	player.draw();
	player.update(timeOffset);

	drawMatrix(grid, {x:0,y:0});

	requestAnimationFrame(draw);
}

function lose(){
	//setCookie("highscore",String(score),30);
	alert("You Lose! Your final score was: " + String(score) );
	score = 0;
	document.getElementById("score").innerText = "0";

	grid = createMatrix(20,12);
}

function popRows(){
	let point = 1;
	for(let j=grid.length-1; j>0; j--){
		let full = true;
		for(let i=0; i<grid[j].length; i++){
			full = !grid[j][i]?false:full;
		}

		if(full){
			let empty = grid.splice(j, 1)[0].fill(0);
			grid.unshift( empty );
			score += point*10;
			point++;
			document.getElementById("score").innerText = String(score);
			j++; //just to check this row the second time
		}
	}
}

function createMatrix(wid, hei){
	let out = [];
	for(let i=0; i<wid; i++){
		let column = [];
		for(let j=0; j<hei; j++){
			column.push(0);
		}
		out.push(column);
	}
	return(out);
}

function drawMatrix(mat, pos){
	mat.forEach((row, j) => {
		row.forEach((value, i) => {
			if( value ){
				ctx.fillStyle = colors[value];
				ctx.fillRect(i+pos.x,j+pos.y,1,1);
			}
		});
	});
}

function colideMatrix(mat1, mat2, offset){
	for(let j=0; j < mat1.length; j++){
		let row = mat1[j];
		for(let i=0; i < row.length; i++){
			let val = row[i];
			if(val !== 0){
				let tile;
				try{ tile = mat2[j+offset.y][i+offset.x]; }
				catch(err){ tile = undefined; }
				if(tile !== 0){ return( true ); }
			}
		}
	}

	return( false );
}

function rotateMatrix(mat, dir){
	for(let j=0; j<mat.length; j++){
		for(let i=0; i<j; i++){
			[ mat[i][j], mat[j][i] ] = [ mat[j][i], mat[i][j] ];
		}
	}

	if(dir>0){
		mat.forEach(row => row.reverse() );
	}else{
		mat.reverse();
	}

	return(mat);
}

function getRandomShape(){
	return getShape( Math.round( Math.random() * 15 ) );
}

function getShape(i){
	if((i|0) != i) throw new Error("getShape: passed float instead of int");
	switch(i){
		case 1:
			return(
			[[1,1],
			 [1,1]]
			)
			break;
		case 2:
			return(
			[[0,2,0,0],
			 [0,2,0,0],
			 [0,2,0,0],
			 [0,2,0,0]]
			)
			break;
		case 3:
			return(
			[[0,3,3],
			 [3,3,0],
			 [0,0,0]]
			)
			break;
		case 4:
			return(
			[[4,4,0],
			 [0,4,4],
			 [0,0,0]]
			)
			break;
		case 5:
			return(
			[[0,5,0],
			 [0,5,0],
			 [0,5,5]]
			)
			break;
		case 6:
			return(
			[[0,6,0],
			 [0,6,0],
			 [6,6,0]]
			)
			break;
		case 7:
			return(
			[[0,0,0],
			 [7,7,7],
			 [0,7,0]]
			)
			break;
		case 8:
			return(
			[[0,0,0],
			 [9,9,9],
			 [0,9,0]]
			)
			break;
		case 9:
			return(
			[[10,10,10],
			 [10,10,10],
			 [00,00,00]]
			)
			break;
		case 10:
			return(
			[[00,00,00],
			 [11,11,11],
			 [00,00,00]]
			)
			break;
		case 11:
			return(
			[[12,12,12],
			 [0,0,12],
			 [0,0,12]]
			)
			break;
		case 12:
			return(
			[[13,13,13],
			 [13,0,13],
			 [0,0,0]]
			)
		case 13:
			return(
			[[14,0],
			 [14,0]]
			)
			break;
		case 14:
			return(
			[[15]]
			)
			break;
		default:
			return(
			[[8,8,8],
			 [8,8,8],
			 [8,8,8]]
			)
			break;
	}
}



