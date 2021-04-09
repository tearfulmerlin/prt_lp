window.addEventListener('DOMContentLoaded', (event) => {
  const navList = document.querySelector('nav ul')
  const menuIcon = document.querySelector('.menu_icon');
  const closeItem = document.querySelector('.nav__link');
  
  menuIcon.addEventListener('click', (event) => {
      event.preventDefault();
      navList.classList.toggle('close');
      closeItem.focus();
    })
  closeItem.addEventListener('click', (event) => {
      event.preventDefault();
      navList.classList.toggle('close');
      menuIcon.focus();
    })
});