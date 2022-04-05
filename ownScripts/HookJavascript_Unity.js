var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
/*
function unityShowBanner(msg, type) {
  function updateBannerVisibility() {
    warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
  }
  var div = document.createElement('div');
  div.innerHTML = msg;
  warningBanner.appendChild(div);
  if (type == 'error') div.style = 'background: red; padding: 10px;';
  else {
    if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
    setTimeout(function () {
      warningBanner.removeChild(div);
      updateBannerVisibility();
    }, 5000);
  }
  updateBannerVisibility();
}*/

var buildUrl = "Build";
var loaderUrl = buildUrl + "/web2.loader.js";
var config = {
  dataUrl: buildUrl + "/web2.data.unityweb",
  frameworkUrl: buildUrl + "/web2.framework.js.unityweb",
  codeUrl: buildUrl + "/web2.wasm.unityweb",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "webIntegration2022",
  productVersion: "0.1",
  //showBanner: unityShowBanner,
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  // Mobile device style: fill the whole browser client area with the game canvas:

  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
  document.getElementsByTagName('head')[0].appendChild(meta);
  container.className = "unity-mobile";

  // To lower canvas resolution on mobile devices to gain some
  // performance, uncomment the following line:
  // config.devicePixelRatio = 1;

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
} else {
  // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

  canvas.style.width = "960px";
  canvas.style.height = "600px";
}

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  }).then((unityInstance) => {
    loadingBar.style.display = "none";
    fullscreenButton.onclick = () => {
      unityInstance.SetFullscreen(1);
    };
  }).catch((message) => {
    alert(message);
  });

  createUnityInstance(canvas, config, (progress) => { }).then((unityInstance) => {

    var canWritheInputs = true;

    var myInstance = unityInstance;

    document.getElementById("red").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "TintRed");
    });
    document.getElementById("green").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "TintGreen");
    });
    document.getElementById("blue").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "TintBlue");
    });
    document.getElementById("purple").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "TintPurple");
    });
    document.getElementById("scale").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "ScaleObjs");
    });
    document.getElementById("clear").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "ClearObj");
    });

    var pos = { x: 1, y: 2, z: 3 };
    document.getElementById("scaleInputs").addEventListener("click", () => {

      pos.x = document.getElementById("scaleInputX").value;
      pos.y = document.getElementById("scaleInputY").value;
      pos.z = document.getElementById("scaleInputZ").value;

      myInstance.SendMessage("Hook", "ScaleObjsWithInputs", JSON.stringify(pos));
    });
    document.getElementById("rotate").addEventListener("click", () => {
      myInstance.SendMessage("Hook", "RotateObjs");
    });

    document.getElementById("toggle").addEventListener("click", () => {
      canWritheInputs = !canWritheInputs;
      console.log("TOGGLED");

      myInstance.SendMessage("Hook", "ToggleWebGLInputs");
      
    });

  });
};
document.body.appendChild(script);