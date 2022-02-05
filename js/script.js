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



selectHeader.addEventListener('click', showSelectBody);
selectBody.addEventListener('click', showSelectBody);
btnPlay.addEventListener('click', launchGame);
mapsOptions.addEventListener('click', choseMap);


function showSelectBody(e) {
	selectBody.classList.toggle('active');
	selectHeader.classList.toggle('active');
	selectIcon.classList.toggle('active');

	if (e.target.classList.contains('select__item')) {
		console.log(e.target.textContent)
		selectCurrent.textContent = e.target.textContent;
	}
}



const canvas = document.getElementById('player');;
const ctx = canvas.getContext("2d");;
const canvasWidth = canvas.width = 110;
const canvasHight = canvas.height = 200;



const playerImage = new Image();
playerImage.src = '../assets/img/ninjaadventurenew/animate.png';
const plaerWidth = 196;
const plaerHieght = 342;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggeFrames = 8;

function animate() {
	ctx.clearRect(0, 0, canvasWidth, canvasHight);
	// ctx.fillRect(50, 50, 100, 100);
	ctx.drawImage(playerImage, frameX * plaerWidth, frameY * plaerHieght, plaerWidth, plaerHieght, 0, 0, canvasWidth, canvasHight)

	if (gameFrame % staggeFrames == 0) {
		if (frameX < 8) frameX++;
		else frameX = 0;
	}

	gameFrame++
	requestAnimationFrame(animate);
}
animate();
// console.log(ctx)




function choseMap(e) {
	if (e.target.checked) {
		mapsPreview.src = `./assets/img/background/${e.target.id}.jpg`;
		game.style.background = `url("../assets/img/background/${e.target.id}.jpg") 0 0 / 100% 100% no-repeat`;
	} else {
		game.style.background = `url("../assets/img/background/mars.jpg") 0 0 / 100% 100% no-repeat`;
	}
}


function launchGame() {
	gameMenu.classList.add('hidden');
	inputMaps.forEach(map => {
		if (map.checked) {
			game.style.background = `url("../assets/img/background/${map.id}.jpg") 0 0 / 100% 100% no-repeat`;
		}
	})
}








