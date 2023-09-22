function GetInfo2(inf) {
    return new Promise((resolve, reject) => {
      fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: inf
      })
      .then(response => response.text())//не могу одну и туже фунцию использовать потмуо что разный запрос ответа 
      .then(result => {
        resolve(result);
      });
    });
}

function GetInfo(info) {
    return new Promise((resolve, reject) => {
      fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: info
      })
      .then(response => response.json())
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
    });
}

function Find(halls,id) {
    for (let hall of halls.result) {
        if (Number(hall["hall_id"]) === Number(id)) {
            return hall;
        }
    }
}



function InplantHtml(text) {
    const wrapper = document.querySelector(".conf-step__wrapper");
    // for (let child of wrapper.children) {
    //     wrapper.removeChild(child);
    // }
    wrapper.innerHTML=text;
}

function Check() {
    const wrapper = document.querySelector(".conf-step__wrapper");
    if ([...wrapper.children].length === 0 || [...wrapper.children].length === 1) {
        return true;
    } else {
        return false;
    }
}

function UpdateInfo() {
    const info = JSON.parse(localStorage.getItem("clientInfo"));
    console.log(info);
    UpdatePriceTitle(info);
    fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `event=get_hallConfig&timestamp=${Number(info.timeStamp)}&hallId=${Number(info.hallId)}&seanceId=${Number(info.seanceId)}`
      })
      .then(response => response.text()).then(result => {
        console.log(result);
        if (result === "null") {
            GetInfo("event=update").then(conf => {
                const {halls} = conf; 
                let res = Find(halls,info.hallId);
                const wrapper = document.querySelector(".conf-step__wrapper");
        // for (let child of wrapper.children) {
        //     wrapper.removeChild(child);
        // }
                wrapper.innerHTML=res["hall_config"];
                InitiLizeSits();
                InitReserve();
            })
            return;
        }
            InplantHtml(result);
            InitiLizeSits();
            InitReserve();
    });
}
function UpdatePriceTitle(info) {
    GetInfo("event=update").then(conf => {
        const {halls} = conf;
        let hallInfo = Find(halls,info.hallId);
        const normalPrice = document.querySelector(".price-standart");
        normalPrice.textContent = hallInfo['hall_price_standart'];
        const vipPrice = document.querySelector(".price-vip");
        vipPrice.textContent = hallInfo['hall_price_vip'];
        const title = document.querySelector(".buying__info-title");
        const btn = document.querySelector("button");
        btn.style.background = "gray";
        title.textContent = info.movieTitle;
        const time  = document.querySelector(".buying__info-start");
        time.textContent = "Начало Сеанса: " + info.time;
        const hal = document.querySelector(".buying__info-hall");
        hal.textContent = info.hallName;
    });
}
function InitiLizeSits() {
    const sites = [...document.querySelectorAll(".conf-step__chair")];
    const btn = document.querySelector("button");
    for (let sit of sites) {
        sit.onclick = (e) => {
            btn.style.background = "rgb(37, 196, 206)";
            e.currentTarget.classList.add("conf-step__chair_selected");
        }; 
    }
}
function InitReserve() {
    const btn = document.querySelector("button");
    btn.onclick = () => {
        if (btn.style.background === "gray") {
            return;
        } else {
            const config = document.querySelector(".conf-step__wrapper");
            const columns = [...document.querySelectorAll(".conf-step__row")];
            console.log(columns);
            const sites = [];
            let cost = 0;
            for (let i=0;i<columns.length;i++) {
                const nextStep = [...columns[i].children];
                for (let j=0;j<nextStep.length;j++) {
                    if (nextStep[j].classList.contains("conf-step__chair_selected")) {
                        sites.push({row: i+1,sit: j+1});
                        if (nextStep[j].classList.contains("conf-step__chair_standart")) {
                            cost+=Number(document.querySelector(".price-standart").textContent);
                        } else if (nextStep[j].classList.contains("conf-step__chair_vip")) {
                            cost+=Number(document.querySelector(".price-vip").textContent);
                        }
                    }
                }
            }
            let old = JSON.parse(localStorage.getItem("clientInfo"));
            old.sit = sites;
            old.cost = cost;
            localStorage.setItem("clientInfo",JSON.stringify(old));
            localStorage.setItem("conf",config.innerHTML);
            window.location.href = "./payment.html";
        }
    }
}
UpdateInfo();