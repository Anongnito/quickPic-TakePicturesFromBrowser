/**
 * Created by Anongnito on 14/01/2016.
 */


var quickPic = (function() {

    var video = document.getElementById('cameraVideo');
    var downloadLink = document.getElementById('downloadLink');
    var newPictureLink = document.getElementById('newPicture');
    var screenshot = document.getElementById('screenshot');
    var localMediaStream = false;
    var screenshotParent = screenshot.parentNode;

    try {
        var canvas = fx.canvas();
    } catch (e) {
        alert(e);
    }

    var texture = canvas.texture(video);

    var hasGetUserMedia = function() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    };

    var snapshot = function() {
        localMediaStream = true;
        if (localMediaStream) {
            canvas.update();
            var imageURL = canvas.toDataURL('image/png');
            document.querySelector('img').src = imageURL;
            document.querySelector('a').href = imageURL;
            downloadLink.style.display = "block";
            newPictureLink.style.display = "block";
            screenshot.style.display = "block";
            canvas.style.display = "none";
        }
    };

    var newPicture = function() {
        downloadLink.style.display = "none";
        newPictureLink.style.display = "none";
        screenshot.style.display = "none";
        canvas.style.display = "block";
    };

    var draw = function() {
        setInterval(function () {
            if (video.currentTime >= 0.1) {
                texture.loadContentsOf(video);

                var effectsList = document.getElementById('effectsList');
                var selectedValue = effectsList.options[effectsList.selectedIndex].value;

                if (selectedValue == "normal") {
                    canvas.draw(texture).update();
                } else if (selectedValue == "vignette") {
                    canvas.draw(texture).vignette(0, 1, 0.5, 0.01, 0, 1, 0.5, 0.01).update();
                } else if (selectedValue == "vibrance") {
                    canvas.draw(texture).vibrance(1).update();
                } else if (selectedValue == "noise") {
                    canvas.draw(texture).noise(0.5).update();
                } else if (selectedValue == "sepia") {
                    canvas.draw(texture).sepia(1).update();
                } else if (selectedValue == "hueSaturation") {
                    canvas.draw(texture).hueSaturation(-1, -1).update();
                } else if (selectedValue == "denoise") {
                    canvas.draw(texture).denoise(15).update();
                } else if (selectedValue == "unsharpmask") {
                    canvas.draw(texture).unsharpMask(20, 2).update();
                } else if (selectedValue == "ink") {
                    canvas.draw(texture).ink(0.25).update();
                }
            }
        }, 10);
    };

    var errorCallback = function (e) {
        console.log('Camera Rejected', e);
    };

    var checkLocalMediaStream = function() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream.active
            }, errorCallback);
        } else if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream.active;
                console.log(localMediaStream);
            }, errorCallback);
        } else if (navigator.mozGetUserMedia) {
            navigator.mozGetUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream.active
            }, errorCallback);
        } else if (navigator.msGetUserMedia) {
            navigator.msGetUserMedia({video: true}, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream.active
            }, errorCallback);
        } else {
            console.log('Nope, no getUserMedia at all');
        }
    };

    var initialization = function() {
        if (hasGetUserMedia()) {
            // Good to go!
        } else {
            alert('getUserMedia() is not supported in your browser');
        }

        checkLocalMediaStream();

        video.play();
        screenshotParent.insertBefore(canvas, screenshot);
        document.getElementById('takePicture').addEventListener('click', snapshot, false);

        video.addEventListener('play', function () {
            draw();
        }, false);
    };

    initialization();

    return {
        newPicture: newPicture
   };
})();

