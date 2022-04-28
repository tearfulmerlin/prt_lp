const createTimeout = (function createTimeoutCreator() {
  let timeOut;

  return function({ success, disable}) {
    if (!timeOut) {
      timeOut = setTimeout(() => {
        success.forEach((el) => {
          el.classList.remove('show');
        });
        disable.forEach((el) => {
          el.disabled=false;
        });

        timeOut = null;
      }, 5000);
    }
  }
})();

document.forms[0].onsubmit = function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const source = window.formSource;
  const formData = new FormData(form);
  const name = formData.get("name");
  const phone = formData.get("phone");
  const errorMsg = document.querySelector('.submition-error');
  const successMsg = document.querySelector('.submition-success');
  [...document.forms[0].children].find(el => el.type === 'submit').disabled = true;

  errorMsg.classList.remove('show');
  successMsg.classList.remove('show');

  fetch("/lead", {
      method: "POST",
      body: JSON.stringify({
        srce: source,
        name,
        phone,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(data => {
      if (data.status === 200) {
        successMsg.classList.toggle('show');
        createTimeout({ success: [successMsg], disable: [form.children[5]]});
        if (window.dataLayer) dataLayer.push({event: 'lead', action: 'success', source})
      } else {
        errorMsg.classList.toggle('show');
        createTimeout({ success: [errorMsg], disable: [form.children[5]]});
        if (window.dataLayer) dataLayer.push({event: 'lead', action: 'fail', source })
      }
    })
    .catch(e => {
      errorMsg.classList.toggle('show');
      createTimeout({ success: [errorMsg], disable: [form.children[5]]});
      if (window.dataLayer) dataLayer.push({event: 'lead', action: 'fail', source })
    });
}

function openPopup(event) {
  const source = event.target.dataset.source;
  const popup = document.querySelector(".popup");
  document.body.classList.toggle("popuped");
  popup.classList.toggle("open");
  document.querySelector(".popup form > label").focus();
  window.formSource = source;
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

function initPopup() {
  const openPopupBtns = document.querySelectorAll('.btn.lead');

  openPopupBtns.forEach((btn) => btn.onclick = openPopup);

  console.log(openPopupBtns)
  const popup = document.querySelector(".popup");
  const popupWrapper = document.querySelector(".popup");
  const popupForm = document.querySelector(".popup__form");

  popupForm.onclick = (event) => {
    event.stopPropagation();
  };

  popupWrapper.onclick = () => {
    popup.classList.toggle("open");
    document.body.classList.toggle("popuped");
  };
}

function initGoUp() {
  const goUpbutton = document.querySelector(".go-up");

  let flag = false;
  let timeout = null;
  window.onscroll = function() {
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

  goUpbutton.onclick = function(event) {
    event.stopPropagation();

    scroll({
      top: 0,
      behavior: 'smooth',
    })
  }
}

window.onload = () => {
  initNavList();
  initPopup();
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
