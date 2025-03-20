document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
      const typingElement = document.querySelector('.typing-animation');
      typingElement.style.animation = 'typing 3.5s steps(40, end), blink-caret 0.75s step-end';

      typingElement.addEventListener('animationend', function() {
          typingElement.style.borderRight = 'none'; 
      });
  }, 3000); 
});