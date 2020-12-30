//////////////////////////////////// FUNCTION ////////////////////////////////////

const addProduct = (response) => {
  for (let i in response) {
    // Création de l'élément card
    const newElt = document.createElement("div");
    newElt.classList.add("card");
    let elt = document.getElementById("container");

    // Création de l'image de la carte
    const newImg = document.createElement("img");
    newImg.setAttribute("src", response[i].imageUrl);
    newImg.setAttribute("alt", "Card image cap");
    newImg.classList.add("card-img-top", "img-fluid");

    // Création body card
    const newBody = document.createElement("div");
    newBody.classList.add("card-body");

    // Création du titre de la carte
    const newTitle = document.createElement("h5");
    newTitle.classList.add("card-title");
    newTitle.textContent = response[i].name;

    // Création du prix
    const newPrice = document.createElement("p");
    newPrice.classList.add(
      "card-text",
      "price",
      "font-weight-bold",
      "p-1",
      "pl-3"
    );
    newPrice.textContent = response[i].price / 100 + "€";

    //création de la description
    const newDescription = document.createElement("p");
    newDescription.classList.add("card-text");
    newDescription.textContent = response[i].description;

    // Création du lien
    const newLink = document.createElement("a");
    newLink.setAttribute("href", "produit.html?id=" + response[i]._id);
    newLink.classList.add("lien", "w-100", "h-100", "position-absolute");

    elt.appendChild(newElt);
    newElt.appendChild(newImg);
    newElt.appendChild(newBody);
    newBody.appendChild(newTitle);
    newBody.appendChild(newPrice);
    newBody.appendChild(newDescription);
    newElt.appendChild(newLink);
  }
};
// Requête vers API
const resp = () => {
  fetch("http://localhost:3000/api/teddies")
    .then((response) => response.json())
    .then((response) => addProduct(response))
    .catch((err) => console.log("err"));
};

///////////////////// SCRIPT /////////////////////
resp();
