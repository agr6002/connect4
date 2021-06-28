var can = document.getElementById("can");
var con = can.getContext("2d");
var isRedsTurn = true;
var emp = "Empty";
var red = "Red";
var black = "Black";
var priorRow;
var priorColumn;
var priorColor;
var board = [
  [emp, emp, emp, emp, emp, emp, emp], 
  [emp, emp, emp, emp, emp, emp, emp], 
  [emp, emp, emp, emp, emp, emp, emp], 
  [emp, emp, emp, emp, emp, emp, emp], 
  [emp, emp, emp, emp, emp, emp, emp], 
  [emp, emp, emp, emp, emp, emp, emp] 
];
var chips = [];
var click = new Audio("click.wav");
var slide = new Audio("slide.mp3");

var bcr; 

can.addEventListener("click", handleClick);
window.onresize = resize;
resize();
requestAnimationFrame(animate);

function animate() {
    con.clearRect(0, 0, bcr.width, bcr.height);

    for (var i = 0; i < chips.length; i++) {
        chips[i].update();
        chips[i].draw();
    }

    con.fillStyle = "yellow";
    con.beginPath();
    con.moveTo(100, 100);
    con.lineTo(800, 100);
    con.lineTo(800, 700);
    con.lineTo(100, 700);
    con.lineTo(100,100);
    for (var y = 0; y < 6; y++ ){
        for (var x = 0; x < 7; x++ ){
            con.moveTo(x * 100 + 150, y * 100 + 150);
            con.arc(x * 100 + 150, y * 100 + 150, 40, 0, 2 * Math.PI, true);
        }
    }
    con.fill();
    requestAnimationFrame(animate);
}
function computerPlay() {
    var row = 7;
    var column;
    while (row === 7){
        column = Math.floor(Math.random() * 7)
        for (row = 0; row < 7; row++){
            if (board[row][column] === emp) break;
        };       
    }
    if (row === 7) return;
    slide.currentTime = 0;
    slide.play();
    board[row][column] = black;
    chips.push(new Chip(column * 100 + 150, 0, 50, isRedsTurn ? "red" : "black", row));
    priorRow = row;
    priorColumn = column;
    priorColor = black;
    setTimeout(function () {
        checkScore();
        isRedsTurn = !isRedsTurn;
    }, 1000); 
}
function handleClick(e) {
    if ( ! isRedsTurn){
        return;   
    }
    var column = Math.floor ((e.clientX - 100) / 100);
    if (column < 0 || column > 6) {
        return;
    }
    var row; 
    for (row = 0; row < 7; row++){
        if (board[row][column] === emp) break;
    };
    if (row === 7) return;
    slide.currentTime = 0;
    slide.play();
    board[row][column] = red;
    chips.push(new Chip(column * 100 + 150, 0, 50, isRedsTurn ? "red" : "black", row));
    isRedsTurn = !isRedsTurn;
    priorRow = row;
    priorColumn = column;
    priorColor = red;
    setTimeout(function() {
        checkScore();
        computerPlay();
    }, 1000);
}
function checkScore(){
    if (
        checkColumn() ||
        checkRow() 
        //more checks
    ){
        alert(priorColor + " wins!");
    }

}
function checkRow () {
    return (
        checkRowLeft() + checkRowRight() > 2 
    );
}
function checkRowLeft(){
    var count = 0;
    var pos = priorColumn;
    while (pos > -1 && board[priorRow][priorColumn - count - 1] === priorColor) {
        count++;
    }
    return count; 
}
function checkRowRight(){
    var count = 0;
    var pos = priorColumn;
    while (pos < 7 && board[priorRow][priorColumn + count + 1] === priorColor) {
        count++;
    }
    return count; 
}
function checkColumn() {
    if(priorRow < 3){
        return false;
    }
    return (
        (board [priorRow - 1][priorColumn]=== priorColor) &&
        (board [priorRow - 2][priorColumn]=== priorColor) &&
        (board [priorRow - 3][priorColumn]=== priorColor)
        );

}
function resize() {
    bcr = document.body.getBoundingClientRect();
    can.width = bcr.width;
    can.height = bcr.height;
}

class Chip {
    constructor(posx, posy, rad, color, row) {
        this.posX = posx;
        this.posY = posy;
        this.velX = 0;
        this.velY = 10;
        this.rad = rad;
        this.row = row; 
        this.color = color;
        this.isFirstSlide = true;
    }
    draw () {
        con.beginPath();
        con.fillStyle = this.color; 
        con.arc(this.posX, this.posY, this.rad, 0, 2 * Math.PI );
        con.fill();
    }
    update(){
        this.posX += this.velX;
        this.posY += this.velY;
        if (this.posY > 650 - 100 * this.row){
            if (this.isFirstSlide){
                this.isFirstSlide = false;
                click.currentTime = 0;
                click.play();
            }
            this.posY = 650 - 100 * this.row;
        }
    }
} 