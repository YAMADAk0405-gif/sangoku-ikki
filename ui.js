// 三国一騎 Ver0.1.7
// UI管理

const backTitleButton =
document.getElementById("backTitleButton");


let leaderWarrior = null;



const startButton =
document.getElementById("startButton");


const titleScreen =
document.getElementById("titleScreen");


const factionScreen =
document.getElementById("factionScreen");


const selectScreen =
document.getElementById("selectScreen");

const backFactionButton =
document.getElementById("backFactionButton");


const teamScreen =
document.getElementById("teamScreen");


const battleScreen =
document.getElementById("battleScreen");



const warriorList =
document.getElementById("warriorList");


const teamList =
document.getElementById("teamList");



const factionButtons =
document.querySelectorAll(".factionButton");


const confirmButton =
document.getElementById("confirmButton");


const battleButton =
document.getElementById("battleButton");




// 出陣

startButton.addEventListener("click", function(){

    titleScreen.style.display = "none";

    factionScreen.style.display = "block";

});




// 勢力選択

factionButtons.forEach(function(button){

    button.addEventListener("click", function(){

        const faction =
        this.dataset.faction;


        factionScreen.style.display = "none";

        selectScreen.style.display = "block";


        showLeaderWarriors(faction);


    });

});





// ★5武将表示

function showLeaderWarriors(faction){

    warriorList.innerHTML = "";


    const leaders =
    warriors.filter(function(warrior){

        return (
            warrior.faction === faction &&
            warrior.rank === 5
        );

    });



    leaders.forEach(function(warrior){


        const div =
        document.createElement("div");



        div.innerHTML = `

        <label>

        <input type="radio"
        name="leader"
        >

        ${warrior.name}
        ★${warrior.rank}

        </label>

        `;



        const radio =
        div.querySelector("input");



        radio.addEventListener("change", function(){

            leaderWarrior = warrior;


            console.log(
                "代表武将:",
                leaderWarrior
            );

        });



        warriorList.appendChild(div);


    });


}





// 決定ボタン

confirmButton.addEventListener("click", function(){


    if(leaderWarrior === null){

        alert("武将を選択してください");

        return;

    }



    createTeam();



    showTeam();



    selectScreen.style.display = "none";

    teamScreen.style.display = "block";


});





// 部隊作成

function createTeam(){

    createPlayerTeam(leaderWarrior);

}

// 部隊表示

function showTeam(){


    teamList.innerHTML = "";



    playerTeam.forEach(function(warrior){


        const div =
        document.createElement("div");



        div.textContent =
        warrior.name +
        " ★" +
        warrior.rank;



        teamList.appendChild(div);


    });


}





// 戦闘開始

battleButton.addEventListener("click", function(){


    teamScreen.style.display = "none";

    battleScreen.style.display = "block";


    startBattle();


});

backFactionButton.addEventListener(
"click",
function(){

    selectScreen.style.display = "none";
    factionScreen.style.display = "block";

    leaderWarrior = null;
    warriorList.innerHTML = "";

});




// 敵決定

function startBattle(){


    createEnemyTeam();


    battleStart(
    playerTeam,
    enemyTeam
    );

// トップ画面へ戻る

backTitleButton.addEventListener(
"click",
function(){


    // 画面切替

    titleScreen.style.display = "block";

    factionScreen.style.display = "none";

    selectScreen.style.display = "none";

    teamScreen.style.display = "none";

    battleScreen.style.display = "none";


    // 選択データリセット

    leaderWarrior = null;

    playerTeam = [];

    enemyTeam = [];


    // 表示リセット

    warriorList.innerHTML = "";

    teamList.innerHTML = "";


    console.log(
        "タイトル画面へ戻りました"
    );


});



}