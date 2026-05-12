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
        bird: "bird1.mp3",
        water: "water1.mp3",
        wind: "wind1.mp3"
    },

    profile2: {
        bird: "bird2.mp3",
        water: "water2.mp3",
        wind: "wind2.mp3"
    },

    profile3: {
        bird: "bird3.mp3",
        water: "water3.mp3",
        wind: "wind3.mp3"
    },

    profile4: {
        bird: "bird4.mp3",
        water: "water4.mp3",
        wind: "wind4.mp3"
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
