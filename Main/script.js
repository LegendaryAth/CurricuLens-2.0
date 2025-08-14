// Redirect to project page
function openProject(link) {
    window.location.href = link;
}

// Login function
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username && password) {
        localStorage.setItem("curriculensUser", username);
        window.location.href = "index.html";
    } else {
        alert("Please enter username and password");
    }
}

// Show profile if logged in
document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("curriculensUser");
    const authBtn = document.getElementById("auth-btn");
    const profile = document.getElementById("profile");
    const usernameDisplay = document.getElementById("username-display");

    if (user && profile && authBtn) {
        authBtn.classList.add("hidden");
        profile.classList.remove("hidden");
        usernameDisplay.textContent = user;
    }
});

const navLinks = document.querySelector('.hero');

navLinks.addEventListener('mousemove', function(e) {
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  // Set size of ripple
  const size = 60;
  ripple.style.width = ripple.style.height = size + 'px';

  // Position ripple at mouse coords relative to navLinks container
  const rect = navLinks.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

  // Append ripple
  navLinks.appendChild(ripple);

  // Remove ripple after animation ends
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
});
