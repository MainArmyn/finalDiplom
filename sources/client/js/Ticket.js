function UpdateTicket() {
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
    const qrcode1 = QRCreator(JSON.stringify(info),
    { mode: 4,
    eccl: 0,
    version: -1,
    mask: -1,
    image: 'svg',
    modsize: -1,
    margin: 0
    });
    const content = (qrcode) =>{
        return qrcode.error ?
          `недопустимые исходные данные ${qrcode.error}`:
           qrcode.result;
      };
    document.getElementById("qr").append(content(qrcode1));
} 
UpdateTicket();