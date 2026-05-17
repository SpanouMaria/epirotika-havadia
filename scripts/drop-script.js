let audioContext = null;

let assignedDrop =
    localStorage.getItem(
        'assignedDrop'
    );

let assignedNature =
    localStorage.getItem(
        'assignedNature'
    );

async function getProfileSounds() {

    const response =
        await fetch('/api/getProfile');

    const data =
        await response.json();

    if (!assignedDrop) {

        assignedDrop =
            `../assets/audio/${data.drop}`;

        localStorage.setItem(
            'assignedDrop',
            assignedDrop
        );
    }

    if (!assignedNature) {

        assignedNature =
            `../assets/audio/${data.nature}`;

        localStorage.setItem(
            'assignedNature',
            assignedNature
        );
    }
}

async function playSound(soundPath) {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    const response =
        await fetch(soundPath);

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

const dropBtn =
    document.getElementById(
        'soundButton'
    );

dropBtn?.addEventListener(
    'click',
    async () => {

        await getProfileSounds();

        playSound(assignedDrop);
    }
);

const natureBtn =
    document.getElementById(
        'natureButton'
    );

natureBtn?.addEventListener(
    'click',
    async () => {

        await getProfileSounds();

        playSound(assignedNature);
    }
);

const pages =
    document.querySelectorAll(
        '.story-page'
    );

const dots =
    document.querySelectorAll(
        '.dot'
    );

window.addEventListener(
    'scroll',
    () => {

        let current = 0;

        pages.forEach(
            (page, index) => {

                const top =
                    page.offsetTop;

                const height =
                    page.clientHeight;

                if (
                    scrollY >=
                    top - height / 2
                ) {
                    current = index;
                }
            }
        );

        dots.forEach(dot => {

            dot.classList.remove(
                'active'
            );
        });

        if (dots[current]) {

            dots[current].classList.add(
                'active'
            );
        }
    }
);

const faBtn =
    document.getElementById(
        'faBtn'
    );

const gBtn =
    document.getElementById(
        'gBtn'
    );

faBtn?.addEventListener(
    'click',
    () => {

        playSound(
            '../assets/audio/fa.mp3'
        );
    }
);

gBtn?.addEventListener(
    'click',
    () => {

        playSound(
            '../assets/audio/g.mp3'
        );
    }
);