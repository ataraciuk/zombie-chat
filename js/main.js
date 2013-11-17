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

ZombieChat.drawLoop = function() {
	requestAnimationFrame(ZombieChat.drawLoop);
	var positions = ZombieChat.ctracker.getCurrentPosition();
	if(typeof positions === "object" && positions.length > 50) {
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
		var rotatedWidth = cos === 0 ? deltaY : noseWidth / cos,
			rotatedHeight = cos === 0 ? deltaXForHeight : noseHeight / cos;
		console.log(noseHeight);
		ZombieChat.ctracker.draw(ZombieChat.DOM.canvas);
		ZombieChat.drawRotated(ZombieChat.DOM.imgs["img-nose"],Math.floor(middlePointX),Math.floor(middlePointY + noseHeight / 2),Math.floor(rotatedWidth),Math.floor(rotatedHeight), angle);
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