var app = angular.module('app', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/photo/:id", {
            templateUrl : "pages/home.html", 
            controller: "homeCtrl"
        })
        .when("/sharephoto/:id", {
            templateUrl : "pages/sharephoto.html",
            controller: "sharephotoCtrl"
        });

});

app.controller('homeCtrl', function($scope, $rootScope, $routeParams, $interval, $location){
    console.log("[homeCtrl] start");
    
    $scope.id = $routeParams.id;

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    var width = 320; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    var streaming = false;
    var video = null;
    var canvas = null;

    $scope.goto = function(to) {
        console.log("[homeCtrl] goto: " +  to);
        $location.path(to);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
    $scope.takepicture = async function() {
        console.log("[homeCtrl] takepicture");
        var context = canvas.getContext('2d');

        if (width && height) {
            canvas.width = width;
            canvas.height = height;

            $rootScope.width = width;
            $rootScope.height = height;

            console.log("[homeCtrl] drawImage");
            await context.drawImage(video, 0, 0, width, height);
            $rootScope.photo = await canvas.toDataURL();       
        }
    }

    $scope.doCountDown = function() {
        console.log("[homeCtrl] countDown!");
        $scope.countDown = 2 ; // Seconds to coundown
        $scope.interval = $interval(async function(){
            console.log("[homeCtrl] countDown: ", $scope.countDown--);
            if ($scope.countDown == 0) {
                console.log("[homeCtrl] countDown stop!");
                await $scope.takepicture();
                await $interval.cancel($scope.interval);
                await $location.path('/sharephoto/' + $scope.id);
                await $scope.$apply();
            }
        },1000,0);
    }

    $scope.init = function() {
        console.log("init");
        
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("[homeCtrl] An error occurred: " + err);
            });
        
        video.addEventListener('canplay', function(ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.
                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                console.log("[homeCtrl][addEventListener canplay] height : ", height);

                video.setAttribute('width', width);
                video.setAttribute('height', height);

                streaming = true;
            }
        }, false);
    };
    $scope.init();

    $scope.$on("$destroy", function() {
        console.log("[homeCtrl] destroy");
        try {
            video.srcObject.getTracks().forEach(function(track) {
                track.stop();
            });
        } catch (ex) {
            console.log("[homeCtrl] destroy", ex);
        }
    });
});

app.controller('sharephotoCtrl', function($scope, $rootScope, $routeParams, $location){
    console.log("[sharephotoCtrl] start");

    $scope.id = $routeParams.id;

    $scope.canvas = null; 

    $scope.init = function() {
        console.log("[sharephotoCtrl][init]");

        $scope.canvas = document.getElementById('canvas');
        var context = $scope.canvas.getContext('2d');
               
        /*
        var imageObj1 = new Image();
        imageObj1.src = $rootScope.photo;
        */

        // draw image
        var imageObj1 = document.getElementById('photo');
        if ($rootScope.photo) {
            imageObj1.setAttribute('src', $rootScope.photo);
        } else {
            imageObj1.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII');
        }

        imageObj1.onload = function() {
            $scope.canvas.width = imageObj1.width;
            $scope.canvas.height = imageObj1.height;
            context.save();
            context.translate(imageObj1.width, 0);
            context.scale(-1, 1);
            context.drawImage(photo, 0, 0, imageObj1.width, imageObj1.height);
            context.restore();
        }

        

        var imageObj2 = new Image();
        imageObj2.src = "images/001 Cuento - Mono photo0.png";
        imageObj2.onload = function() {
            context.drawImage(imageObj2, 0, 0, imageObj1.width, imageObj1.height);      
        }
    }
    $scope.init();

    $scope.goto = function(to) {
        console.log("[sharephotoCtrl] goto: " +  to);
        $location.path(to);
    }

    $scope.download = function() {
        console.log("[sharephotoCtrl] download");
        var downloadLink = document.createElement("a");
        downloadLink.href = $scope.canvas.toDataURL();
        downloadLink.download = "foto.png";
        downloadLink.click();
    }

    $scope.$on("$destroy", function() {
        console.log("[sharephotoCtrl] destroy");
        $rootScope.photo = null;
    });
});

app.run(function($rootScope) {
    $rootScope.photoList = [
        {
            "id" : "001",
            "image" : "images/001 Cuento - Mono photo0.png"
        },
        {
            "id" : "002",
            "image" : "002 Cuento - Pulpo photo web0.png"
        }
    ];
})