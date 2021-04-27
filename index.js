const gameBoard = document.querySelector('.gameBoard')
const scoreDisplay = document.querySelector('.gameBoard__score')
const btnStart = document.querySelector('.startGame')

// color buttons
const green = document.querySelector('.button__green')
const red = document.querySelector('.button__red')
const yellow = document.querySelector('.button__yellow')
const blue = document.querySelector('.button__blue')

class Game {
  constructor() {
    this.initialization()
    this.generateSequence()
    setTimeout(this.nextLevel, 1000)
  }

  initialization() {
    this.MAX_SCORE = 10
    this.nextLevel = this.nextLevel.bind(this)
    this.illuminateSequence = this.illuminateSequence.bind(this)
    this.selectColor = this.selectColor.bind(this)
    this.setGameScore(0)
    this.winGame = this.winGame.bind(this)
    this.sequenceIndex = 0
    this.colors = {
      green,
      red,
      yellow,
      blue
    }

    btnStart.classList.toggle('startGame--active')
    gameBoard.classList.toggle('gameBoard--playing')
  }

  setGameScore(score) {
    this.gameScore = score
    scoreDisplay.innerHTML = score
  }

  generateSequence() {
    this.sequence = new Array(this.MAX_SCORE).fill(0).map(() => Math.floor(Math.random() * Object.keys(this.colors).length))
  }

  async nextLevel() {
    this.sequenceIndex = 0
    await this.illuminateSequence()
    this.addClickListenersToButtons()
  }

  winGame() {
    this.endGame()
    swal("You win!", "Congratulations! You did everything Simon said.", "success");
  }

  endGame() {
    this.removeClickListenersToButtons()
    btnStart.classList.toggle('startGame--active')
    gameBoard.classList.toggle('gameBoard--playing')
  }

  async illuminateSequence() {
    for(let i = 0; i <= this.gameScore; i++) {
      await this.illuminateColor(this.sequence[i])
    }
  }

  async illuminateColor(colorId) {
    const color = Object.values(this.colors)[colorId]
    const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms)) // hack for async loop

    color.classList.toggle('button--active')
    await waitFor(280)
    color.classList.toggle('button--active')
    await waitFor(280)
  }

  addClickListenersToButtons() {
    this.colors.green.addEventListener('click', this.selectColor)
    this.colors.red.addEventListener('click', this.selectColor)
    this.colors.blue.addEventListener('click', this.selectColor)
    this.colors.yellow.addEventListener('click', this.selectColor)
  }

  removeClickListenersToButtons() {
    this.colors.green.removeEventListener('click', this.selectColor)
    this.colors.red.removeEventListener('click', this.selectColor)
    this.colors.blue.removeEventListener('click', this.selectColor)
    this.colors.yellow.removeEventListener('click', this.selectColor)
  }

  datasetColorToId (dataset) {
    switch(dataset) {
      case 'green':
        return 0;

      case 'red':
        return 1;

      case 'blue':
        return 2;

      case 'yellow':
        return 3;
    }
  }

  selectColor(e) {
    console.log(e)
    const dataColor = e.target.dataset.color
    const colorId = this.datasetColorToId(dataColor)

    this.illuminateColor(colorId)

    if(colorId === this.sequence[this.sequenceIndex]) {
      if(this.sequenceIndex === this.gameScore) {
        if((this.gameScore + 1) === this.MAX_SCORE) {
          this.setGameScore(this.gameScore += 1)
          setTimeout(this.winGame, 500)
        } else {
          this.removeClickListenersToButtons()
          this.setGameScore(this.gameScore += 1)
          setTimeout(this.nextLevel, 1000)
        }
      } else {
        this.sequenceIndex += 1
      }
    } else {
      this.endGame()
    }
  }
}

btnStart.addEventListener('click', () => new Game())