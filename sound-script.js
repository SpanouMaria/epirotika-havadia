const sounds = ['audio1.mp3', 'audio2.mp3', 'audio3.mp3', 'audio4.mp3'];
let audioContext = null;
let source = null;

async function setupAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    let pool = JSON.parse(sessionStorage.getItem('soundPool')) || [...sounds].sort(() => Math.random() - 0.5);
    const selectedSound = pool.pop();
    sessionStorage.setItem('soundPool', JSON.stringify(pool));
    
    const response = await fetch(selectedSound);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true; 
    source.connect(audioContext.destination);
    source.start(0);
}

const dropBtn = document.getElementById('soundButton');
let isPlaying = false;

dropBtn.addEventListener('click', () => {
    if (!isPlaying) {
        setupAudio(); 
        dropBtn.textContent = "🔊";
        isPlaying = true;
    } else {
        if (source) source.stop();
        dropBtn.textContent = "💧";
        isPlaying = false;
    }
});
