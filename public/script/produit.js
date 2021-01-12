///////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////
// Création de la fiche produit
const generateCardProduct = (response) => {
  //// Ajout du titre
  const title = document.getElementById("titre");
  title.textContent = response.name;

  //// Ajout de la description
  const description = document.getElementById("description");
  description.textContent = response.description;

  //// Création du prix
  const price = document.getElementById("price");
  price.textContent = response.price / 100 + "€";

  //// Création liste déroulante
  const coloris = document.getElementById("color");
  response.colors.forEach((valeur) => {
    options = document.createElement("OPTION");
    options.appendChild(document.createTextNode(valeur));
    options.value = valeur;
    coloris.appendChild(options);
  });

  //// Création de l'image
  const container = document.getElementById("container");
  const newImg = document.createElement("img");
  newImg.setAttribute("src", response.imageUrl);
  newImg.setAttribute("alt", "");
  newImg.classList.add("img-fluid");
  container.appendChild(newImg);
};

// Remplissage ou mise à jour du LocalStorage
const fillLocalStorage = (resp, idProduct) => {
  const quantity = document.getElementById("quantity").value;
  const newAddBasket = {
    id: idProduct,
    name: resp.name,
    quantity: quantity,
    price: resp.price,
    imageUrl: resp.imageUrl,
  };
  //// Si panier inexistant => création d'un tableau vide ds localStorage
  let basket = JSON.parse(localStorage.getItem("basketContent"));
  if (basket == null) {
    basket = [];
  }
  //// Si un produit similaire est déjà dans le panier => on modifie la quantité
  let idExistsInBasket = false;
  Object.keys(basket).forEach((item) => {
    let itemId = basket[item].id;
    if (itemId === newAddBasket.id) {
      idExistsInBasket = true;
      let itemQuantity = basket[item].quantity;
      let newItemQuantity =
        parseInt(itemQuantity) + parseInt(newAddBasket.quantity);
      basket[item].quantity = newItemQuantity;
    }
  });
  if (!idExistsInBasket) {
    //// ajoute une ligne au panier
    basket.push(newAddBasket);
  }
  localStorage.setItem("basketContent", JSON.stringify(basket));
};

// Requête
const resp = () => {
  // récupération de l'id ds url
  const search = location.search;
  const searchSplit = search.split("=");
  const idProduct = searchSplit[1];
  fetch("http://localhost:3000/api/teddies/" + idProduct)
    .then((response) => response.json())
    .then((response) => {
      //// Création de la fiche en Js
      generateCardProduct(response);
      //// Stockage des info dans localStorage
      const button = document.getElementById("btn");
      button.addEventListener("click", () =>
        fillLocalStorage(response, idProduct)
      );
    })
    .catch((err) => console.log("err"));
};
////////////////////////////////////////////////////// SCRYPT ///////////////////////////////////////////
resp();
