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

document.addEventListener("DOMContentLoaded", (event) => {
  // Récupérez le bouton "Modifier"
  let button = document.getElementById("buttonModifier");

  // Ajoutez un écouteur d'événements au bouton pour appeler la fonction openModal lorsqu'il est cliqué
  button.addEventListener("click", () => {
    // Récupérez le token du localStorage
    let token = window.localStorage.getItem("token");

    // Vérifiez si le token est présent
    if (token) {
      openModal(token); // Passer le token en tant que paramètre
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
    // Récupérez les photos de l'API
    let response = await fetch("http://localhost:5678/api/works", {
      headers: {
        Authorization: `Bearer ${token}`, // Utiliser le token passé en paramètre
      },
    });

    let data = await response.json();
    console.log(data);

    // Récupérez la modal et le conteneur de contenu de la modal
    let modal = document.getElementById("myModal");
    let modalContent = modal.querySelector(".modal-content");

    // Créez l'élément black-square
    let blackSquare = document.createElement("div");
    blackSquare.classList.add("black-square");

    // Ajoutez l'élément black-square au conteneur de contenu de la modal
    modalContent.appendChild(blackSquare);

    // Videz le contenu de la modal avant d'ajouter de nouvelles images
    modalContent.innerHTML = "";

    // Ajoutez les photos à la modal
    data.forEach((photo, index) => {
      let img = document.createElement("img");
      img.src = photo.imageUrl; // Utilisation de l'URL de l'image comme identifiant unique
      img.id = `photo-${photo.imageUrl}`; // ID unique pour chaque photo basé sur l'URL de l'image
      modalContent.appendChild(img);

      // Créez la poubelle correspondante pour cette photo
      let trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can");
      trashIcon.id = `trash-${photo.imageUrl}`; // ID unique pour chaque poubelle basé sur l'URL de l'image
      trashIcon.setAttribute("data-photo-id", `photo-${photo.imageUrl}`); // Attribut de données pour lier à la photo
      modalContent.appendChild(trashIcon);

      // Ajoutez un gestionnaire d'événements pour la poubelle
      trashIcon.addEventListener("click", async function () {
        // Obtenez l'ID de la photo correspondante
        let photoId = this.getAttribute("data-photo-id");
        // Supprimez la photo correspondante
        async function deleteProject(projectId) {
          try {
            let headers = {
              Authorization: "Bearer " + token,
            };
            console.log(headers);
            let response = await fetch(
              `http://localhost:5678/api/works/${projectId}`,
              {
                method: "DELETE",
                headers: headers,
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            } else {
              console.log(`Le projet ${projectId} a été supprimé avec succès.`);
            }
          } catch (error) {
            console.error("Erreur:", error);
          }
        }
        let photoToRemove = document.getElementById(photoId);
        if (photoToRemove) {
          photoToRemove.remove();
          // Supprimez également la poubelle correspondante
          this.remove();
          // Supprimez le projet dans la gallerie principale
          let projectId = photo.id; // Utilisez l'ID du projet à partir de l'objet photo
          await deleteProject(projectId);
        }
      });
    });

    // Ouvrez la modal
    modal.style.display = "block";

    // Fermez la modal lorsque l'utilisateur clique sur le bouton "Fermer"
    let closeButton = document.querySelector(".modal-close");
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Fermez la modal lorsque l'utilisateur clique en dehors de la modal
window.addEventListener("click", (event) => {
  let modal = document.getElementById("myModal");
  let modalContent = modal.querySelector(".modal-content");

  // Vérifiez si l'élément cliqué est à l'intérieur de la modal
  if (!modalContent.contains(event.target)) {
    modal.style.display = "none";
  }
});

// Récupérez le bouton "Ajouter une photo"
let addButton = document.querySelector(".modal-button");

// Récupérez la deuxième modal
let secondModal = document.getElementById("secondModal");

// Ajoutez un écouteur d'événements "click" au bouton "Ajouter une photo"
addButton.addEventListener("click", () => {
  // Affichez la deuxième modal
  secondModal.style.display = "block";
});

// Fermez la deuxième modal lorsque l'utilisateur clique en dehors de la modal
window.addEventListener("click", (event) => {
  // Vérifiez si l'élément cliqué est la deuxième modal
  if (event.target === secondModal) {
    secondModal.style.display = "none";
  }
});

// Récupérez les éléments à l'intérieur de la deuxième modal
let previewImg = secondModal.querySelector("img");
let inputFile = secondModal.querySelector("input[type='file']");
let labelFile = secondModal.querySelector("label[for='file']");
let iconfile = secondModal.querySelector(".fa-image");
let Pfile = secondModal.querySelector("p");

// Écoutez le changement de l'input file
inputFile.addEventListener("change", function (e) {
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = document.querySelector('input[type="file"]').files[0];

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title.value);
  formData.append("category", category.value);
  console.log("formData :", formData);

  try {
    const token = window.localStorage.getItem("token");
    if (!token) {
      throw new Error("Token non trouvé dans le localStorage");
    }

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log(response); // Correction de la ligne
    const data = await response.json();
    console.log(data);
    console.log("Photo ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur:", error);
  }
  displayProjects();
});

// Fonction pour supprimer une image avec son ID

async function test() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const projects = await reponse.json();

  // Obtenez la modal par son id
  let myModal = document.getElementById("myModal");

  // Parcourez chaque projet
  for (let project of projects) {
    // Créez l'élément icône de la poubelle
    let trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    trashIcon.id = `delete-${project.id}`;

    // Ajoutez un écouteur d'événements click à l'icône de la poubelle
    trashIcon.addEventListener("click", function () {
      deleteImage(project.id);
    });

    // Ajoutez l'icône de la poubelle à la modal
    myModal.appendChild(trashIcon);
  }
}
