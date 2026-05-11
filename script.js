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
