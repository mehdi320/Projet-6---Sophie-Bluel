// Récupération du token depuis le localStorage
let token = window.localStorage.getItem("token");

if (!token) {
  console.warn(
    "Token absent dans le localStorage. Certaines fonctionnalités ne seront pas disponibles."
  );
} else {
  console.log("Token récupéré :", token);
  try {
    // Ajoute ici les fonctionnalités nécessitant un token
    // Exemple : initialisation d'une modal ou autre logique
  } catch (error) {
    console.error("Erreur lors de l'utilisation du token :", error);
  }
}

//Ajouter le token en dehors d'un bloc de code pour qu'il soit accessible dans toute la page
document.addEventListener("DOMContentLoaded", function () {
  // Récupère les éléments du DOM
  let firstModal = document.getElementById("myModal");
  let button = document.getElementById("buttonModifier");

  // Vérifie si les éléments existent avant d'essayer de les manipuler
  if (firstModal) {
    firstModal.style.display = "none"; // Cache la première modal au chargement de la page
  }

  if (button) {
    // Ajoute un écouteur d'événements au bouton pour ouvrir la modal
    button.addEventListener("click", async () => {
      // Récupère le token du localStorage
      let token = window.localStorage.getItem("token");

      // Vérifie si le token est présent
      if (token) {
        // Appeler la fonction openModal avec le token récupéré
        await openModal(token);
      } else {
        console.error(
          "Token non défini. L'utilisateur doit être connecté pour accéder à cette fonctionnalité."
        );
        // Vous pouvez rediriger vers la page de connexion ici si nécessaire
      }
    });
  }
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

// Fonction principale pour gérer les clics sur les modals
function handleModalClick() {
  // Vérifie d'abord si on est sur la page login
  if (window.location.pathname === "/login") {
    // On ne fait rien si on est sur la page login (pas de gestion de la modal ici)
    return;
  }

  // Si on n'est pas sur la page login, on ajoute l'événement pour les clics
  window.addEventListener("click", (event) => {
    // Vérifie si la modal 'myModal' existe dans le DOM
    let modal = document.getElementById("myModal");
    if (modal) {
      let modalContent = modal.querySelector(".modal-content");
      let modalBackdrop = document.getElementById("modalBackdrop");

      // Vérifie si modalContent et modalBackdrop existent avant de procéder
      if (modalContent && modalBackdrop) {
        // Si on clique en dehors de la modal et sur l'arrière-plan, on ferme la modal
        if (
          !modalContent.contains(event.target) &&
          event.target === modalBackdrop
        ) {
          closeModal(); // Cache la modal
        }
      } else {
        console.error("Modal content ou modalBackdrop non trouvé.");
      }
    } else {
      console.log("Aucune modal 'myModal' trouvée, pas de gestion à faire.");
    }

    // Vérifie également si la modal 'secondModal' existe
    let secondModal = document.getElementById("secondModal");
    if (secondModal) {
      let modalBackdrop = document.getElementById("modalBackdrop");

      // Si le bouton 'addButton' existe, on peut gérer les clics
      let addButton = document.getElementById("addButton");
      if (addButton) {
        // Gérer le clic sur 'addButton' ici
        addButton.addEventListener("click", () => {
          if (secondModal.style.display === "none") {
            secondModal.style.display = "block"; // Afficher la seconde modal
          } else {
            secondModal.style.display = "none"; // Cacher la seconde modal
          }
        });
      } else {
        console.log("Le bouton 'addButton' n'est pas présent sur cette page.");
      }
    } else {
      console.log("Aucune modal 'secondModal' trouvée.");
    }
  });
}

// Appeler la fonction pour gérer l'événement de clic
handleModalClick();

// Attendre que le DOM soit complètement chargé avant d'ajouter les écouteurs pour le bouton 'addButton'
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier d'abord si on est sur la page login
  if (window.location.pathname === "/login") {
    return; // On ne fait rien si on est sur la page login
  }

  // Vérifier si le bouton 'addButton' existe
  let addButton = document.getElementById("addButton");

  if (addButton) {
    addButton.addEventListener("click", () => {
      const firstModal = document.getElementById("myModal");
      const secondModal = document.getElementById("secondModal");

      // Vérifier si les deux modals existent
      if (firstModal && secondModal) {
        firstModal.style.display = "none"; // Cacher la première modal
        secondModal.style.display = "block"; // Afficher la seconde modal
      } else {
        console.error("Une ou les deux modals n'ont pas été trouvées.");
      }
    });
  } else {
    console.log(
      "Le bouton 'Ajouter une photo' n'est pas présent sur cette page."
    );
  }
});

// Fermer la deuxième modal lorsque l'utilisateur clique en dehors de la modal
window.addEventListener("click", (event) => {
  // Vérifier si on n'est pas sur la page login
  if (window.location.pathname !== "/login") {
    let secondModal = document.getElementById("secondModal");
    let addButton = document.getElementById("addButton");

    // Vérifier si secondModal et addButton existent avant de manipuler leur affichage
    if (secondModal && addButton) {
      // Vérifier si l'élément cliqué n'est pas à l'intérieur de la seconde modal
      if (!secondModal.contains(event.target) && event.target !== addButton) {
        secondModal.style.display = "none"; // Fermer la deuxième modal
      }
    } else {
      // Afficher une erreur si l'un des éléments est manquant
      if (!secondModal) {
        console.error("Second modal 'secondModal' non trouvé dans le DOM.");
      }
      if (!addButton) {
        console.error("'addButton' non trouvé dans le DOM.");
      }
    }
  }
});

// Ajouter la croix pour la seconde modal
let secondCloseButton = document.createElement("span");
secondCloseButton.classList.add("modal-close");
secondCloseButton.innerHTML = "&times;"; // Ajoute la croix

// Vérifie si la seconde modal existe dans le DOM
let secondModal = document.getElementById("secondModal"); // Remplace par l'ID correct de ta seconde modal

if (secondModal) {
  // Si la modal existe, on ajoute le bouton de fermeture
  secondModal.appendChild(secondCloseButton); // Ajoute le bouton de fermeture dans la seconde modal
} else {
  console.warn("secondModal n'est pas encore disponible dans le DOM.");
}

// Ajouter un événement click pour fermer la seconde modal
secondCloseButton.addEventListener("click", () => {
  secondModal.style.display = "none"; // Cache la seconde modal
  document.getElementById("modalBackdrop").style.display = "none"; // Cache également le backdrop
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");

  // Vérifie si on est sur la page où l'élément backButton existe
  if (document.getElementById("backButton")) {
    let backButton = document.getElementById("backButton");
    backButton.addEventListener("click", backToFirstModal);
    console.log("backButton ajouté :", backButton);
  } else {
    console.log("backButton non trouvé sur cette page.");
  }
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

// Observer pour détecter l'ajout de secondModal dans le DOM
const observer = new MutationObserver((mutationsList, observer) => {
  // Vérifier si la modal a été ajoutée au DOM
  let secondModal = document.getElementById("secondModal");

  if (secondModal) {
    // Si la modal est trouvée, on peut récupérer les éléments
    let previewImg = secondModal.querySelector("img");
    let inputFile = secondModal.querySelector("input[type='file']");
    let labelFile = secondModal.querySelector("label[for='file']");
    let iconfile = secondModal.querySelector(".fa-image");
    let Pfile = secondModal.querySelector("p");
    let submitButton = secondModal.querySelector(".modal-button2");

    // Vérifier si inputFile existe avant de manipuler l'input file
    if (inputFile) {
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
    }

    // Une fois la modal trouvée et manipulée, on arrête l'observation
    observer.disconnect();
  }
});

// Configuration de l'observateur pour détecter les ajouts d'éléments dans le DOM
observer.observe(document.body, { childList: true, subtree: true });

// Récupère les catégories à partir de l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();
  return data;
}

async function displayCategoriesInDropdown() {
  const select = document.querySelector("#category");

  // Vérifie si l'élément #category existe avant de manipuler son contenu
  if (!select) {
    console.log("#category n'existe pas sur cette page.");
    return; // Arrêt de la fonction si #category n'est pas trouvé
  }

  // Vide le menu déroulant avant de remplir les catégories
  select.innerHTML = "";

  // Récupère les catégories depuis l'API
  try {
    const categories = await getCategories(); // Assure-toi que cette fonction est définie et fonctionne correctement

    // Ajoute une option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Sélectionner une catégorie";
    select.appendChild(defaultOption);

    // Ajoute les catégories au menu déroulant
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (error) {
    // Si la récupération des catégories échoue, on capture l'erreur
    console.error("Erreur lors de la récupération des catégories:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Vérifier que l'élément #category existe sur la page
  const category = document.querySelector("#category");
  if (category) {
    displayCategoriesInDropdown();
    category.addEventListener("change", function () {
      console.log("Catégorie sélectionnée :", this.value);
    });
  } else {
    console.log("#category n'existe pas sur cette page.");
  }
});

// Ajouter projet avec un POST
const form = document.querySelector("#form");
console.log("form :", form);
const title = document.querySelector("#title");
const category = document.querySelector("#category");

document.addEventListener("DOMContentLoaded", () => {
  // Sélectionner les éléments des deux modals
  const myModal = document.querySelector("#myModal");
  const secondModal = document.querySelector("#secondModal");

  // Sélectionner le bouton "Ajouter une photo" dans la première modal
  const addPhotoButton = document.querySelector(".modal-button");

  // Sélectionner le bouton pour fermer la première modal
  const closeModalButton = document.querySelector(".modal-close");

  // Sélectionner le bouton pour fermer la seconde modal
  const closeSecondModalButton = document.querySelector("#secondcloseModal");

  // Sélectionner le bouton "Retour" dans la seconde modal
  const backButton = document.querySelector("#backButton");

  // Afficher la seconde modal quand l'utilisateur clique sur "Ajouter une photo"
  if (addPhotoButton) {
    addPhotoButton.addEventListener("click", () => {
      myModal.style.display = "none"; // Fermer la première modal
      secondModal.style.display = "block"; // Ouvrir la seconde modal
    });
  }

  // Fermer la première modal quand l'utilisateur clique sur "X"
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      myModal.style.display = "none"; // Fermer la première modal
    });
  }

  // Fermer la seconde modal
  if (closeSecondModalButton) {
    closeSecondModalButton.addEventListener("click", () => {
      secondModal.style.display = "none"; // Fermer la seconde modal
    });
  }

  // Retourner à la première modal quand l'utilisateur clique sur "Retour"
  if (backButton) {
    backButton.addEventListener("click", () => {
      secondModal.style.display = "none"; // Fermer la seconde modal
      myModal.style.display = "block"; // Ouvrir la première modal
    });
  }

  // Logique pour gérer la soumission du formulaire de la seconde modal
  const form = document.querySelector("#form");
  const fileInput = document.querySelector("#file");
  const titleInput = document.querySelector("#title");
  const categoryInput = document.querySelector("#category");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut

    const file = fileInput?.files[0]; // Le fichier sélectionné
    const title = titleInput?.value; // Le titre de l'image
    const category = categoryInput?.value; // La catégorie de l'image

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trouvé dans le localStorage");
      }

      // Requête pour ajouter la photo via l'API
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const newData = await response.json();
      console.log("Photo ajoutée avec succès !", newData);
      // Ici, tu peux appeler une fonction pour mettre à jour l'affichage des photos
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'image :", error);
    }
  });
});
