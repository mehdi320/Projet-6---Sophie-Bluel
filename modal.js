//Token récupéré depuis le localStorage
let token;
try {
  token = window.localStorage.getItem("token");
  if (!token) {
    throw new Error("Token non trouvé dans le localStorage");
  }
} catch (error) {
  console.error(error);
}

//Ajouter le token en dehors d'un bloc de code pour qu'il soit accessible dans toute la page

document.addEventListener("DOMContentLoaded", function () {
  // Cacher la première modal au chargement de la page
  let firstModal = document.getElementById("myModal");
  firstModal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  // Récupérez le bouton "Modifier"
  let button = document.getElementById("buttonModifier");

  // Ajoutez un écouteur d'événements au bouton pour appeler la fonction openModal lorsqu'il est cliqué
  button.addEventListener("click", async () => {
    // Récupérez le token du localStorage
    let token = window.localStorage.getItem("token");

    // Vérifiez si le token est présent
    if (token) {
      // Appeler la fonction openModal avec le token récupéré
      await openModal(token);
    } else {
      console.error(
        "Token non défini. L'utilisateur doit être connecté pour accéder à cette fonctionnalité."
      );
      // Gérer le cas où l'utilisateur n'est pas connecté, par exemple rediriger vers la page de connexion
    }
  });
});

// Fonction asynchrone pour récupérer les photos et ouvrir la modal
async function openModal(token) {
  try {
    // Récupérez les photos de l'API en utilisant AJAX
    let response = await fetch("http://localhost:5678/api/works", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
    }

    let data = await response.json();
    console.log(data);

    // Récupérez la modal et le conteneur de contenu de la modal
    let modal = document.getElementById("myModal");
    let modalContent = modal.querySelector(".modal-content");

    // Videz le contenu de la modal avant d'ajouter de nouvelles images
    modalContent.innerHTML = "";

    // Ajoutez les photos à la modal
    data.forEach((photo, index) => {
      // Créez un nouveau conteneur pour l'image et l'icône
      let imageContainer = document.createElement("div");
      imageContainer.className = "image-container";

      // Créez et ajoutez l'image au conteneur
      let img = document.createElement("img");
      img.src = photo.imageUrl;
      img.id = `photo-${index}`; // Utilisation de l'index comme identifiant unique pour chaque photo
      imageContainer.appendChild(img);

      // Créez le conteneur du carré noir
      let blackSquare = document.createElement("div");
      blackSquare.classList.add("black-square");

      // Créez l'icône de la corbeille
      let trashIcon = document.createElement("i");
      trashIcon.classList.add("fa", "fa-solid", "fa-trash-can");
      trashIcon.id = `trash-${index}`; // Utilisation de l'index comme identifiant unique pour chaque icône de corbeille

      // Ajoutez un événement de suppression au clic sur l'icône
      trashIcon.addEventListener("click", (event) => {
        event.preventDefault(); // Empêche le rechargement de la page lors de la suppression
        deleteProject(photo.id);
      });

      // Ajoutez l'icône à l'intérieur du carré noir
      blackSquare.appendChild(trashIcon);

      // Ajoutez le carré noir au conteneur de l'image
      imageContainer.appendChild(blackSquare);

      // Ajoutez le conteneur de l'image (avec le carré noir et l'icône) à la modal
      modalContent.appendChild(imageContainer);
    });

    async function deleteProject(projectId) {
      try {
        let token = window.localStorage.getItem("token");
        if (!token) {
          throw new Error("Token non trouvé ou expiré");
        }

        // Effectuez la suppression depuis l'API
        let response = await fetch(
          `http://localhost:5678/api/works/${projectId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }

        // Si la suppression réussit, mettez à jour les données dans votre application
        const indexToRemove = data.findIndex((photo) => photo.id === projectId);
        if (indexToRemove !== -1) {
          data.splice(indexToRemove, 1);
        }

        // Mettez à jour l'interface utilisateur en supprimant l'image visuelle de la galerie
        let photoToRemove = document.getElementById(`photo-${projectId}`);
        if (photoToRemove) {
          photoToRemove.remove();
          // Supprimez également la poubelle correspondante
          let trashIconToRemove = document.getElementById(`trash-${projectId}`);
          if (trashIconToRemove) {
            trashIconToRemove.remove();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }

    // Affichez le backdrop
    document.getElementById("modalBackdrop").style.display = "block"; // Montre le backdrop

    // Ouvrez la modal
    modal.style.display = "block";

    // Fermez la modal lorsque l'utilisateur clique sur le bouton "Fermer"
    let closeButton = document.createElement("span");
    closeButton.classList.add("modal-close");
    closeButton.innerHTML = "&times;"; // Ajoute la croix
    modal.appendChild(closeButton); // Ajoute le bouton de fermeture dans la modal

    // Ajouter un événement click pour fermer la modal
    closeButton.addEventListener("click", () => {
      closeModal();
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Fonction pour fermer la modal
function closeModal() {
  let modal = document.getElementById("myModal");
  let modalBackdrop = document.getElementById("modalBackdrop");

  modal.style.display = "none"; // Cache la modal
  modalBackdrop.style.display = "none"; // Cache le backdrop
}

// Fermez la modal lorsque l'utilisateur clique en dehors de la modal
window.addEventListener("click", (event) => {
  let modal = document.getElementById("myModal");
  let modalContent = modal.querySelector(".modal-content");
  let modalBackdrop = document.getElementById("modalBackdrop");

  // Vérifiez si l'élément cliqué est à l'intérieur de la modal
  if (!modalContent.contains(event.target) && event.target === modalBackdrop) {
    closeModal(); // Cache la modal
  }
});

/// Récupérez le bouton "Ajouter une photo"
let addButton = document.querySelector(".modal-button");

// Ajoutez un écouteur d'événements "click" au bouton "Ajouter une photo"
addButton.addEventListener("click", () => {
  let firstModal = document.getElementById("myModal");
  firstModal.style.display = "none"; // Cacher la première modal
  secondModal.style.display = "block"; // Afficher la seconde modal
});

// Fermez la deuxième modal lorsque l'utilisateur clique en dehors de la modal
window.addEventListener("click", (event) => {
  // Vérifiez si l'élément cliqué n'est pas à l'intérieur de la seconde modal
  if (!secondModal.contains(event.target) && event.target !== addButton) {
    secondModal.style.display = "none";
  }
});

// Ajouter la croix pour la seconde modal
let secondCloseButton = document.createElement("span");
secondCloseButton.classList.add("modal-close");
secondCloseButton.innerHTML = "&times;"; // Ajoute la croix
secondModal.appendChild(secondCloseButton); // Ajoute le bouton de fermeture dans la seconde modal

// Ajouter un événement click pour fermer la seconde modal
secondCloseButton.addEventListener("click", () => {
  secondModal.style.display = "none"; // Cache la seconde modal
  document.getElementById("modalBackdrop").style.display = "none"; // Cache également le backdrop
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
  // Cibler l'élément avec l'ID backButton
  let backButton = document.getElementById("backButton");

  // Ajouter un gestionnaire d'événements pour le clic sur l'élément backButton
  backButton.addEventListener("click", backToFirstModal);
  console.log("backButton :", backButton);
});

// Fonction pour revenir à la première modal
function backToFirstModal() {
  // Cacher la deuxième modal
  secondModal.style.display = "none";
  console.log("backToFirstModal");
  // Afficher la première modal
  let myModal = document.getElementById("myModal");
  console.log("myModal :", myModal);
  myModal.style.display = "block";
  console.log("myModal.style.display :", myModal.style.display);
}

// Récupérez les éléments à l'intérieur de la deuxième modal
let previewImg = secondModal.querySelector("img");
let inputFile = secondModal.querySelector("input[type='file']");
let labelFile = secondModal.querySelector("label[for='file']");
let iconfile = secondModal.querySelector(".fa-image");
let Pfile = secondModal.querySelector("p");
let submitButton = secondModal.querySelector(".modal-button2"); // Ajoutez cette ligne

// Ajoutez une classe CSS pour rendre le bouton grisâtre
submitButton.classList.add("disabled");

// Écoutez le changement de l'input file
inputFile.addEventListener("change", function () {
  const file = this.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      labelFile.style.display = "none";
      iconfile.style.display = "none";
      Pfile.style.display = "none";

      // Lorsque l'image est chargée, changez la classe CSS du bouton pour le rendre vert
      submitButton.classList.remove("disabled");
      submitButton.classList.add("enabled");
    };
    reader.readAsDataURL(file);
  }
});

// Récupère les catégories à partir de l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();
  return data;
}

// Fonction pour afficher les catégories dans le menu déroulant
async function displayCategoriesInDropdown() {
  const select = document.querySelector("#category");

  // Vide le menu déroulant avant de remplir les catégories
  select.innerHTML = "";

  // Récupère les catégories depuis l'API
  const categories = await getCategories();

  // Ajoute une option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "";
  select.appendChild(defaultOption);

  // Ajoute les catégories au menu déroulant
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// Attache un gestionnaire d'événements change à la liste déroulante des catégories
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#category").addEventListener("change", function () {
    // Vous pouvez ajouter ici le code pour utiliser la catégorie sélectionnée
    console.log("Catégorie sélectionnée :", this.value);
  });

  // Afficher les catégories lorsque la page est chargée
  displayCategoriesInDropdown();
});

// Ajouter projet avec un POST
const form = document.querySelector("#form");
console.log("form :", form);
const title = document.querySelector("#title");
const category = document.querySelector("#category");

// Ajoutez un gestionnaire d'événements pour le formulaire d'ajout d'image
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêchez le comportement par défaut du formulaire

  // Récupérez les informations du formulaire
  const file = document.querySelector('input[type="file"]').files[0];
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title.value);
  formData.append("category", category.value);

  try {
    // Récupérez le token depuis le localStorage
    const token = window.localStorage.getItem("token");
    if (!token) {
      throw new Error("Token non trouvé dans le localStorage");
    }

    // Envoyez une requête POST à l'API pour ajouter une nouvelle image
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Vérifiez si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
    }

    // Récupérez les données de la réponse (nouvelle image ajoutée)
    const newData = await response.json();

    // Mettez à jour les données dans votre application en ajoutant la nouvelle image
    data.push(newData);
    displayProjects();

    console.log("Photo ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout d'image :", error);
  }
});
