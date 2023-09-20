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

function GetInfo2(inf) {
    return new Promise((resolve, reject) => {
      fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: inf
      })
      .then(response => response.text())
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
    });
}

