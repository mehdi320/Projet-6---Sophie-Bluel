// Écouteur d'événement qui attend que tout le contenu HTML soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Vérifie si le formulaire de connexion existe sur la page
  const loginForm = document.getElementById("loginForm");

  // Si le formulaire est présent (c'est-à-dire que nous sommes sur la page de connexion)
  if (loginForm) {
    console.log("Page de connexion détectée, script activé.");

    // Lorsque le formulaire est soumis, on empêche le comportement par défaut et on traite la connexion
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

      // Récupère les valeurs saisies dans les champs du formulaire
      const formData = {
        email: document.getElementById("E-mail").value,
        password: document.getElementById("password").value,
      };

      try {
        // Envoie une requête POST avec les informations de connexion
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Indique que le corps de la requête est en JSON
          },
          body: JSON.stringify(formData), // Convertit l'objet formData en chaîne JSON
        });

        // Si la connexion est réussie (status 200)
        if (response.status === 200) {
          const data = await response.json(); // Récupère les données de la réponse
          window.localStorage.setItem("token", data.token); // Sauvegarde le token dans le localStorage
          window.localStorage.setItem("loggedIn", "true"); // Indique que l'utilisateur est connecté
          window.location.replace("./index.html"); // Redirige vers la page d'accueil
        } else {
          window.localStorage.setItem("loggedIn", "false"); // Si la connexion échoue, met à jour l'état de connexion

          // Gère les erreurs spécifiques selon le statut de la réponse
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
      } catch (error) {
        console.error(error.message); // Affiche l'erreur dans la console si la requête échoue
      }
    });
  } else {
    console.log("Page de connexion non détectée, script ignoré."); // Si le formulaire n'existe pas, ne fait rien
  }

  // Appelle la fonction pour mettre à jour le lien "login/logout"
  updateLoginLogoutText();
});

// Fonction qui met à jour le texte et l'action du lien "login/logout"
function updateLoginLogoutText() {
  console.log("updateLoginLogoutText called");

  // Récupère l'état de connexion de l'utilisateur (vérifie le localStorage)
  const loggedIn = window.localStorage.getItem("loggedIn") === "true";

  // Cherche l'élément du lien "login/logout"
  const loginLogoutLink = document.querySelector("#login-logout a");

  // Si le lien existe
  if (loginLogoutLink) {
    // Si l'utilisateur est connecté, on change le texte et l'action du lien pour "logout"
    if (loggedIn) {
      loginLogoutLink.textContent = "logout"; // Modifie le texte du lien
      loginLogoutLink.href = "./index.html"; // Modifie le lien pour rediriger vers la page d'accueil
      loginLogoutLink.addEventListener("click", handleLogout); // Ajoute un gestionnaire pour la déconnexion
    } else {
      // Si l'utilisateur n'est pas connecté, on change le texte et l'action du lien pour "login"
      loginLogoutLink.textContent = "login";
      loginLogoutLink.href = "page-de-connexion.html"; // Lien vers la page de connexion
    }
  } else {
    console.warn("Lien login/logout non trouvé sur cette page."); // Si le lien n'est pas trouvé, affiche un avertissement
  }
}

// Fonction pour gérer la déconnexion
function handleLogout() {
  // Supprime le token et met à jour l'état de connexion dans le localStorage
  window.localStorage.removeItem("token");
  window.localStorage.setItem("loggedIn", "false");

  // Redirige l'utilisateur vers la page d'accueil après la déconnexion
  window.location.replace("index.html");
}
