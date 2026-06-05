let audioContext = null;

const soundBuffers = {};

let currentDropSource =
    null;

let currentNatureSource =
    null;

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

    if (
        assignedDrop &&
        assignedNature
    ) {
        return;
    }

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

async function loadSound(
    key,
    path
) {

    if (soundBuffers[key]) {
        return;
    }

    const response =
        await fetch(path);

    if (!response.ok) {

        throw new Error(
            `Failed to load ${path}`
        );
    }

    const arrayBuffer =
        await response.arrayBuffer();

    const audioBuffer =
        await audioContext.decodeAudioData(
            arrayBuffer
        );

    soundBuffers[key] =
        audioBuffer;
}

function playSound(
    key,
    loop = false
) {

    const buffer =
        soundBuffers[key];

    if (!buffer) {
        return;
    }

    const source =
        audioContext.createBufferSource();

    source.buffer =
        buffer;

    source.loop =
        loop;

    source.connect(
        audioContext.destination
    );

    source.start(0);

    return source;
}

const dropBtn =
    document.getElementById(
        'soundButton'
    );

dropBtn?.addEventListener(
    'click',
    async () => {

        await initAudio();

        await getProfileSounds();

        await loadSound(
            'drop',
            assignedDrop
        );

    if (currentDropSource) {

        try {

            currentDropSource.stop();

        } catch {}
    }
    currentDropSource =
        playSound(
            'drop',
            true
        );

    const source =
        currentDropSource;

        setTimeout(() => {

            source.stop();

        }, 120000);
    }
);

const natureBtn =
    document.getElementById(
        'natureButton'
    );

natureBtn?.addEventListener(
    'click',
    async () => {

        await initAudio();

        await getProfileSounds();

        await loadSound(
            'nature',
            assignedNature
        );

        if (currentNatureSource) {

            try {

                currentNatureSource.stop();

            } catch {}
        }
        
        currentNatureSource =
            playSound(
                'nature',
                true
            );

        const source =
            currentNatureSource;

        setTimeout(() => {

            source.stop();

        }, 120000);
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

window.addEventListener(
    'load',
    async () => {

        try {

            await initAudio();

            await getProfileSounds();

            await Promise.all([

                loadSound(
                    'drop',
                    assignedDrop
                ),

                loadSound(
                    'nature',
                    assignedNature
                ),

                loadSound(
                    'fa',
                    '../assets/audio/fa.mp3'
                ),

                loadSound(
                    'g',
                    '../assets/audio/g.mp3'
                )
            ]);

        } catch (error) {

            console.error(
                'Audio preload failed:',
                error
            );
        }
    }
);

faBtn?.addEventListener(
    'click',
    () => {

        playSound('fa');
    }
);

gBtn?.addEventListener(
    'click',
    () => {

        playSound('g');
    }
);

const pages =
    document.querySelectorAll(
        '.story-page'
    );

const dots =
    document.querySelectorAll(
        '.progress-number'
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

const isIOS =

    /iPhone|iPad|iPod/i
    .test(
        navigator.userAgent
    );

if (isIOS) {

    alert(
        'Για πλήρη εμπειρία ήχου, απενεργοποιήστε τη σίγαση.'
    );
}

const params =
    new URLSearchParams(
        window.location.search
    );

const song =
    params.get('song');

if (song) {

    window.addEventListener(
        'load',
        () => {

            setTimeout(() => {

                const target =
                    document.getElementById(
                        `song-${song}`
                    );

                if (target) {

                    const container =
                        document.querySelector(
                            '.story-body'
                        );

                    if (container) {

                        container.scrollTo({

                            top:
                                target.offsetTop,

                            behavior:
                                'auto'
                        });

                    } else {

                        target.scrollIntoView({
                            behavior:
                                'auto'
                        });
                    }
                }

            }, 500);
        }
    );
}