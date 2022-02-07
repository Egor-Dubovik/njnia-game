const selectHeader = document.querySelector('.select__header');
const selectBody = document.querySelector('.select__body');
const selectCurrent = document.querySelector('.select__current');
const selectIcon = document.querySelector('.select__icon');
const btnPlay = document.querySelector('.menu__btn-play');
const gameMenu = document.querySelector('.game__menu');
const inputMaps = document.querySelectorAll('.options__input');
const game = document.querySelector('.game');
const mapsPreview = document.querySelector('.maps__preview img');
const mapsOptions = document.querySelector('.maps__options');
const btnCloseGame = document.querySelector('.game__btn-close');
const btnRestGame = document.querySelector('.game__btn-restart');
const gameRock = document.querySelector('.game__rock');


selectHeader.addEventListener('click', showSelectBody);
selectBody.addEventListener('click', showSelectBody);
mapsOptions.addEventListener('click', choseMap);



// выпадающий список 
function showSelectBody(e) {
	selectBody.classList.toggle('active');
	selectHeader.classList.toggle('active');
	selectIcon.classList.toggle('active');

	if (e.target.classList.contains('select__item')) {
		selectCurrent.textContent = e.target.textContent;
	}
}

// выбор и отображение карты 
function choseMap(e) {
	if (e.target.checked) {
		mapsPreview.src = `./assets/img/background/${e.target.id}.jpg`;
		gameRock.src = `./assets/img/rocks/${e.target.id}.png`
	}
}



//!--------------------

window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas');;
	const ctx = canvas.getContext("2d");;

	const canvasWidth = canvas.width = 2000;
	const canvasHight = canvas.height = 1000;
	let allEnemies = [];
	let allObstacles = [];
	let shotArr = [];
	let gameOver = false;
	let shot = false;

	class InputHandler {
		constructor() {
			this.keys = [];

			window.addEventListener('keydown', e => {
				if ((e.key === 'ArrowRight' ||
					e.key === 'ArrowDown' ||
					e.key === 'ArrowLeft' ||
					e.key === 'ArrowUp' ||
					e.key === ' ')
					&& this.keys.indexOf(e.key) === -1) {
					this.keys.push(e.key)
					console.log(this.keys)
				}
			});

			window.addEventListener('keyup', e => {
				if (e.key === 'ArrowRight' ||
					e.key === 'ArrowDown' ||
					e.key === 'ArrowLeft' ||
					e.key === 'ArrowUp' ||
					e.key === ' ') {
					this.keys.splice(this.keys.indexOf(e.key), 1);
				}
			});
		}
	}

	class Player {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 196;
			this.height = 342;
			this.x = 0;
			this.y = this.gameHeight - this.height - 80;
			this.image = document.querySelector('.game__plaer');
			this.frameX = 0;
			this.frameY = 0;
			this.maxFrame = 7;
			this.speed = 0;
			this.jumpH = 0;
			this.weight = 2;
			this.shot = false;
		}
		draw(context) {
			context.strokeStyle = "blue";
			context.strokeRect(this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
				this.width, this.height, this.x, this.y, this.width, this.height);
		}
		update(input, allObstacles) {
			// определяем столкновение 
			// distance(гипотенуза прям-го треугольника)
			allObstacles.forEach(obstacle => {
				const dx = (obstacle.x + obstacle.width / 2) - (this.x + this.width / 2);
				const dy = (obstacle.y + obstacle.height / 2) - (this.y + this.height / 2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < obstacle.width / 2 + this.width / 2) {
					gameOver = true;
					btnRestGame.classList.add('active');
				}
			})

			// контроль игрока
			if (this.frameY === 3) {
				if (this.frameX > this.maxFrame) this.frameX = 7;
				else this.frameX++;
			} else {
				if (this.frameX > this.maxFrame) this.frameX = 0;
				else this.frameX++;
			}

			if (input.keys.indexOf('ArrowRight') > -1) {
				this.speed = 20;
			} else if (input.keys.indexOf('ArrowLeft') > -1) {
				this.speed = -20;
			} else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
				this.jumpH -= 30;
			} else if (input.keys.indexOf('ArrowDown') > -1 && !this.onGround()) {
				this.jumpH += 30;
			} else if (this.onGround()) {
				this.jumpH = 0;
				this.speed = 0;
			}

			//вертикальное движение
			this.y += this.jumpH;
			if (!this.onGround()) {
				this.jumpH += this.weight;
				this.frameY = 3;
			} else if (this.onGround()) {
				this.y = this.gameHeight - this.height - 80;
				this.frameY = 0;
			}

			//горизонтальное движение
			this.x += this.speed;
			if (this.x < 0) {
				this.x = 0;
			} else if (this.x > this.gameWidth - this.width) {
				this.x = this.gameWidth - this.width;
			}

			if (this.speed !== 0 && this.onGround()) {
				this.frameY = 4;
			}


		}
		onGround() {
			return this.y >= this.gameHeight - this.height - 80;
		}
	}
	class Weapon {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.querySelector('.game__weapon');
			this.x = player.x + 200;
			this.y = player.y + 170;
			this.width = 100;
			this.height = 20;
			this.speed = 30;
			this.markedForDel = false;
		}
		draw(context) {
			context.strokeStyle = "blue";
			context.strokeRect(this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
		update() {
			if (shot) {
				this.x += this.speed;
				console.log(this.x, this.gameWidth - this.width)
			}
			if (this.x > this.gameWidth - this.width) {
				this.markedForDel = true;
				console.log(this.markedForDel)
			}
		}

	}


	function createShot(input) {
		if (input.keys.indexOf(' ') > -1) {
			shotArr.push(new Weapon(canvas.width, canvas.height));
			shot = true;
		}

		shotArr.forEach(shot => {
			shot.draw(ctx);
			shot.update();
		});
		shotArr = shotArr.filter(shot => !shot.markedForDel)
	}

	class Background {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.querySelector('.game__map');
			this.x = 0;
			this.y = 0;
			this.width = 2000;
			this.height = 1000;
			this.speed = 10;
		}

		draw(context) {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) this.x = 0;
		}
	}

	class Enemy {

	}

	class Obstacles {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.querySelector('.game__rock');
			this.width = 200;
			this.height = 150;
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height - 50;
			this.speed = 30;
			this.markedForDel = false;
		}
		draw(context) {
			context.strokeStyle = "red";
			context.strokeRect(this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
		}

		update() {
			if (this.x < 0 - this.width) {
				this.markedForDel = true;
				score++;
			}
			this.x -= this.speed;
		}
	}

	function handleObstacles(deltaTime) {
		if (obstacleTimer > obstacleInterval + randObstInterval) {
			allObstacles.push(new Obstacles(canvas.width, canvas.height));
			randObstInterval = Math.random() * 1000 + 600
			obstacleTimer = 0;
		} else {
			obstacleTimer += deltaTime;
		}
		allObstacles.forEach(obstacle => {
			obstacle.draw(ctx);
			obstacle.update();

		});

		allObstacles = allObstacles.filter(obstacle => !obstacle.markedForDel)
	}


	function handleEnemies() {

	}

	let score = 0;
	function displayScore(context) {
		context.filllStyle = 'white';
		context.font = ' 600 40px Helvetica';
		context.fillText(`Score: ${score}`, 100, 50);
		if (gameOver) {
			context.textAlign = 'center';
			context.fillStyle = 'black';
			context.font = '600 72px Helvetica';
			context.fillText('GAME OVER, try again!', canvas.width / 2, 200);
		}
	}

	const input = new InputHandler();
	const player = new Player(canvas.width, canvas.height);
	const background = new Background(canvas.width, canvas.height);
	const obstacles = new Obstacles(canvas.width, canvas.height);
	// const weapon = new Weapon(canvas.width, canvas.height);

	let lastTime = 0;
	let obstacleTimer = 0;
	let obstacleInterval = 3000;
	let randObstInterval = Math.random() * 1000 + 600;


	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		background.draw(ctx);
		player.draw(ctx);
		player.update(input, allObstacles);
		createShot(input)
		displayScore(ctx);
		handleObstacles(deltaTime);

		if (!gameOver) requestAnimationFrame(animate);

	}


	// запуск игры 
	btnPlay.addEventListener('click', launchGame);
	function launchGame() {
		gameMenu.classList.add('hidden');
		inputMaps.forEach(map => {
			if (map.checked) {
				background.image.src = `./assets/img/background/${map.id}.jpg`
			}
		})
		canvas.classList.add('active');
		btnCloseGame.classList.add('active');
		gameOver = false;
		animate(0);
	}

	//закрыть игру
	btnCloseGame.addEventListener('click', closeGame);
	function closeGame() {
		gameOver = true;
		gameMenu.classList.remove('hidden');
		canvas.classList.remove('active');
		btnCloseGame.classList.remove('active');
		btnRestGame.classList.remove('active');
		player.x = 0;
		score = 0;
		allObstacles = [];
		obstacles.markedForDel = true;
		gameOver = true;
	}
	btnRestGame.addEventListener('click', gameRestart);
	// перезапуск игры 
	function gameRestart() {
		player.x = 0;
		score = 0;
		allObstacles = [];
		obstacles.markedForDel = true;
		gameOver = false;
		animate(0);
		btnRestGame.classList.remove('active');
	}
})



