let audioContext = null;

let assignedSound =
    localStorage.getItem('assignedDrop');

async function getAssignedSound() {

    if (!assignedSound) {

        const response =
            await fetch('/api/getProfile');

        const data =
            await response.json();

        assignedSound =
            `../assets/audio/${data.drop}`;

        localStorage.setItem(
            'assignedDrop',
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

const dropBtn =
    document.getElementById('soundButton');

dropBtn.addEventListener('click', () => {

    setupAudio();
});

const pages =
    document.querySelectorAll('.story-page');

const dots =
    document.querySelectorAll('.dot');

window.addEventListener('scroll', () => {

    let current = 0;

    pages.forEach((page, index) => {

        const top =
            page.offsetTop;

        const height =
            page.clientHeight;

        if (
            scrollY >= top - height / 2
        ) {
            current = index;
        }
    });

    dots.forEach(dot => {

        dot.classList.remove('active');
    });

    dots[current].classList.add('active');
    
    });

    document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll('.story-page');
    const dots = document.querySelectorAll('.dot');

    const observerOptions = {
        threshold: 0.7 // Ενεργοποιείται όταν φαίνεται το 70% της σελίδας
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Βρίσκουμε το index της σελίδας
                const index = Array.from(sections).indexOf(entry.target);

                // 2. Ενημερώνουμε τις τελείες
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');

                // 3. ΑΥΤΟΜΑΤΟ REDIRECT ΣΤΗΝ ΤΕΛΕΥΤΑΙΑ ΣΕΛΙΔΑ
                // Αν η σελίδα έχει την κλάση transition-page (π.χ. η Μαριόλα)
                if (entry.target.classList.contains('transition-page')) {
                    setTimeout(() => {
                        window.location.href = "nature.html";
                    }, 4000); // Περιμένει 4 δευτερόλεπτα για να διαβάσει ο χρήστης
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});