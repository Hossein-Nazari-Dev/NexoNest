// Native controls keep listening available without JavaScript.
const players = [...document.querySelectorAll('.listen audio')];
for (const player of players) {
  player.addEventListener('play', () => {
    for (const other of players) if (other !== player) other.pause();
  });
  const message = player.closest('.listen').querySelector('.audio-error');
  const showError = () => { message.hidden = false; };
  player.addEventListener('error', showError);
  player.querySelector('source')?.addEventListener('error', showError);
  player.addEventListener('loadeddata', () => { message.hidden = true; });
}
