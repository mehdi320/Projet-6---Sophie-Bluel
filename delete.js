document.addEventListener("DOMContentLoaded", function () {
  // Votre code ici
  let trashIcons = document.querySelectorAll(".fa-trash-can");

  console.log(`Found ${trashIcons.length} trash icons`); // Ajout d'une déclaration console.log

  trashIcons.forEach((trashIcon) => {
    console.log(`Adding click event to trash icon with id: ${trashIcon.id}`); // Ajout d'une déclaration console.log

    trashIcon.addEventListener("click", async function (event) {
      // Empêcher la propagation de l'événement pour éviter la fermeture de la modal
      event.stopPropagation();

      let clickedIcon = event.target;
      let index = clickedIcon.id.split("-")[1]; // Récupérer l'index à partir de l'ID de l'icône de corbeille
      console.log(`Deleting photo at index: ${index}`);
      event.preventDefault();
      await deletePhoto(index);
    });
  });

  async function deletePhoto(index) {
    try {
      // Supprimer l'image de la galerie principale
      let galleryImg = document.getElementById(`gallery-photo-${index}`);
      if (galleryImg) {
        galleryImg.remove();
      }

      // Supprimer l'image et son icône de corbeille de la modal
      let modalImg = document.getElementById(`photo-${index}`);
      let modalTrashIcon = document.getElementById(`trash-${index}`);
      if (modalImg && modalTrashIcon) {
        modalImg.remove();
        modalTrashIcon.remove();
      }

      // Mettre à jour les données persistantes en supprimant l'élément correspondant
      data.splice(index, 1);

      // Sauvegarder les données mises à jour dans le stockage local ou sur le serveur, selon votre application
      // Exemple : localStorage.setItem('data', JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
});
