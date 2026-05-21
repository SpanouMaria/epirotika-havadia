let userProfile = null;

async function loadProfile() {

    const savedProfile = localStorage.getItem("userProfile");

    if (savedProfile) {
        userProfile = savedProfile;
        return;
    }

    const response = await fetch('/api/getProfile');

    const data = await response.json();

    userProfile = data.profile;

    localStorage.setItem("userProfile", userProfile);

    console.log("Assigned profile:", userProfile);
}

loadProfile();
const soundProfiles = {

    profile1: {
        bird: "bird1.wav",
        water: "water1.wav",
        wind: "wind1.wav"
    },

    profile2: {
        bird: "bird2.wav",
        water: "water2.wav",
        wind: "wind2.wav"
    },

    profile3: {
        bird: "bird3.wav",
        water: "water3.wav",
        wind: "wind3.wav"
    },

    profile4: {
        bird: "bird4.wav",
        water: "water4.wav",
        wind: "wind4.wav"
    }

};

const btn = document.getElementById('audioBtn');
const modal = document.getElementById('audioModal');
const closeBtn = document.querySelector('.close');

btn.addEventListener('click', () => {
    modal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('active');
    }
});

const soundABtn =
    document.getElementById('soundA');

const dropModal =
    document.getElementById('dropModal');

const closeDrop =
    document.querySelector('.close-drop');

soundABtn.addEventListener('click', () => {

    dropModal.classList.add('active');
});

closeDrop.addEventListener('click', () => {

    dropModal.classList.remove('active');
});

window.addEventListener('click', (event) => {

    if (event.target === dropModal) {

        dropModal.classList.remove('active');
    }
});

const dropSoundBtn =
    document.getElementById('dropSoundBtn');

dropSoundBtn.addEventListener('click', () => {

    const sound =
        soundProfiles[userProfile].bird;

    const audio = new Audio(sound);

    audio.play();
});
