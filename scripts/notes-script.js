const faBtn =
    document.getElementById('faBtn');

const gBtn =
    document.getElementById('gBtn');

function playSound(button, soundPath) {

    const audio =
        new Audio(soundPath);

    button.classList.add('active');

    audio.play();

    audio.onended = () => {

        button.classList.remove('active');
    };
}

faBtn.addEventListener('click', () => {

    playSound(
        faBtn,
        '../assets/audio/fa.mp3'
    );
});

gBtn.addEventListener('click', () => {

    playSound(
        gBtn,
        '../assets/audio/g.mp3'
    );
});