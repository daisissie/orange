let video;
let faceapi;
let detections = [];
let orangeImg;

function preload() {
  // Load the orange image
  orangeImg = loadImage("orange.png");
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // Initialize the face-api
    const faceOptions = {
        withLandmarks: true,
        withDescriptors: false,
        minConfidence: 0.3,
        withExpressions: false,
    };
    faceapi = ml5.faceApi(video, faceOptions, modelReady);
}

function modelReady() {
    console.log('FaceAPI model loaded!');
    faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
    if (error) {
        console.error(error);
        return;
    }
    console.log('Faces detected:', result.length);
    detections = result;
    faceapi.detect(gotFaces);
}

function draw() {
    image(video, 0, 0, width, height);

    if (detections && detections.length > 0) {
        let { alignedRect, parts } = detections[0];
        let { x, y, width, height } = alignedRect._box;

        // Draw the orange image over the detected face
        let faceX = x - 20;
        let faceY = y - 20;
        let faceWidth = width + 40;
        let faceHeight = height + 40;

        push();
        translate(faceX + faceWidth / 2, faceY + faceHeight / 2);
        scale(2); // Enlarge the face by twice its size
        translate(-(faceX + faceWidth / 2), -(faceY + faceHeight / 2));
        image(orangeImg, faceX, faceY, faceWidth, faceHeight);
        pop();

        // Get the eyes coordinates and sizes
        let leftEye = parts.leftEye;
        let rightEye = parts.rightEye;
        let leftEyeX = (leftEye[0]._x + leftEye[3]._x) / 2;
        let leftEyeY = (leftEye[0]._y + leftEye[3]._y) / 2;
        let rightEyeX = (rightEye[0]._x + rightEye[3]._x) / 2;
        let rightEyeY = (rightEye[0]._y + rightEye[3]._y) / 2;
        let eyeWidth = dist(leftEye[0]._x, leftEye[0]._y, leftEye[3]._x, leftEye[3]._y);
        let eyeHeight = eyeWidth * 0.6;

        // Get the mouth coordinates and size
        let mouth = parts.mouth;
        let mouthX = (mouth[0]._x + mouth[6]._x) / 2;
        let mouthY = (mouth[0]._y + mouth[6]._y) / 2;
        let mouthWidth = dist(mouth[0]._x, mouth[0]._y, mouth[6]._x, mouth[6]._y);
        let mouthHeight = mouthWidth * 0.6;

        // Enlarge and draw the eyes with separation
        let eyeSeparation = 50;
        push();
        translate(leftEyeX - eyeSeparation, leftEyeY);
        scale(3);
        translate(-(leftEyeX - eyeSeparation), -leftEyeY);
        copy(video, leftEyeX - eyeWidth / 3, leftEyeY - eyeHeight / 3, eyeWidth, eyeHeight, leftEyeX - eyeWidth / 3 - eyeSeparation, leftEyeY - eyeHeight / 3, eyeWidth, eyeHeight);
        pop();

        push();
        translate(rightEyeX + eyeSeparation, rightEyeY);
        scale(3);
        translate(-(rightEyeX + eyeSeparation), -rightEyeY);
        copy(video, rightEyeX - eyeWidth / 3, rightEyeY - eyeHeight / 3, eyeWidth, eyeHeight, rightEyeX - eyeWidth / 3 + eyeSeparation, rightEyeY - eyeHeight / 3, eyeWidth, eyeHeight);
        pop();

        // Enlarge and draw the mouth
        push();
        translate(mouthX, mouthY);
        scale(3);
        translate(-mouthX, -mouthY);
        copy(video, mouthX - mouthWidth / 3, mouthY - mouthHeight / 3, mouthWidth, mouthHeight, mouthX - mouthWidth / 3, mouthY - mouthHeight / 3, mouthWidth, mouthHeight);
        pop();
    }
}
