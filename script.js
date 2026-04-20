const btn = document.getElementById('audioBtn');
const modal = document.getElementById('audioModal');

btn.addEventListener('click', () => {
  modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
});
