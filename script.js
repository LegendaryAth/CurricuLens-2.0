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
