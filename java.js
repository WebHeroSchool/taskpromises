let main = document.querySelector(".main");
const prelouder = document.getElementById('prelouder');
let now = new Date();
const urlParam = window.location.search.substring(1);
const login = (urlParam.split(('='))[1]);

setTimeout(() => {
  main.style.visibility = "visible";
  prelouder.style.display = "none";
}, 3000);

let url = 'https://api.github.com/users/voytov93';
if (login) {
  url = `https://api.github.com/users/${login}`;
}

let getInfo = new Promise((resolve, reject) => {
  setTimeout(() => url ? resolve(url) : reject("ошибка"), 2000);
});

let getDate = new Promise((resolve, reject) => {
  setTimeout(() => now ? resolve(now) : reject("ошибка"), 2000);
});

Promise.all([getDate, getInfo])
  .then(([time, url]) => {
    let newTime = document.createElement("p");
    newTime.appendChild(document.createTextNode(time));
    main.appendChild(newTime);
    fetch(url)
      .then(response => {
        if (response.status !== 404) {
          return response.json();
        } else {
          let err = new Error(response.statusText + ' ' + response.status);
          err.response = response;
          throw err;
        }
      })

      .then(json => {
        let ava = new Image();
        ava.src = json.avatar_url;
        main.append(ava);

        let link = document.createElement('a');
        link.href = json.html_url;
        link.style.display = "block";
        if (json.name) {
          link.innerHTML = json.name;
        } else {
          link.innerHTML = 'Информация о пользователе недоступна';
        }
        main.appendChild(link);

        let bio = document.createElement('p');
        if (json.bio) {
          bio.innerHTML = json.bio;
        } else {
          bio.innerHTML = 'Пользователь не заполнил данное поле';
        }
        main.append(bio);
      })

      .catch(error => document.body.innerHTML = `Пользователь не найден.<br> ${error}`);
  });