const blueAudio = new Audio('blue-sound.mp3');
const redAudio = new Audio('red-sound.mp3');

function setupButton(btn, audio) {
    btn.addEventListener('mousedown', () => {
        audio.currentTime = 0; 
        audio.loop = true;     
        audio.play();
    });

    btn.addEventListener('mouseup', () => {
        audio.pause();
    });

    btn.addEventListener('mouseleave', () => {
        audio.pause();
    });

    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        audio.currentTime = 0;
        audio.loop = true;
        audio.play();
    });

    btn.addEventListener('touchend', () => {
        audio.pause();
    });
}

setupButton(document.getElementById('blueBtn'), blueAudio);
setupButton(document.getElementById('redBtn'), redAudio);
