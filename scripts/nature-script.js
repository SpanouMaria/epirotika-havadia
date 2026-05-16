let audioContext = null;

let assignedSound =
    localStorage.getItem('assignedNature');

async function getAssignedSound() {

    if (!assignedSound) {

        const response =
            await fetch('/api/getProfile');

        console.log(response);

        const data =
            await response.json();

        console.log(data);
        console.log(data.nature);

        assignedSound =
            `../assets/audio/${data.nature}`;

        console.log(assignedSound);

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

    console.log(response);

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

natureBtn.addEventListener('click', () => {

    setupAudio();
});