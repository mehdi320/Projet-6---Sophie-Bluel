async function test() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const project = await reponse.json();
  console.log(project);
}
test();

async function displayProjects(category) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const projects = await response.json();

    // Filtrer les projets en fonction de la catégorie sélectionnée
    const filteredProjects =
      category === "Tous"
        ? projects
        : projects.filter((project) => project.category.name === category);

    filteredProjects.forEach((project) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = project.imageUrl;
      img.alt = project.title;
      figcaption.textContent = project.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

// Appeler la fonction pour afficher les projets après le chargement de la page
displayProjects();

// Fonction pour créer les filtres
function createFilters(categories) {
  // Ajouter la catégorie "Tous"
  const allCategory = { name: "Tous" };
  categories.unshift(allCategory);

  // Création du conteneur de filtres
  const filtersContainer = createFiltersContainer();

  // Créer et ajouter les boutons de filtre pour chaque catégorie
  categories.forEach((category) => {
    const filterButton = createFilterButton(category);

    // Ajouter un gestionnaire d'événements pour chaque bouton de filtre
    filterButton.addEventListener("click", () => {
      // Désélectionner tous les autres boutons et afficher les projets correspondants à la catégorie
      clearAndSelectFilter(filtersContainer, filterButton);
      displayProjects(category.name);
    });

    filtersContainer.appendChild(filterButton);
  });

  // Récupérer la section des filtres dans le DOM
  const filtersSection = document.getElementById("filters-container");

  // Effacer et ajouter le conteneur de filtres à la section "Filters" de la page
  clearAndAppend(filtersSection, filtersContainer);

  // Sélectionner le bouton "Tous" par défaut et afficher les projets correspondants à la catégorie "Tous"
  selectDefaultFilter(filtersContainer);
}

// Fonction pour créer le conteneur de filtres
function createFiltersContainer() {
  const filtersContainer = document.createElement("div");
  filtersContainer.id = "filters-container";
  filtersContainer.classList.add("filters-container");
  return filtersContainer;
}

// Fonction pour créer un bouton de filtre
function createFilterButton(category) {
  const filterButton = document.createElement("button");
  filterButton.classList.add("filters");

  // Créer un élément texte (<span>) avec le nom de la catégorie
  const buttonText = createSpan(category.name);

  // Ajouter un gestionnaire d'événements pour le clic sur le bouton de filtre
  filterButton.addEventListener("click", () => {
    // Désélectionner tous les autres boutons et afficher les projets correspondants à la catégorie
    clearAndSelectFilter(filtersContainer, filterButton);
    displayProjects(category.name);
  });

  // Ajouter l'élément texte au bouton de filtre
  filterButton.appendChild(buttonText);

  return filterButton;
}

// Fonction pour créer un élément texte (<span>)
function createSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

// Fonction pour désélectionner tous les autres boutons et sélectionner le bouton donné
function clearAndSelectFilter(container, selectedButton) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.remove("selected");
  });

  selectedButton.classList.add("selected");
}

// Fonction pour effacer et ajouter un élément enfant à un parent
function clearAndAppend(parent, child) {
  parent.innerHTML = "";
  parent.appendChild(child);
}

// Fonction pour sélectionner le bouton "Tous" par défaut et afficher les projets correspondants à la catégorie "Tous"
function selectDefaultFilter(filtersContainer) {
  const tousButton = filtersContainer.querySelector("button");
  if (tousButton) {
    tousButton.classList.add("selected");
  }
  displayProjects("Tous");
}

function updateFiltersVisibility() {
  const loggedIn = window.localStorage.getItem("loggedIn") === "true";
  const filtersSection = document.getElementById("Filters");

  if (loggedIn) {
    filtersSection.style.display = "none";
  } else {
    filtersSection.style.display = "block";
  }
}

// Appelez cette fonction au chargement de la page pour initialiser la visibilité des filtres
updateFiltersVisibility();

function updateModifierWord() {
  const loggedIn = window.localStorage.getItem("loggedIn") === "true";
  const iconeModifier = document.querySelector("#modifier-container i");

  if (loggedIn) {
    ajouterMotModifier();
    console.log("Le mot cliquable 'Modifier' a été ajouté avec succès.");

    if (iconeModifier) {
      iconeModifier.style.display = "inline-block";
    }
  } else {
    removeModifierWord();

    if (iconeModifier) {
      iconeModifier.style.display = "none";
    }
  }

  // Mettez à jour la visibilité des filtres
  updateFiltersVisibility();
}

(async () => {
  const categoriesResponse = await fetch(
    "http://localhost:5678/api/categories"
  );
  const categories = await categoriesResponse.json();
  createFilters(categories);
})();

function toggleBlackBar() {
  const loggedIn = window.localStorage.getItem("loggedIn") === "true";
  const blackBar = document.getElementById("black-bar");

  if (loggedIn) {
    blackBar.style.display = "block";
  } else {
    blackBar.style.display = "none";
  }
}

// Appel initial pour mettre à jour l'état de la barre noire au chargement de la page
toggleBlackBar();
document.addEventListener("DOMContentLoaded", (event) => {
  // Sélectionnez l'élément où vous voulez ajouter le bouton
  let container = document.getElementById("modifier-container");

  // Vérifiez si l'élément existe
  if (container) {
    // Créez le bouton
    let button = document.createElement("button");
    button.innerHTML = "Modifier";

    // Ajoutez l'ID "buttonModifier" au bouton pour appliquer le style CSS
    button.id = "buttonModifier";

    // Ajoutez le bouton à l'élément sélectionné
    container.appendChild(button);

    // Vérifiez si le token est présent dans le localStorage
    let token = window.localStorage.getItem("token");

    // Si le token est présent, affichez le conteneur
    if (token) {
      container.style.display = "block";
      console.log("Le conteneur 'modifier-container' est visible.");
    } else {
      // Si le token n'est pas présent, cachez le conteneur
      container.style.display = "none";
      console.log("Le conteneur 'modifier-container' a été caché avec succès.");
    }

    // Ajoutez un écouteur d'événements au bouton pour appeler la fonction openModal lorsqu'il est cliqué
    button.addEventListener("click", openModal);
  }
});

document.addEventListener("DOMContentLoaded", (event) => {
  // Sélectionnez le bouton "Modifier"
  let button = document.getElementById("buttonModifier");
});

//ouverture de la modal au clique sur le bouton modifier
async function openModal() {
  // Récupérer le token du localStorage
  const token = window.localStorage.getItem("token");

  // Vérifier si le token est présent
  if (token) {
    // Récupérer le modal
    let modal = document.getElementById("myModal");

    // Afficher le modal
    modal.style.display = "block";
  }
}
