const inputName = document.getElementById("name")
const inpuCpf = document.getElementById("cpf")
const btnSaveName = document.getElementById("save-name")


const btnInitialQuiz = document.getElementById("start")
const contentStartQuiz = document.getElementById("start-quiz")

const contentQuiz = document.getElementById("quiz")

const pointValue = document.getElementById("value")


btnSaveName.addEventListener("click", function (e) {
    e.preventDefault()

    if (inputName.value !== "" && inpuCpf.value !== "") {
        localStorage.setItem("dataUser", JSON.stringify({ name: inputName.value, cpf: inpuCpf.value }))
        ToastifyNoti("Salvo com sucesso.", "success")
    }
})


function verifyCpf() {
    fetch('assets/php/cpf.php', {
        method: "POST",
        body: JSON.stringify({
            cpf: inpuCpf.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response => response.json())).then(data => {

        if (data.status === "success") {
            ToastifyNoti("CPF já cadastrado.", "error")
            btnSaveName.setAttribute('disabled', 'true');
            btnInitialQuiz.setAttribute('disabled', 'true');
        } else {
            btnSaveName.removeAttribute('disabled');
            btnInitialQuiz.removeAttribute('disabled');
        }
    })
}

inpuCpf.addEventListener("change", verifyCpf)

btnInitialQuiz.addEventListener("click", function (e) {
    const dataUserStorage = localStorage.getItem("dataUser")

    if (!dataUserStorage) {
        ToastifyNoti("Campos obrigatorios.", "error")
        return;
    }


    window.location.hash = "initial-quiz-p1"
    contentStartQuiz.style.display = "none"
    contentQuiz.style.display = "block"

})

if (localStorage.getItem("dataUser")) {
    contentStartQuiz.style.display = "none"
    contentQuiz.style.display = "block"
    window.location.hash = "initial-quiz-p1"
}

const contentButtons = document.querySelectorAll(".flex-buttons button")
const points = [];

if (contentButtons) {
    contentButtons.forEach((button) => {
        button.addEventListener("click", function (e) {

            const buttonsCurrent = button.closest(".flex-buttons").querySelectorAll("button")

            buttonsCurrent.forEach((btn) => {
                if (!btn.classList.contains("active") && btn.getAttribute("points") === button.getAttribute("points")) {
                    btn.classList.add("active")
                } else {
                    btn.classList.remove("active")
                }


            })

            const btnPoints = this.getAttribute("points")
            const quizId = button.closest(".quiz").getAttribute("quiz-id")

            const existingQuizId = points.findIndex(item => item.quiz_id === quizId);

            if (existingQuizId === - 1) {
                points.push({
                    quiz_id: quizId,
                    points: parseInt(btnPoints)
                })
            } else {
                points[existingQuizId].points = parseInt(btnPoints);
            }

            if (points.length === 8) {
              let  totalPoints = points.reduce((accumulator, currentValue) => {
                    // Adicionar os pontos do objeto atual ao acumulador
                    return accumulator + currentValue.points;
                }, 0);
                localStorage.setItem("points", totalPoints)

            }

            console.log(points)
            resultQuiz()
        })
    })
}




function resultQuiz() {


    const getPoints = localStorage.getItem("points");
    const dataUserStorage = JSON.parse(localStorage.getItem("dataUser"))


    const spanPoint = document.getElementById("value");
    const btnRolet = document.getElementById("rolet")
    const btnText = document.getElementById("btn-text")
    const spanaward = document.getElementById("value-award")

    const items = ["Diário da Gratidão", "Kit Relaxamento", "Livro"];


    const points = parseInt(getPoints);
    if (points && points >= 7) {
        document.getElementById("foother").style.display = "block";
        document.getElementById("ranking").style.display = 'flex'
        btnRolet.style.display = "block"
        document.getElementById("btn-text").style.display = "none";
        document.getElementById("text-award").style.display = "block"
        spanaward.textContent = localStorage.getItem("quiz-award")
        spanPoint.innerText = points;
    } else if (points && points <= 6) {
        document.getElementById("foother").style.display = "block";
        document.getElementById("ranking").style.display = 'flex'
        document.getElementById("btn-text").style.display = "block";
        document.getElementById("text-award").style.display = "none"
        document.getElementById("text-award").style.display = "none"
        btnRolet.style.display = "none";
        spanPoint.innerText = points;

    }



    if (btnRolet) {
        btnRolet.addEventListener("click", function (e) {
            const randomIndex = Math.floor(Math.random() * items.length);
            document.getElementById("text-award").style.display = "block"
            spanaward.textContent = items[randomIndex]
            localStorage.setItem("award", items[randomIndex])

            if (dataUserStorage && getPoints >= 7 && items[randomIndex] !== "") {
                postData(dataUserStorage.name, dataUserStorage.cpf, getPoints, items[randomIndex])
            }

           
        })


    }


    if (btnText && dataUserStorage && getPoints && getPoints <= 6 ) {
        
        postData(dataUserStorage.name, dataUserStorage.cpf, getPoints, "Chá ou picolé")
    }
}

function postData(name, cpf, points, award) {




    fetch('assets/php/insert.php', {
        method: "POST",
        body: JSON.stringify({
            name: name,
            cpf: cpf,
            points: points,
            award: award
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response => response.json())).then(data => {
        ToastifyNoti("Sua resposta foi salva.", "success")
        Ranking()
        setInterval(() => {
            localStorage.clear()
            location.reload()
        }, 5000)
    })


}


function ToastifyNoti(text, option) {
    Toastify({
        text: text,
        duration: 3000,
        destination: '',
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        positionLeft: false, // `true` or `false`
        backgroundColor: `${option === "success" ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff8a00, #da1b60)"}`
    }).showToast();
}


function Ranking() {

    const tableRanking = document.querySelector("#ranking tbody")

    fetch('assets/php/select.php', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response => response.json())).then(data => {
        if (data && data.users?.length > 0) {
            data.users.forEach((item) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.points}</td>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                `;

                tableRanking.appendChild(newRow);
            });
        }

        const allButtons = document.querySelectorAll("button")
        const getPoints = localStorage.getItem("points");
        const getAward = localStorage.getItem("award");

        if (getPoints >= 7 && getAward) {
            allButtons.forEach((btn) => {
                btn.disabled = true
            })
        } else if (getPoints <= 6 && !getAward) {
            allButtons.forEach((btn) => {
                btn.disabled = true
            })
        }


    })
}




