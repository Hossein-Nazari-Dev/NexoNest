// تابع برای باز کردن مودال
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

// تابع برای بستن مودال
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// بستن مودال با کلیک بیرون از آن
window.onclick = function(event) {
  let modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  });
}
