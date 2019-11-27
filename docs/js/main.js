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

    $scope.photo = $rootScope.getImagePath($scope.id);

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    var width = 0; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    var streaming = false;
    var video = null;
    var canvas = null;
    var photo = null;

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
        $scope.countDown = 3 ; // Seconds to coundown
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
        console.log("[homeCtrl] init");

        if ($rootScope.mobileCheck()) {
            console.log("[homeCtrl] Mobile");
            width = 320;
        } else {
            console.log("[homeCtrl] Desktop");
            width = 720;
        }

        
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');

        navigator.mediaDevices.getUserMedia({
                video: true, // { facingMode: { exact: "user" } },
                audio: false
            })
            .then(function(stream) {
                console.log("[homeCtrl][init] getUserMedia then");
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

                //photo.style.width = width;
                //photo.style.height = height;
                photo.setAttribute('width', width);
                photo.setAttribute('height', height);
                photo.style.visibility = 'visible';

                video.style.width = document.width + 'px';
                video.style.height = document.height + 'px';
                video.setAttribute('autoplay', '');
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');

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
        
        var imageObj2 = new Image();
        imageObj2.src = $rootScope.getImagePath($scope.id);
        imageObj2.onload = function() {
            console.log("[sharephotoCtrl][init] imageObj2.onload");
            context.save();
            context.drawImage(imageObj2, 0, 0, imageObj1.width, imageObj1.height);
            context.restore();
        }
       
        imageObj1.onload = function() {
            console.log("[sharephotoCtrl][init] imageObj1.onload");
            $scope.canvas.width = imageObj1.width;
            $scope.canvas.height = imageObj1.height;
            context.save();
            context.translate(imageObj1.width, 0);
            context.scale(-1, 1);
            context.drawImage(photo, 0, 0, imageObj1.width, imageObj1.height);
            context.restore();
        }

    }
    $scope.init();

    $scope.goto = function(to) {
        console.log("[sharephotoCtrl] goto: " +  to);
        $location.path(to);
    }

    $scope.download = function() {
        console.log("[sharephotoCtrl] download");

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        var downloadLink = document.createElement("a");
        downloadLink.href = $scope.canvas.toDataURL();
        downloadLink.download = "foto-" + date + ".png";
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
            "mobile" : "images/001 Cuento - Mono photo web 20.png",
            "desktop" : "images/001 Cuento - Mono photo web 30.png"
        },
        {
            "id" : "002",
            "mobile" : "images/002 Cuento - Pulpo photo web0.png",
            "desktop" : "images/002 Cuento - Pulpo photo web0.png"
        }
    ];

    $rootScope.getImagePath = function(id) {
        var photo = $rootScope.photoList.find(element => element.id.localeCompare(id) == 0);
        if ($rootScope.mobileCheck()) {
            return photo.mobile;
        } else {
            return photo.desktop;
        }
    }

    $rootScope.mobileCheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
})