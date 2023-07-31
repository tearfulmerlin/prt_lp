window.addEventListener('click', (event) => {
  const target = event.target;

  console.dir(target.className);
  const classNames = target.className.split(' ');

  /* POPUP */
  if (classNames.includes('btn') && classNames.includes('lead')) {
    openPopup(event)
    return;
  }

  if (classNames.includes('wrapper')) {
    closePopup()
    return;
  }

  if (classNames.includes('submition_ok')) {
    hideSubmitionMessage(event)
    return;
  }
  /* POPUP END*/

  /* SCROLL */
  if (classNames.includes('go-up') && classNames.includes('visible') || classNames.includes('go-up__arrow')) {
    event.stopPropagation();

    scroll({
      top: 0,
      behavior: 'smooth',
    });
    return;
  }
  /* SCROLL END */
});

function hideSubmitionMessage(event) {
  const submitionMessage = document.querySelector('.submition-message');

  submitionMessage.classList.remove('show')
}

function openPopup(event) {
  const source = event.target.dataset.source;
  const popup = document.querySelector(".popup");

  document.body.classList.toggle("popuped");
  popup.classList.toggle("open");

  document.querySelector(".popup form > label").focus();
  window.formSource = source;
}

function closePopup() {
  const popup = document.querySelector(".popup");

  popup.classList.toggle("open");
  document.body.classList.toggle("popuped");
}

window.addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const source = window.formSource;
  const name = formData.get("name");
  const phone = formData.get("phone");
  const submitionMessage = document.querySelector('.submition-message');
  const submitionTitle = document.querySelector('.submition-title');

  fetch("/lead", {
    method: "POST",
    body: JSON.stringify({
      source,
      name,
      phone,
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(data => {
    if (data.status === 200) {
      submitionMessage.classList.remove('error');
      submitionMessage.classList.add('success');
      submitionTitle.textContent = 'Ваша заявка успішно відправлена!';
      submitionMessage.classList.add('show');
      event.target.reset();

      if (window.dataLayer) dataLayer.push({event: 'lead', action: 'success', source})
    } else {
      submitionMessage.classList.remove('success');
      submitionMessage.classList.add('error');
      submitionTitle.textContent = 'Сталася помилка!';
      submitionMessage.classList.add('show');

      if (window.dataLayer) dataLayer.push({event: 'lead', action: 'fail', source })
    }
  })
  .catch(() => {
    submitionMessage.classList.remove('success');
    submitionMessage.classList.add('error');
    submitionTitle.textContent = 'Сталася помилка!';
    submitionMessage.classList.add('show');

    if (window.dataLayer) dataLayer.push({event: 'lead', action: 'fail', source })
  });
}

function initNavList() {
  const navList = document.querySelector(".nav__list");
  const menuIcon = document.querySelector(".menu_icon");
  const closeItem = document.querySelector(".nav__link");
  const navItems = document.querySelectorAll(".nav__item");

  if (menuIcon) {
    menuIcon.onclick = () => {
      navList.classList.toggle("closed");
      document.body.classList.toggle("nav__menu-opened");
      closeItem.focus();
    };
  }

  if (closeItem) {
    closeItem.onclick = (event) => {
      event.preventDefault();
      navList.classList.toggle("closed");
      document.body.classList.toggle("nav__menu-opened");
      menuIcon.focus();
    };
  }

  navItems.forEach((item) => {
    item.onclick = (event) => {
      const srollTarget = document.querySelector(`#${event.target.dataset.id}`);

      scroll({
        top: srollTarget.offsetTop,
        behavior: 'smooth',
      })

      navList.classList.add("closed");
      document.body.classList.remove("nav__menu-opened");
    }
  });
}

function initGoUp() {
  const goUpbutton = document.querySelector(".go-up");

  let flag = false;
  let timeout = null;

  window.addEventListener('scroll', scrollHandler, { passive: true });
  function scrollHandler() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (window.scrollY > window.innerHeight / 1.2 && flag === false) {
        flag = !flag;
        goUpbutton.classList.add('visible')
      } else if (window.scrollY < window.innerHeight / 1.2 && flag === true) {
        flag = !flag;
        goUpbutton.classList.remove('visible')
      }
    }, 100);
  }
}

window.onload = () => {
  initNavList();
  initGoUp();

  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event:'gtm.js'
    });
    var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';

      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-N2ZJ2T4');
};
