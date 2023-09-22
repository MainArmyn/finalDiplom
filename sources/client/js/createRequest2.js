
  
      function UpdateRequest() { /*данная фукнция делает осоновной запрос на сервер для обновления данных*/
      GetInfo("event=update").then(result => {
        const { halls, films, seances } = result;
        const filmContainer = document.querySelector("main");
        films.result.forEach((film) => {
          Creator(film["film_poster"], film["film_name"], film["film_description"], film["film_duration"], film["film_origin"], filmContainer, film["film_id"]);
        });
        WorkWithSeances(seances, halls);
        InitSeances();
      })
  }
  
  function Creator(src,title,description,time,country,parent,id) {
      const film = `<section data-id=${id} class="movie">
      <div class="movie__info">      
        <div class="movie__poster">
          <img class="movie__poster-image" alt="Альфа постер" src="${src}">
        </div>
        <div class="movie__description">        
          <h2 class="movie__title">${title}</h2>
          <p class="movie__synopsis">${description}</p>
          <p class="movie__data">
            <span class="movie__data-duration">${time} минут</span>
            <span class="movie__data-origin">${country}</span>
          </p>
        </div>    
      </div>  
        
    </section>`;
    parent.innerHTML+=film;
  }
  
  function WorkWithSeances(seances,halls) {
      seances = seances.result;
      halls = halls.result.filter(fil => fil['hall_open'] === "1");
      const newFilms = [...document.querySelectorAll(".movie")];
      newFilms.forEach(film => {
          let filmSeances = seances.filter(seance => film.dataset.id === seance["seance_filmid"]);
          let seanceHall = {};
          for (let el of filmSeances) {
              if (seanceHall[el['seance_hallid']] === undefined ) {
                  seanceHall[el['seance_hallid']] = [];
                  seanceHall[el['seance_hallid']].push(el);
              } else {
                  seanceHall[el['seance_hallid']].push(el);
              }
          }
          for (let key in seanceHall) {
              let infoHall = halls.filter(hall => hall["hall_id"] === key)[0];
              if (infoHall === undefined) {
                continue;
              }
              let name = `<h3 class="movie-seances__hall-title" data-hallId=${infoHall["hall_id"]}>${infoHall['hall_name']}</h3>`;
              const webSeance = document.createElement("div");
              webSeance.innerHTML+=name;
              webSeance.className = 'movie-seances__hall';
              const list = document.createElement("ul");
              list.className = 'movie-seances__list';
              const date = new Date();
              const choosenDay = Number(document.querySelector(".page-nav__day_today").querySelector(".page-nav__day-number").textContent);
              for (let s of seanceHall[key]) {
                  let item = ` <li class="movie-seances__time-block ${choosenDay === date.getDate() && Number(s['seance_time'].slice(0,2)) < date.getHours() && Number(s['seance_time'].slice(4,5)) < date.getMinutes()  ? "non-active-seance":""}"><a class="movie-seances__time" data-seanceId=${s['seance_id']} data-seancestart=${Number(s['seance_start'])*60} href="hall.html">${s['seance_time']}</a></li>`;
                  list.innerHTML+=item;
              }
              webSeance.appendChild(list);
              film.appendChild(webSeance);
          }
      })
  }
  function Dates() {
    function Check(el) {
      if (el.textContent === "Сб" || el.textContent === "Вс") {
        el.parentElement.classList.add("page-nav__day_weekend");
      }
    }
    function ClearAnthorDates() {
     [...document.querySelectorAll(".page-nav__day")].forEach(item => {
      item.classList.remove("page-nav__day_today");
     });
    }
    function calculateStartTimestamp(date) {
    // Создаем объект Date для текущей даты
    let today = new Date();
    // Задаем время начала дня (0 часов 0 минут 0 секунд)
    today.setHours(0, 0, 0, 0);
    // Получаем timestamp в миллисекундах
    let startTimestamp = Math.floor(today.getTime() / 1000);
  
    // // Создаем объект Date для следующего дня
    // let nextDay = new Date(date);
    // nextDay.setDate(nextDay.getDate() + 1);
    // nextDay.setHours(0, 0, 0, 0);
    //let nextStartTimestamp = nextDay.getTime() / 1000;
  
    return startTimestamp;
  }
  
  
    
  let dayLinks = document.querySelectorAll('.page-nav__day');
  
  let today = new Date();
  // Устанавливаем актуальную дату для первой вкладки
  dayLinks[0].classList.add('page-nav__day_today');
  dayLinks[0].dataset.timestamp = calculateStartTimestamp();
  // Добавляем число и день недели
  dayLinks[0].querySelector('.page-nav__day-number').textContent = today.getDate();
  dayLinks[0].querySelector('.page-nav__day-week').textContent = getDayOfWeek(today.getDay());
  dayLinks[0].onclick = (e) => {
      ClearAnthorDates();
      e.currentTarget.classList.add("page-nav__day_today");
      ClearMovies();
      UpdateRequest();
  }
  // Вычисляем и добавляем даты для остальных вкладок
  for (let i = 1; i < dayLinks.length; i++) {
    let nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + i);
  
    let dayNumberElement = dayLinks[i].querySelector('.page-nav__day-number');
    let dayWeekElement = dayLinks[i].querySelector('.page-nav__day-week');
  
    // Добавляем число и день недели
    dayNumberElement.textContent = nextDay.getDate();
    dayWeekElement.textContent = getDayOfWeek(nextDay.getDay());
    Check(dayWeekElement);
  
    // Вычисляем и сохраняем timestamp
    let minus = nextDay.getDate() - (new Date()).getDate(); 
    dayLinks[i].dataset.timestamp = calculateStartTimestamp() + minus*(24 * 60 * 60);
    dayLinks[i].onclick = (e) => {
      ClearAnthorDates();
      e.currentTarget.classList.add("page-nav__day_today");
      ClearMovies();
      UpdateRequest();
    };
  }
  
  function getDayOfWeek(dayIndex) {
    let daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return daysOfWeek[dayIndex];
  }
  
  
  }
  function ClearMovies() {
    [...document.querySelectorAll(".movie")].forEach(el => {
      el.parentElement.removeChild(el);
    })
  }
  
  function InitSeances() {
    const movies = [...document.querySelectorAll(".movie")];
    console.log(movies);
    movies.forEach(movie => {
      const movieTitle = movie.querySelector(".movie__title").textContent;
      const seances = [...movie.querySelectorAll(".movie-seances__time")];
      seances.forEach(seance => {
        seance.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
            if (seance.parentElement.classList.contains("non-active-seance")) {
              return;
            }
            const seanceId = seance.dataset.seanceid;
            const time = seance.textContent;
            const hallId = seance.closest(".movie-seances__hall").querySelector(".movie-seances__hall-title").dataset.hallid;
            const timeStamp = Number(document.querySelector(".page-nav__day_today").dataset.timestamp) +  Number(seance.dataset.seancestart);
            const hallName = seance.closest(".movie-seances__hall").querySelector(".movie-seances__hall-title").textContent;
           localStorage.setItem("clientInfo",JSON.stringify({seanceId,movieTitle,timeStamp,hallName,hallId,time}));
           window.location.href = "./hall.html";
        };
      })
    })
  }
  
  
  
  Dates();
  
  UpdateRequest();