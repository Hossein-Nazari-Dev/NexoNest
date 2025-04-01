


export function initLanguageToggle() {
  const langToggle = document.getElementById('langToggle');
  const contentEn = document.getElementById('content-en');
  const contentFa = document.getElementById('content-fa');

  let isEnglish = true;

  langToggle?.addEventListener('click', () => {
    if (isEnglish) {
      contentEn.style.display = 'none';
      contentFa.style.display = 'block';
      langToggle.textContent = 'Switch to English';
    } else {
      contentEn.style.display = 'block';
      contentFa.style.display = 'none';
      langToggle.textContent = 'Switch to Farsi';
    }
    isEnglish = !isEnglish;
  });
}