document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  console.log("script chargé");
  console.log(loginForm);

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      email: document.getElementById("E-mail").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("loggedIn", "true");
        window.location.replace("./index.html");
        addNavigationBar();
      } else {
        window.localStorage.setItem("loggedIn", "false");
        if (response.status === 401) {
          throw new Error(
            "Invalid credentials. Please check your login information."
          );
        } else if (response.status === 404) {
          throw new Error("User not found.");
        } else {
          throw new Error("Unexpected error: " + response.status);
        }
      }
      updateModifierWord();
    } catch (error) {
      console.error(error.message);
    }
  });
});
// Fonction pour mettre à jour le texte du lien "Login/Logout"
function updateLoginLogoutText() {
  console.log("updateLoginLogoutText called");
  const loggedIn = window.localStorage.getItem("loggedIn") === "true";
  const loginLogoutLink = document.querySelector("#login-logout a");
  console.log(loginLogoutLink); // Ajouté pour vérifier la sélection de l'élément

  if (loggedIn) {
    loginLogoutLink.textContent = "Logout";
    loginLogoutLink.href = "./index.html"; // Mettez le lien à "#" ou à une page de déconnexion si nécessaire
    loginLogoutLink.addEventListener("click", handleLogout);
  } else {
    loginLogoutLink.textContent = "Login";
    loginLogoutLink.href = "page-de-connexion.html";
  }
}

function handleLogout() {
  // Effacez le token et mettez à jour l'état de connexion
  window.localStorage.removeItem("token");
  window.localStorage.setItem("loggedIn", "false");

  // Redirigez l'utilisateur vers la page de déconnexion ou toute autre page nécessaire
  window.location.replace("index.html");
}

// Appel initial pour mettre à jour le texte du lien au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Votre code JavaScript ici
  updateLoginLogoutText();
});
