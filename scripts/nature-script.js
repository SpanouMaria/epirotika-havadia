let audioContext = null;

let assignedSound =
    localStorage.getItem('assignedNature');

async function getAssignedSound() {

    if (!assignedSound) {

        const response =
            await fetch('/api/getProfile');

        const data =
            await response.json();

        assignedSound =
            `../assets/audio/${data.nature}`;

        localStorage.setItem(
            'assignedNature',
            assignedSound
        );
    }
}

async function setupAudio() {

    await getAssignedSound();

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    const response =
        await fetch(assignedSound);

    const arrayBuffer =
        await response.arrayBuffer();

    const audioBuffer =
        await audioContext.decodeAudioData(
            arrayBuffer
        );

    const source =
        audioContext.createBufferSource();

    source.buffer = audioBuffer;

    source.connect(
        audioContext.destination
    );

    source.start(0);
}

const natureBtn =
    document.getElementById('soundButton');

naruteBtn.addEventListener('click', () => {

    setupAudio();
});