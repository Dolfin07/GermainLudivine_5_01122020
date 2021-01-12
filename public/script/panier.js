////////////////////////////////// FUNCTION ////////////////////////////////////////////////
const basket = JSON.parse(localStorage.getItem("basketContent"));

// Création message "panier vide"
const emptyBasket = () => {
  const tableBodyElt = document.getElementById("tbody");
  const newTr = document.createElement("tr");
  tableBodyElt.appendChild(newTr);
  const newTdInfo = document.createElement("td");
  newTdInfo.setAttribute("colspan", 3);
  newTdInfo.textContent = "Votre panier est vide";
  newTr.appendChild(newTdInfo);
};

//  Création des lignes du panier
const createBasket = (localstorage) => {
  const tableBodyElt = document.getElementById("tbody");
  let somme = 0;
  Object.keys(basket).forEach((item) => {
    //// Création du tr
    const newTr = document.createElement("tr");
    tableBodyElt.appendChild(newTr);
    //// Création du td image
    const image = basket[item].imageUrl;
    const newTdImage = document.createElement("img");
    newTdImage.innerHTML = basket[item].imageUrl;
    newTdImage.setAttribute("width", "15%");
    newTdImage.setAttribute("src", basket[item].imageUrl);
    newTr.appendChild(newTdImage);
    //// Création du td Nom
    const name = basket[item].name;
    const newTdName = document.createElement("td");
    newTdName.textContent = name;
    newTdName.setAttribute("class", "align-middle");
    newTr.appendChild(newTdName);
    //// Création du td Quantité
    const quantity = basket[item].quantity;
    const newTdNumber = document.createElement("td");
    newTdNumber.textContent = quantity;
    newTdNumber.setAttribute("class", "align-middle");
    newTr.appendChild(newTdNumber);
    //// Création du td Prix
    const price = basket[item].price;
    const newTdPrice = document.createElement("td");
    newTdPrice.textContent = price / 100 + "€";
    newTdPrice.setAttribute("class", "align-middle");
    newTr.appendChild(newTdPrice);
    //// Création du bouton supprimer
    const idElement = basket[item]._id;
    const newTdSup = document.createElement("button");
    newTdSup.innerHTML = "Supprimer";
    newTdSup.setAttribute("class", "btn btn-primary supprimer p-2");
    newTdSup.setAttribute("data-id", basket[item].id);
    newTr.appendChild(newTdSup);
    // Suppression d'un élément du panier
    newTdSup.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id"); // on récupère l'id correspondant au bouton
      for (let i = 0; i < basket.length; i++) {
        // on compare cet id à tous les id du panier
        if (basket[i].id === id) {
          basket.splice(i, 1);
        }
      }
      localstorage.setItem("basketContent", JSON.stringify(basket)); // on met à jour le panier
      location.reload(); // on recharge la page
    });
    //// Prix total
    const total = document.getElementById("prixTotal");
    somme += (price * quantity) / 100;
    total.textContent = somme + "€";
  });
};

// Remplissage panier
const modifyBasket = () => {
  //// Si localStorage est vide
  if (localStorage.length === 0) {
    emptyBasket();
  } else {
    //// Si localStorage contient des éléments
    createBasket(localStorage);
  }

  // Vider le panier
  const empty = document.getElementById("emptyBasket");
  empty.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
};

// Validation du formulaire
const validation = (e) => {
  e.preventDefault();
  let erreur;
  let inputs = document.forms["form"];
  const rgxMail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}.[a-z]{2,4}/;
  const rgxIdentite = /^[a-zA-Zàäâçéèëêïîôöùû\- ']{2,}$/;
  const rgxAdresse = /^[a-zA-Zàäâçéèëêïîôöùû0-9- ']{2,}$/;

  ////Validation adresse mail
  if (!rgxMail.test(inputs["mail"].value)) {
    erreur = "Adresse email incorrecte";
  }
  ////Validation nom et prénom
  if (
    !rgxIdentite.test(inputs["prenom"].value) ||
    !rgxIdentite.test(inputs["nom"].value)
  ) {
    erreur =
      "Les noms et prénoms ne doivent contenir que des lettres en majuscule ou minuscules(minimum 2 lettres), des espaces et des tirets.";
  }
  ////Validation adresse et ville
  if (
    !rgxAdresse.test(inputs["adresse"].value) ||
    !rgxAdresse.test(inputs["ville"].value)
  ) {
    erreur =
      "L'adresse et la ville ne doivent contenir que des chiffres, espaces, tirets  ou des lettres en majuscule ou minuscules";
  }
  for (let i = 0; i < inputs.length; i++) {
    //// Validation champ requis
    if (!inputs[i].value) {
      erreur = "Veuillez renseigner tous les champs";
    }
    //// Validation nombre de caractères max
    if (inputs[i].value.length > 150) {
      erreur = "Veuillez ne pas dépasser 150 caractères";
    }
    return erreur;
  }
};

// Création objet à envoyer
const postObject = () => {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const adresse = document.getElementById("adresse").value;
  const ville = document.getElementById("ville").value;
  const mail = document.getElementById("mail").value;

  ////Création objet contact
  const contacts = {
    firstName: nom,
    lastName: prenom,
    address: adresse,
    city: ville,
    email: mail,
  };

  //// Création d'un tableau products
  const product = [];
  Object.keys(basket).forEach((item) => {
    const idProduct = basket[item].id;
    product.push(idProduct);
  });

  //// Création de l'objet Js à envoyer (contient contact + products)
  const commande = {
    contact: contacts,
    products: product,
  };
  return commande;
};

// Requête pour envoyer les info de commandes au serveur
const postRequest = (url, jsonBody) => {
  const options = {
    method: "POST",
    body: JSON.stringify(jsonBody),
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(url, options);
};

/////////////////////////////////////SCRIPT ///////////////////////////////////////////////

// Remplissage du panier à l'ouverture de la page
modifyBasket();

// Valider le panier et envoyer l'objet à l'API

const valid = document.getElementById("form");
valid.addEventListener("submit", (e) => {
  const erreur = validation(e);
  if (erreur) {
    document.getElementById("erreur").innerHTML = erreur;
  } else {
    const commande = postObject();
    //// POST de l'objet en format json
    postRequest("http://localhost:3000/api/teddies/order", commande)
      .then((response) => response.json())
      .then((response) => {
        localStorage.clear();
        localStorage.setItem("OrderConfirmation", response.orderId);
        localStorage.setItem(
          "totalPrice",
          document.getElementById("prixTotal").textContent
        );
        location.href = "confirmation_commande.html";
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
