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
		var noseWidth = nosePos[1][0]-nosePos[0][0],
			noseHeight = nosePos[2][1] - nosePos[0][1];
		console.log(ZombieChat.DOM.imgs["img-nose"]);
		ZombieChat.ctracker.draw(ZombieChat.DOM.canvas);
		ZombieChat.DOM.context.drawImage(ZombieChat.DOM.imgs["img-nose"],Math.floor(nosePos[0][0]),Math.floor(nosePos[0][1]),Math.floor(noseWidth),Math.floor(noseHeight));
	}
}

$( document ).ready(function() {
    ZombieChat.init();
});