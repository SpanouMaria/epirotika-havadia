let audioContext = null;

const soundBuffers = {};

let assignedDrop =
    localStorage.getItem(
        'assignedDrop'
    );

let assignedNature =
    localStorage.getItem(
        'assignedNature'
    );

async function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }
}

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

async function preloadSound(
    key,
    path
) {

    if (soundBuffers[key]) {
        return;
    }

    const response =
        await fetch(path);

    const arrayBuffer =
        await response.arrayBuffer();

    soundBuffers[key] =
        await audioContext.decodeAudioData(
            arrayBuffer
        );
}

function playSound(key) {

    const buffer =
        soundBuffers[key];

    if (!buffer) {
        return;
    }

    const source =
        audioContext.createBufferSource();

    source.buffer =
        buffer;

    source.connect(
        audioContext.destination
    );

    source.start(0);
}

async function setupAllSounds() {

    await initAudio();

    await getProfileSounds();

    await preloadSound(
        'drop',
        assignedDrop
    );

    await preloadSound(
        'nature',
        assignedNature
    );

    await preloadSound(
        'fa',
        '../assets/audio/fa.mp3'
    );

    await preloadSound(
        'g',
        '../assets/audio/g.mp3'
    );
}

const dropBtn =
    document.getElementById(
        'soundButton'
    );

dropBtn?.addEventListener(
    'click',
    async () => {

        await setupAllSounds();

        playSound('drop');
    }
);

const natureBtn =
    document.getElementById(
        'natureButton'
    );

natureBtn?.addEventListener(
    'click',
    async () => {

        await setupAllSounds();

        playSound('nature');
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
    async () => {

        await setupAllSounds();

        playSound('fa');
    }
);

gBtn?.addEventListener(
    'click',
    async () => {

        await setupAllSounds();

        playSound('g');
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