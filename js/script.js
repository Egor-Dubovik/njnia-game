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
	let gameOver = false;

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
				}
			})

			// контроль игрока
			if (this.frameX > this.maxFrame) this.frameX = 0;
			else this.frameX++;

			if (input.keys.indexOf('ArrowRight') > -1) {
				this.speed = 20;
			} else if (input.keys.indexOf('ArrowLeft') > -1) {
				this.speed = -20;
			} else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
				this.jumpH -= 30;
			} else {
				this.speed = 0;
			}

			//горизонтальное движение
			this.x += this.speed;
			if (this.x < 0) {
				this.x = 0;
			} else if (this.x > this.gameWidth - this.width) {
				this.x = this.gameWidth - this.width;
			}

			//вертикальное движение
			this.y += this.jumpH;
			if (!this.onGround()) {
				this.jumpH += this.weight;
				this.frameY = 3;
			} else {
				this.y = this.gameHeight - this.height - 80;
				this.frameY = 0;
			}

		}
		onGround() {
			return this.y >= this.gameHeight - this.height - 80;
		}
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
			context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
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
				scoreObstacles++;
			}
			this.x -= this.speed;
			// console.log(this.x);
		}
	}

	function handleObstacles() {
		allObstacles.forEach(obstacle => {
			obstacle.draw(ctx);
			obstacle.update();

		});

		allObstacles = allObstacles.filter(obstacle => !obstacle.markedForDel)
	}

	let scoreObstacles = 0;
	setInterval(() => {
		allObstacles.push(new Obstacles(canvas.width, canvas.height));
	}, Math.random() * 10000);


	function handleEnemies() {

	}

	function displayScore(context) {
		context.filllStyle = 'white';
		context.font = ' 600 40px Helvetica';
		context.fillText(`Score: ${scoreObstacles}`, 20, 50);
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


	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		background.draw(ctx);
		// background.update();
		player.draw(ctx);
		player.update(input, allObstacles);
		displayScore(ctx);
		handleObstacles();
		if (!gameOver) requestAnimationFrame(animate);
	}

	// запуск игры 
	btnPlay.addEventListener('click', launchGame);
	function launchGame() {
		gameMenu.classList.add('hidden');
		inputMaps.forEach(map => {
			if (map.checked) {
				background.image.src = `./assets/img/background/${map.id}.jpg`
				// game.style.background = `url("../assets/img/background/${map.id}.jpg") 0 0 / 100% 100% no-repeat`;
			}
		})
		canvas.classList.add('active');
		btnCloseGame.classList.add('active');
		gameOver = false;
		animate();
	}
	btnCloseGame.addEventListener('click', closeGame);
	function closeGame() {
		gameOver = true;
		gameMenu.classList.remove('hidden');
		canvas.classList.remove('active');
		btnCloseGame.classList.remove('active');
	}

})



