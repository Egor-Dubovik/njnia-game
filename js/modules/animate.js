// ---------------анимация игры-------------------------- 
// const canvas = document.getElementById('player');;
// const ctx = canvas.getContext("2d");;
// const canvasWidth = canvas.width = 110;
// const canvasHight = canvas.height = 200;


// const playerImage = new Image();
// playerImage.src = '../assets/img/ninjaadventurenew/animate.png';
// const plaerWidth = 196;
// const plaerHieght = 342;
// let frameX = 0;
// let frameY = 0;
// let gameFrame = 0;
// const staggeFrames = 10;
// let infinity = true;

// function animate() {

// 	ctx.clearRect(0, 0, canvasWidth, canvasHight);
// 	// ctx.fillRect(50, 50, 100, 100);
// 	ctx.drawImage(playerImage, frameX * plaerWidth, frameY * plaerHieght, plaerWidth, plaerHieght, 0, 0, canvasWidth, canvasHight)

// 	if (gameFrame % staggeFrames == 0) {
// 		if (infinity) {
// 			if (frameX < 8) frameX++;
// 			else frameX = 0;
// 		} else {
// 			if (frameX < 8) frameX++;
// 			else frameX = 8;
// 		}
// 	}


// 	gameFrame++;


// 	requestAnimationFrame(animate);
// }
// animate();