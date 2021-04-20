window.addEventListener("DOMContentLoaded", (event) => {
  const navList = document.querySelector(".nav__list");
  const menuIcon = document.querySelector(".menu_icon");
  const closeItem = document.querySelector(".nav__link");

  if (menuIcon) {
    menuIcon.addEventListener("click", (event) => {
      event.preventDefault();
      navList.classList.toggle("close");
      closeItem.focus();
    });
  }

  if (closeItem) {
    closeItem.addEventListener("click", (event) => {
      event.preventDefault();
      navList.classList.toggle("close");
      menuIcon.focus();
    });
  }

  const popup = document.querySelector(".popup");
  const popupWrapper = document.querySelector(".popup");
  const popupForm = document.querySelector(".popup__form");
  popupForm.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  popupWrapper.addEventListener("click", () => {
    popup.classList.toggle("open");
    document.body.classList.toggle("popuped");
  });
});


function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const source = window.formSource;
  const formData = new FormData(form);
  const name = formData.get("name");
  const phone = formData.get("phone");
  fetch("send.php", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
      }),
    })
    .then()
    .catch();
}


function openPopup(event) {
  const source = event.target.dataset.source;
  const popup = document.querySelector(".popup");
  document.body.classList.toggle("popuped");
  popup.classList.toggle("open");
  window.formSource = source;
}