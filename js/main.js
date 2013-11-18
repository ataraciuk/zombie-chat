// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

ZombieChat = {};
ZombieChat.init = function() {
	ZombieChat.DOM.video = document.getElementById('video');
	ZombieChat.DOM.canvas = document.getElementById('canvas');
	ZombieChat.DOM.context = ZombieChat.DOM.canvas.getContext('2d');
	ZombieChat.ctracker = new clm.tracker();
 	ZombieChat.ctracker.init(pModel);

 	ZombieChat.DOM.video.play();
 	ZombieChat.ctracker.start(ZombieChat.DOM.video);
 	ZombieChat.drawLoop();
 	$("#images").children().each(function(i,e) {
 		ZombieChat.DOM.imgs[e.id] = e;
 	});

	navigator.getUserMedia({audio: false, video: true}, function(stream){
		// Set your video displays
		$(ZombieChat.DOM.video).prop('src', URL.createObjectURL(stream));

		window.localStream = stream;
	}, function(){ });
};

ZombieChat.DOM = {
	video: null,
	canvas: null,
	context: null,
	imgs: {}
};

ZombieChat.ctracker = null;

ZombieChat.transparency = 0.4;

ZombieChat.drawLoop = function() {
	requestAnimationFrame(ZombieChat.drawLoop);
	var positions = ZombieChat.ctracker.getCurrentPosition();
	if(typeof positions === "object" && positions.length > 50) {

		ZombieChat.DOM.context.globalAlpha = ZombieChat.transparency;

		ZombieChat.DOM.context.clearRect(0, 0, ZombieChat.DOM.canvas.width, ZombieChat.DOM.canvas.height);
		var nosePos = [positions[34], positions[40], positions[37]];
		var noseWidth = nosePos[1][0] - nosePos[0][0],
			deltaY = nosePos[1][1] - nosePos[0][1];
		var middlePointX = nosePos[0][0] + noseWidth / 2,
			middlePointY = nosePos[0][1] + deltaY / 2;
		var noseHeight = nosePos[2][1] - middlePointY,
			deltaXForHeight = nosePos[2][0] - middlePointX;
		var angle = Math.atan2(deltaY,noseWidth);
		var sin = Math.sin(angle), cos = Math.cos(angle);
		var rotatedWidth = cos === 0 ? Math.abs(deltaY) : noseWidth / cos,
			rotatedHeight = cos === 0 ? Math.abs(deltaXForHeight) : noseHeight / cos;
		//ZombieChat.ctracker.draw(ZombieChat.DOM.canvas);
		ZombieChat.drawRotated(ZombieChat.DOM.imgs["img-nose"],Math.floor(middlePointX),Math.floor(middlePointY + noseHeight / 20),Math.floor(rotatedWidth),Math.floor(rotatedHeight * 1.5), angle);
		var jawPos = [positions[53], positions[5], positions[9], positions[7]];
		var scale = 0.6;
		var jawWidth = (jawPos[2][0] - jawPos[1][0]) * scale,
			jawHeight = (jawPos[3][1] - jawPos[0][1]) * scale,
			middlePointX = (jawPos[2][0] + jawPos[1][0]) / 2,
			middlePointY = (jawPos[3][1] + jawPos[0][1]) / 2,
			jawWithIf90 = (jawPos[2][1] - jawPos[1][1]) * scale,
			jawHeightIf90 = (jawPos[3][0] - jawPos[0][0]) * scale;
		angle = Math.atan2(jawWithIf90, jawWidth);
		cos = Math.cos(angle);
		jawWidth = cos === 0 ? Math.abs(jawWithIf90) : jawWidth / cos;
		jawHeight = cos === 0 ? Math.abs(jawHeightIf90) : jawHeight / cos;
		ZombieChat.drawRotated(ZombieChat.DOM.imgs["img-below-mouth"],Math.floor(middlePointX),Math.floor(middlePointY),Math.floor(jawWidth),Math.floor(jawHeight), angle);
		var rightCheekPos = [positions[33], positions[62], positions[13], positions[1]];
		var rightCheekWidth = (rightCheekPos[2][0] - rightCheekPos[3][0]) * scale * 0.25,
			rightCheekHeight = (rightCheekPos[1][1] - rightCheekPos[0][1]) * scale,
			middlePointX = (6 * rightCheekPos[2][0] + rightCheekPos[3][0]) / 7,
			middlePointY = (6 * rightCheekPos[2][1] + rightCheekPos[3][1]) / 7,
			rightCheekWithIf90 = (rightCheekPos[2][1] - rightCheekPos[3][1]) * scale * 0.25,
			rightCheekHeightIf90 = (rightCheekPos[1][0] - rightCheekPos[0][0]) * scale;
		rightCheekWidth = cos === 0 ? Math.abs(rightCheekWithIf90) : rightCheekWidth / cos;
		rightCheekHeight = cos === 0 ? Math.abs(rightCheekHeightIf90) : rightCheekHeight / cos;
		ZombieChat.drawRotated(ZombieChat.DOM.imgs["img-right-cheek"],Math.floor(middlePointX),Math.floor(middlePointY),Math.floor(rightCheekWidth),Math.floor(rightCheekHeight), angle);
	}
}

ZombieChat.drawRotated = function(image, x, y, width, height, angle) {
	// save the current co-ordinate system 
	// before we screw with it
	ZombieChat.DOM.context.save(); 
 
	// move to the middle of where we want to draw our image
	ZombieChat.DOM.context.translate(x , y);
 
	// rotate around that point, converting our 
	// angle already in radians
	ZombieChat.DOM.context.rotate(angle);
 
	// draw it up and to the left by half the width
	// and height of the image 
	ZombieChat.DOM.context.drawImage(image, -(width/2), -(height/2), width, height);
 
	// and restore the co-ords to how they were when we began
	ZombieChat.DOM.context.restore(); 
}

$( document ).ready(function() {
    ZombieChat.init();
});