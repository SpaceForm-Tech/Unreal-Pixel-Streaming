// Copyright Epic Games, Inc. All Rights Reserved.


function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function setVisualization(id) {
    let descriptor = {
        Visualization: id
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setMinQP(qp) {
    cmd = 'PixelStreaming.Encoder.MinQP ' + qp;
    let descriptor = {
        Console: cmd
    }
    str = qp == -1 ? "DISABLED" : qp;
    document.getElementById('minQPDropdown').innerHTML = 'Min QP (' + str + ')&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setMaxQP(qp) {
    cmd = 'PixelStreaming.Encoder.MaxQP ' + qp;
    let descriptor = {
        Console: cmd
    }
    str = qp == -1 ? "DISABLED" : qp;
    document.getElementById('maxQPDropdown').innerHTML = 'Max QP (' + str + ')&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setRateControl(control) {
    rateControlCmd = 'PixelStreaming.Encoder.RateControl ' + control;
    let descriptor = {
        Console: rateControlCmd
    }
    document.getElementById('rateControlDropdown').innerHTML = control + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setMaxBitrate(mbps) {
    cmd = 'PixelStreaming.Encoder.MaxBitrateVBR ' + mbps * 1000000;
    let descriptor = {
        Console: cmd
    }
    str = mbps != 0 ? mbps : 'Unlimited';
    document.getElementById('maxBitrateDropdown').innerHTML = 'Max VBR Bitrate (' + str + ' Mbps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setMultipass(multipass) {
    cmd = 'PixelStreaming.Encoder.Multipass ' + multipass;
    let descriptor = {
        Console: cmd
    }
    document.getElementById('multipassDropdown').innerHTML = multipass + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setFramerateCap(cap) {
    capFpsCmd = 't.maxFPS ' + cap;
    let descriptor = {
        Console: capFpsCmd
    }
    capStr = cap != 0 ? cap : 'Unlimited';
    document.getElementById('framerateCapDropdown').innerHTML = 'Framerate Cap (' + capStr + ' fps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function zoom() {
    let descriptor = {
        zoom: 1
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onCharacterButton(category, item) {
    let descriptor = {
        Category: category,
        Item: item
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onConfigButton(category, item) {
    let descriptor = {
        Category: category,
        Item: item
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onToken() {
	emitUIInteraction("CheckingURL");
	var fullUrl = window.location.href;
	var sendToken = fullUrl.split('?')[1];
	console.log("'" + sendToken + "'");
    emitUIInteraction(sendToken);
}

function setRes(width, height) {
    let descriptor = {
        Console: 'r.' + 'setres ' + width + 'x' + height + 'w'
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onConfigurationOne() {
    let descriptor = {
		Category: 0,
		Item: 3
	};
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onConfigurationTwo() {
	let descriptor = {
	    Category: 1,
	    Item: 4
	};
	emitUIInteraction(descriptor);
}

function myHandleResponseFunction(data) {
	if (data.substring("GetToken")) {
		console.log("GetToken Called");
		//onToken("?token=mQqdp8ckYio2Pj1qLpJiwe7EATQVbYYv");
		onToken();
		//emitUIInteraction("?token=mQqdp8ckYio2Pj1qLpJiwe7EATQVbYYv");
	}
		if (data.substring("1080p")) {
		// UE4 only supports up to 1080p, not 4K.
		console.log("Disabling 4k button");
		let button4K = document.getElementById("4k");
		button4K.remove();
		button4K.title = "4K is supported only when -NvEncH264ConfigLevel=NV_ENC_LEVEL_H264_52 UE4 is added to UE4 command line";
	}	
}

var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab';   // We will have a browser side grab cursor.
var isFullscreen = false;

function onParagonLoad() {
	//afk.enabled;
	//afk.warnTimeout = 5;
	//afk.closeTimeout = 10;
	styleAdditional = grabStyle;
	inputOptions.controlScheme = ControlSchemeType.HoveringMouse;
	inputOptions.fakeMouseWithTouches = true;
	styleWidth = 700;
	styleHeight = 394;

	if (document.addEventListener)
	{
	    document.addEventListener('webkitfullscreenchange', onFullscreenChange, false);
	    document.addEventListener('mozfullscreenchange', onFullscreenChange, false);
	    document.addEventListener('fullscreenchange', onFullscreenChange, false);
	    document.addEventListener('MSFullscreenChange', onFullscreenChange, false);
	}

	let fullscreenCheck = document.getElementById('ck-fullscreen');
	if(fullscreenCheck){
		fullscreenCheck.onclick = function(){
			if (!isFullscreen) {
				enterFullscreen();
			} else {
				exitFullscreen();
			}
		};
	}

	// When the data channel is connected we want to ask UE4 if 4K is supported.
	onDataChannelConnected = function() { emitUIInteraction("4K"); };
	addResponseEventListener("handle_responses", myHandleResponseFunction);
}

function onFullscreenChange(data)
{
	var fullscreenDiv    = document.getElementById("player");
	isFullscreen = (document.webkitIsFullScreen 
		|| document.mozFullScreen 
		|| (document.msFullscreenElement && document.msFullscreenElement !== null) 
		|| (document.fullscreenElement && document.fullscreenElement !== null)
		|| (fullscreenDiv && fullscreenDiv.classList.contains("fullscreen")));

	let fullscreenImg = document.getElementById('fullscreen-img');
	if(fullscreenImg){
		fullscreenImg.src = isFullscreen ? 'images/MinimiseToFullscreen.png' : 'images/MaximiseToFullscreen.png'
		fullscreenImg.alt = isFullscreen ? 'Shrink to normal size' : 'Maximise to Fullscreen'
	}
}

function enterFullscreen()
{
	var fullscreenDiv    = document.getElementById("player");
	var textDivs    = document.getElementsByClassName("text");
	var headerDiv    = document.getElementById("header-tbl");
	var fullscreenFunc   = fullscreenDiv.requestFullscreen;

	if (!fullscreenFunc) {
	  ['mozRequestFullScreen',
	   'msRequestFullscreen',
	   'webkitRequestFullScreen'].forEach(function (req) {
	     fullscreenFunc = fullscreenFunc || fullscreenDiv[req];
	   });
	}

	if(fullscreenFunc){
		fullscreenFunc.call(fullscreenDiv);
	} else {
		//No Fullscreen api so maximise video to window size
		if(fullscreenDiv){
			fullscreenDiv.classList.add("fullscreen");
			fullscreenDiv.classList.remove("fixed-size");
		}

		if(textDivs){
			for(let i=0; i<textDivs.length; i++){
				textDivs[i].style.display = "none";
			}
		}

		if(headerDiv)
			headerDiv.style.display = "none";

		onFullscreenChange({});
		onInPageFullscreen();
	}
}

function exitFullscreen()
{
	var fullscreenDiv    = document.getElementById("player");
	var textDivs    = document.getElementsByClassName("text");
	var headerDiv    = document.getElementById("header-tbl");
	var exitFullscreenFunc   = document.exitFullscreen;

	if (!exitFullscreenFunc) {
	  ['mozCancelFullScreen',
	   'msExitFullscreen',
	   'webkitExitFullscreen'].forEach(function (req) {
	     exitFullscreenFunc = exitFullscreenFunc || document[req];
	   });
	}

	if(exitFullscreenFunc) {
		exitFullscreenFunc.call(document);
	} else {
		//No Fullscreen api so shrink video back from max window size
		if(fullscreenDiv){
			fullscreenDiv.classList.remove("fullscreen");
			fullscreenDiv.classList.add("fixed-size");
			fullscreenDiv.style.left = "";
		}

		if(textDivs){
			for(let i=0; i<textDivs.length; i++){
				textDivs[i].style.display = "block";
			}
		}

		if(headerDiv)
			headerDiv.style.display = "table";

		onFullscreenChange({});
		onInPageFullscreen();
	}
}

function onInPageFullscreen(){
	var playerElement = document.getElementById('player');
	let videoElement = playerElement.getElementsByTagName("VIDEO");
	document.documentElement.style.position = isFullscreen ?  "fixed" : "";
	document.body.style.position =  isFullscreen ?  "fixed" : "";

	if(isFullscreen){
		let windowAspectRatio = window.innerHeight / window.innerWidth;
		let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
		// We want to keep the video ratio correct for the video stream
	    let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;

	    if(isNaN(videoAspectRatio)){
	    	//Video is not initialised yet so set playerElement to size of window
	    	styleWidth = window.innerWidth;
	    	styleHeight = window.innerHeight;
	    	styleTop = 0;
	        styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
	        //Video is now 100% of the playerElement so set the playerElement style
	        playerElement.style.width= styleWidth + "px";
	        playerElement.style.height= styleHeight + "px";
	    } else if (windowAspectRatio < playerAspectRatio) {
	        styleWidth = Math.floor(window.innerHeight / videoAspectRatio);
	        styleHeight = window.innerHeight;
	        styleTop = 0;
	        styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
	        //Video is now 100% of the playerElement so set the playerElement style
	        playerElement.style.width= styleWidth + "px";
	        playerElement.style.height= styleHeight + "px";
	    }
	    else {
	        styleWidth = window.innerWidth;
	        styleHeight = Math.floor(window.innerWidth * videoAspectRatio);
	        styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
	        styleLeft = 0;
	        //Video is now 100% of the playerElement so set the playerElement style
	        playerElement.style.width= styleWidth + "px";
	        playerElement.style.height= styleHeight + "px";
	    }

	} else {
		playerElement.style.height = "";
		playerElement.style.width = "";
	}
}
