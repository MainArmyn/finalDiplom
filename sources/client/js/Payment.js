function UpdateInfo() {
    const info = JSON.parse(localStorage.getItem("clientInfo"));
    const config = localStorage.getItem("conf");
    const movieTitle = document.querySelector('.ticket__title');
    movieTitle.textContent = info.movieTitle;
    const sits = document.querySelector(".ticket__chairs");
    sits.textContent = '';
    info.sit.forEach(element => {
        sits.textContent+=element.row+"/"+element.sit+","+" ";
    });
    const hall = document.querySelector(".ticket__hall");
    hall.textContent = info.hallName.slice(3);
    const senace = document.querySelector(".ticket__start");
    senace.textContent = info.time;
    const price = document.querySelector(".ticket__cost");
    price.textContent = info.cost;
    const btn  = document.querySelector(".acceptin-button");
    btn.onclick = (e) => {
        GetInfo(`event=sale_add&timestamp=${info.timeStamp}&hallId=${info.hallId}&seanceId=${info.senaceId}&hallConfiguration=${config}`).then(result => {
            window.location.href = "./ticket.html";
        })
    };
}
UpdateInfo();