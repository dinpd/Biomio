<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
    <title>Audio Recorder</title>
    <link rel="shortcut icon" href="favicon.ico" >
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
    
    <link rel="stylesheet" type="text/css" href="http://biom.io/audioTest/css/css.css" />
    <script src="http://biom.io/audioTest/js/audiodisplay.js"></script>
    <script src="http://biom.io/audioTest/js/recorder.js"></script>
    <script src="http://biom.io/audioTest/js/main.js"></script>
</head>
<body>
    <div id="viz">
        <canvas id="analyser" height="500" width="1024"></canvas>
        <canvas id="wavedisplay" height="500" width="1024"></canvas>
    </div>
    <div id="controls">
        <img id="record" onclick="toggleRecording(this);" src="http://webaudiodemos.appspot.com/AudioRecorder/img/mic128.png" class="">
        <a id="save" href="blob:513ed17b-7b39-4e3b-87de-5789e5d7c422" download="myRecording01.wav">
            <img src="http://webaudiodemos.appspot.com/AudioRecorder/img/save.svg">
        </a>
    </div>
    <a onclick="initAudio()" href="#">Click to start</a>
</body>
</html>