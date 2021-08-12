const input1 = document.getElementById('input-h1');
const input2 = document.getElementById('input-h2');
const highlightCurrent1 = document.getElementById('h1')
const highlightCurrent2 = document.getElementById('h2')
const btnAI = document.getElementById('btn-AI')
const btnAIHidden = document.getElementById('btn-AI-hidden')
const btnHuman = document.getElementById('btn-HUMAN')
const btnHumanHidden = document.getElementById('btn-HUMAN-hidden')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const divElements = document.querySelectorAll('.box')


// module with playerInformation
const displayController =(()=>{

  const Player = ()=>{
    name = '';
    mark = '';
    return {
      name:name,
      mark:mark
    }
  }

  let ai = Player()
    ai.name = 'Computer'
    ai.mark = 'X'
  
  let human = Player()
    human.name = input1.value
    human.mark = 'O'

  let human2 = Player()
    human2.name = input2.value
    human2.mark = 'X'

  const switchHuman = ()=>{   
      let current = human.mark;
       human.mark = human2.mark;
       human2.mark = current
       return human.mark          
  
  }  

  let currentPlayer = human.mark;


  return{
    ai, human, human2, currentPlayer, switchHuman , Player
  }
})(); 

// module responsible for all things happening on the board
const gameBoard = (()=>{

btnHuman.addEventListener('click', restartHuman)
btnAI.addEventListener('click', restartAI)
btnHumanHidden.addEventListener('click', restartHuman)
btnAIHidden.addEventListener('click', restartAI)
  
let human = displayController.Player()
  human.name = input1.value
  human.mark = 'O'

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

// ** MAIN FUNCTION: resets state, listens to currentHuman
// + and adds the mark on the desirable spot
function restartHuman(){
  winningMessageElement.classList.remove('show')
highlightCurrent1.textContent = 'X: ' + `${input1.value}`
highlightCurrent2.textContent = 'O: ' + `${input2.value}`
  divElements.forEach(box =>{
    box.textContent = ''
  });

  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  gameBoard.board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  divElements.forEach(box =>{
    box.addEventListener('click', renderHuman)
     
});

}


function renderHuman(e){
  displayController.human.name = input1.value
  displayController.human2.name = input2.value
  let i = e.target.dataset.col;
  let j = e.target.dataset.row;
if(e.target.textContent == ''){
    board[i][j] = displayController.switchHuman()
          e.target.textContent = board[i][j]
          if(e.target.textContent == "O"){
            highlightCurrent1.classList.add('highlight')
            highlightCurrent2.classList.remove('highlight')
        }  
        else if(e.target.textContent =="X"){
        highlightCurrent1.classList.remove('highlight')
        
            highlightCurrent2.classList.add('highlight')
        }
  checkWinner()
  let result = checkWinner();
  if (result != null) {
    if (result == 'tie') {
      winningMessageElement.classList.add('show')
      winningMessageTextElement.innerText = `Draw!`;
      divElements.forEach(box=>box.removeEventListener('click',renderHuman))
    } else {
      if(result == 'X'){
        if(input1.value == ''){
          result = 'Player 1'
        }else{

          result = displayController.human.name
        }
      }
      else if(result =='O'){
        if(input2.value == ''){
          result = 'Player 2'
        }else{

          result = displayController.human2.name
        }
      }
      winningMessageElement.classList.add('show')
      winningMessageTextElement.innerText = `${result} wins!`;
      divElements.forEach(box=>box.removeEventListener('click',renderHuman))
    }
  }
}
}
// **MAIN FUNCTION: resets the state, implements minimax and renders the board
// has 3 sub-functions
function restartAI() {
  winningMessageElement.classList.remove('show')
  highlightCurrent1.classList.remove('highlight')
  highlightCurrent2.classList.remove('highlight')
  btnHuman.classList.add('hidden')
  if(input1.value == ''){
    highlightCurrent2.textContent = 'O: ' + `Player`
  }
  else{
    highlightCurrent2.textContent = 'O: ' + `${input1.value}`
  }
  highlightCurrent1.textContent = 'X: ' + `${displayController.ai.name}`

  divElements.forEach(box=>box.removeEventListener('click',renderHuman))
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  gameBoard.board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  
  divElements.forEach(box=>{
    box.textContent = ''
    box.addEventListener('click', renderAI, {once:true})
  })
  bestMove()
}


// rendering the results
function renderAI(e){

  if(displayController.currentPlayer == human.mark){
    let i = e.target.dataset.col;
    let j = e.target.dataset.row;
    if (board[i][j] == '') {
      board[i][j] = human.mark;
      e.target.textContent = human.mark;
      displayController.currentPlayer = displayController.ai.mark;
      bestMove();
      let result = checkWinner();
      if (result != null) {
        if (result == 'tie') {
          winningMessageTextElement.innerText = 'Draw!'
          winningMessageElement.classList.add('show')
          btnHuman.classList.remove('hidden')
          divElements.forEach(box=>box.removeEventListener('click',renderAI,{once:true})) 
        } else {
          if(result == 'X'){
            result = displayController.ai.name
          }
          else if(result == 'O'){
            result = human.name
          }
          btnHuman.classList.remove('hidden')
          winningMessageElement.classList.add('show')
          winningMessageTextElement.innerText = `${result} wins!`;
          divElements.forEach(box=>box.removeEventListener('click',renderAI,)) 
        }
      }

    }
  }
}
  

function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  let x;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == '') {
        board[i][j] = displayController.ai.mark;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  board[move.i][move.j] = displayController.ai.mark;
  // check where on the board to add the ai mark
  if(move.i==0&&move.j==0){
    x=0
  }
  else if (move.i==0&move.j==1){
    x=1
  }
  else if (move.i==0&move.j==2){
    x=2
  }
  else if (move.i==1&move.j==0){
    x=3
  }
  else if (move.i==1&move.j==1){
    x=4
  }
  else if (move.i==1&move.j==2){
    x=5
  }
  else if (move.i==2&move.j==0){
    x=6
  }
  else if (move.i==2&move.j==1){
    x=7
  }
  else if (move.i==2&move.j==2){
    x=8
  }
  divElements[x].textContent = displayController.ai.mark;
  displayController.currentPlayer = human.mark;
}

let scores = {
  X: 10,
  O: -10,
  tie: 0
};

function minimax(board, depth, isMax) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = displayController.ai.mark;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = human.mark;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}


function isEqual(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (isEqual(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }
  // Vertical
  for (let i = 0; i < 3; i++) {
    if (isEqual(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (isEqual(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (isEqual(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openBox = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openBox++;
      }
    }
  }

  if (winner == null && openBox == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

return{
  board, checkWinner
}
})();