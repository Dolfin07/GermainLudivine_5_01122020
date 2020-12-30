const confirmation = () => {
  const price = document.getElementById("prix");
  const idOrder = document.getElementById("idOrder");

  idOrder.textContent = localStorage.getItem("OrderConfirmation");
  price.textContent = localStorage.getItem("totalPrice");
};

const viderLocalStorage = () => {
  window.addEventListener("beforeunload", () => {
    localStorage.clear(); // vide le localStorage lorsqu'on quitte la page
  });
};

////////////////////////////////////////// SCRIPT ///////////////////////////////////////
confirmation();
viderLocalStorage();
