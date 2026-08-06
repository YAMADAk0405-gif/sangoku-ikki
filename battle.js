// 三国一騎 Ver0.1.19
// 戦闘処理

let playerFighter = null;
let enemyFighter = null;

let currentPlayerData = null;
let currentEnemyData = null;

let firstAttacker = null;
let secondAttacker = null;

let battleStep = 0;

let battleEnd = false;

// 次の武将へ移行

function nextEnemy(){

    currentEnemyIndex++;


    if(currentEnemyIndex >= enemyTeam.length){

        addLog(
            "🎉 敵部隊を全滅させました！"
        );


        battleEnd = true;

        nextTurnButton.disabled = true;


        return;

    }

    addLog(
        "次の敵が現れた！"
    );



    enemyFighter = {

    ...enemyTeam[currentEnemyIndex]

};

    secondAttacker =
    enemyFighter;



   addLog(
    enemyFighter.name +
    "が出陣！"
);


addLog(
    getDeployMessage(enemyFighter)
);

addLog("");

updateStatus();

decideFirstAttack();

battleStep = 0;

}

// 次の味方へ交代

function nextPlayer(){

    currentPlayerIndex++;


    if(currentPlayerIndex >= playerTeam.length){

        addLog(
            "あなたの部隊は全滅しました..."
        );


        battleEnd = true;

        nextTurnButton.disabled = true;


        return;

    }



playerFighter = {

    ...playerTeam[currentPlayerIndex]

};

// 攻撃担当を更新
firstAttacker = playerFighter;

secondAttacker = enemyFighter;


addLog(
    playerFighter.name +
    "が出陣！"
);


addLog(
    getDeployMessage(playerFighter)
);

addLog("");

updateStatus();

decideFirstAttack();

battleStep = 0;

}

const battleLog =
document.getElementById("battleLog");


const playerInfo =
document.getElementById("playerInfo");


const enemyInfo =
document.getElementById("enemyInfo");


const nextTurnButton =
document.getElementById("nextTurnButton");

const restartBattleButton =
document.getElementById("restartBattleButton");



// 戦闘開始

function battleStart(players, enemies){

    currentPlayerData =
    players.map(player => ({
        ...player
    }));


    currentEnemyData =
    enemies.map(enemy => ({
        ...enemy
    }));


    battleEnd = false;

    battleStep = 0;

    nextTurnButton.disabled = false;


    playerTeam =
    currentPlayerData.map(player => ({
        ...player
    }));


    enemyTeam =
    currentEnemyData.map(enemy => ({
        ...enemy
    }));

    
    currentPlayerIndex = 0;
    currentEnemyIndex = 0;


    playerFighter = {

    ...playerTeam[0],

    maxHp: playerTeam[0].hp,

    damageReduction: 0,

    damageReductionTurn: 0

    };



     enemyFighter = {

    ...enemyTeam[0],

    maxHp: enemyTeam[0].hp,

    damageReduction: 0,

    damageReductionTurn: 0

    };

    battleLog.innerHTML = "";


    addLog(
        "⚔ 戦闘開始！"
    );


    addLog("");

    addLog(
        playerFighter.name +
        "が出陣！"
    );


    addLog(
        getDeployMessage(playerFighter)
    );


    addLog(
        enemyFighter.name +
        "が出陣！"
    );


    addLog(
        getDeployMessage(enemyFighter)
    );


    addLog("");


    decideFirstAttack();


    updateStatus();

}

// 先攻決定

function decideFirstAttack(){


    if(playerFighter.speed >= enemyFighter.speed){


        firstAttacker = playerFighter;

        secondAttacker = enemyFighter;


    }else{


        firstAttacker = enemyFighter;

        secondAttacker = playerFighter;


    }



    addLog(

        "先攻：" +
        firstAttacker.name

    );


}





// 次へボタン

nextTurnButton.addEventListener(
"click",
function(){

    if(battleEnd){

        return;

    }


    battleTurn();

});

restartBattleButton.addEventListener(
"click",
function(){

    battleStart(
        currentPlayerData,
        currentEnemyData
    );

});





// ターン処理

function battleTurn(){



    if(checkWinner()){

        return;

    }



    if(battleStep === 0){


    if(firstAttacker === playerFighter){

        attack(
            playerFighter,
            enemyFighter
        );

    }else{

        attack(
            enemyFighter,
            playerFighter
        );

    }


    battleStep = 1;


}

else{


    if(secondAttacker === playerFighter){

        attack(
            playerFighter,
            enemyFighter
        );

    }else{

        attack(
            enemyFighter,
            playerFighter
        );

    }


    battleStep = 0;

    reduceStrategyTurn();

}

    updateStatus();

    addLog("");

}







// 攻撃

function attack(attacker, defender){


    // 計略判定

    if(useStrategy(attacker, defender)){

    addLog("");

    return true;

}


    let totalDefense =
    defender.defense;


    let damage =

    attacker.attack -

    Math.floor(
    totalDefense / 2
    );


    if(damage < 1){

        damage = 1;

    }


 // 会心判定

let critical = false;


let criticalRate =
attacker.criticalRate;

let criticalDamage =
attacker.criticalDamage;



if(Math.random() < criticalRate){

    damage =
    Math.floor(damage * criticalDamage);

    critical = true;

}

// 鉄壁効果ログ
console.log(
    defender.name,
    "軽減率:",
    defender.damageReduction
);

if(defender.damageReduction > 0){

    damage =
    Math.floor(
        damage *
        (1 - defender.damageReduction)
    );

}


// HP減少
defender.hp -= damage;

// HPが0未満にならないようにする
if(defender.hp < 0){

    defender.hp = 0;

}

    addLog(
    attacker.name +
    "の攻撃！"
);

// セリフ確率

if(!critical && Math.random() < 0.1){

    let attackMessage =
    getAttackMessage(attacker);


    if(attackMessage){

        addLog(
            "「" +
            attackMessage +
            "」"
        );

    }

}

if(critical){

    addLog("💥 会心の一撃！");

    let criticalMessage =
    getCriticalMessage(attacker);

    if(criticalMessage){

        addLog(
            "「" +
            criticalMessage +
            "」"
        );

    }

}


addLog(
    damage +
    "ダメージ！"
);



    addLog(

        defender.name +

        " HP：" +

        defender.hp

    );


return false;


}







// 勝敗確認

function checkWinner(){


    // 敵撃破

    if(enemyFighter.hp <= 0){


        addLog(
            "🎉 " +
            enemyFighter.name +
            "を撃破！"
        );

        addLog("");

        nextEnemy();


        return true;

    }



    // 味方撃破

    if(playerFighter.hp <= 0){


        addLog(
            playerFighter.name +
            "が倒れた..."
        );

        addLog("");


        nextPlayer();


        return true;

    }



    return false;


}

function reduceStrategyTurn(){

    if(playerFighter.damageReductionTurn > 0){

        playerFighter.damageReductionTurn--;

        if(playerFighter.damageReductionTurn === 0){

            playerFighter.damageReduction = 0;

            addLog(
                playerFighter.name +
                "の鉄壁効果が切れた！"
            );

        }

    }


    if(enemyFighter.damageReductionTurn > 0){

        enemyFighter.damageReductionTurn--;

        if(enemyFighter.damageReductionTurn === 0){

            enemyFighter.damageReduction = 0;

            addLog(
                enemyFighter.name +
                "の鉄壁効果が切れた！"
            );

        }

    }

}


// ログ追加

function addLog(text){

    const line =
    document.createElement("div");


    if(text === ""){

        line.innerHTML = "&nbsp;";

    }else{

        line.textContent = text;

    }


battleLog.appendChild(line);

battleLog.scrollTop =
battleLog.scrollHeight;

}



// ステータス更新

function updateStatus(){


playerInfo.innerHTML =

playerFighter.name +

"<br>HP：" +
playerFighter.hp +
"/" +
playerFighter.maxHp +

`

<div class="hp">

<div class="hpValue"

style="width:${playerFighter.hp / playerFighter.maxHp * 100}%">

</div>

</div>

`;



enemyInfo.innerHTML =

enemyFighter.name +

"<br>HP：" +
enemyFighter.hp +
"/" +
enemyFighter.maxHp +

`

<div class="hp">

<div class="hpValue"

style="width:${enemyFighter.hp / enemyFighter.maxHp * 100}%">

</div>

</div>

`;



}

function getDeployMessage(warrior){

    const messages = {

        "呂布":
        "俺を止められる者がいるか！",

        "関羽":
        "我が青龍刀、受けてみよ！",

        "張飛":
        "まとめて相手してやる！",

        "趙雲":
        "我が槍で道を切り開く！",

        "曹操":
        "勝利への道筋は見えている。",

        "周瑜":
        "知略だけではない。武も見せよう。",

        "孫策":
        "俺が相手だ！覚悟しろ！",

        "黄蓋":
        "老将と侮るなよ！",

        "馬超":
        "この錦馬超が相手だ！",

        "董卓":
        "力の差を思い知らせてやろう！"

    };


    if(messages[warrior.name]){

        return "「" + messages[warrior.name] + "」";

    }


    return "「俺が相手だ！」";

}

//通常攻撃セリフ

function getAttackMessage(warrior){

    const messages = {

        "張遼":[
            "我が刃を受けよ！",
            "一気に攻める！"
        ],

        "関羽":[
            "青龍刀の威力を見よ！",
            "我が一撃を受けよ！"
        ],

        "張飛":[
            "吹き飛べぇ！",
            "力で押し切る！"
        ],

        "趙雲":[
            "我が槍、見切れるか！",
            "この一撃に賭ける！"
        ],

        "曹操":[
            "これも勝利への布石だ。",
            "隙は見逃さぬ。"
        ],

        "呂布":[
            "俺の力を思い知れ！",
            "誰にも止められん！"
        ]

    };


    if(messages[warrior.name]){

        let list = messages[warrior.name];

        return list[
            Math.floor(Math.random() * list.length)
        ];

    }


    return null;

}

//会心専用セリフ

function getCriticalMessage(warrior){

    const messages = {

        "呂布":[
            "消し飛べぇ！！",
            "俺の本気を受けてみろ！"
        ],

        "関羽":[
            "我が青龍刀、唸れ！",
            "一刀両断だ！"
        ],

        "張飛":[
            "これで終わりだぁ！！",
            "吹き飛べぇ！！"
        ],

        "趙雲":[
            "この槍、避けられるか！",
            "一気に貫く！"
        ],

        "曹操":[
            "これが勝利への一手だ。",
            "ここで決める！"
        ]

    };


    if(messages[warrior.name]){

        let list = messages[warrior.name];

        return list[
            Math.floor(Math.random() * list.length)
        ];

    }


    return null;

}

// 計略発動率

function getStrategyRate(warrior){

    let intelligence =
    warrior.intelligence;


    if(intelligence >= 95){

        return 0.35;

    }

    if(intelligence >= 85){

        return 0.25;

    }

    if(intelligence >= 70){

        return 0.20;

    }

    if(intelligence >= 50){

        return 0.15;

    }

    if(intelligence >= 30){

        return 0.10;

    }


    return 0.05;

}


// 計略成功率

function getStrategySuccessRate(attacker, defender){

    let base = 0.8;


    let intelligenceDiff =
    attacker.intelligence -
    defender.intelligence;


    let rate =
    base +
    (intelligenceDiff * 0.01);


    if(rate < 0.05){

        rate = 0.05;

    }


    if(rate > 0.95){

        rate = 0.95;

    }


    return rate;

}

// 計略一覧

const strategies = [

    {
        name:"火計",
        type:"attack",
        power:1.5
    },

    {
        name:"強撃",
        type:"attack",
        power:1.3
    },

    {
        name:"鉄壁",
        type:"defense",
        power:0.5
    },

    {
        name:"回復",
        type:"heal",
        power:0.4
    }

];

// 計略使用判定

function useStrategy(attacker, defender){


    console.log("useStrategy開始"); 
    console.log(getStrategyRate(attacker));

    // 計略を持っていない武将

    if(!attacker.strategy ||
       attacker.strategy.length === 0){

        console.log(
    "計略候補:",
    attacker.name,
    attacker.strategy
    );

        return false;

    }


    let strategyRate =
    getStrategyRate(attacker);


    // 発動判定

    let r = Math.random();

console.log(
    "発動率：" + strategyRate +
    " 乱数：" + r
);

if(r > strategyRate){

    return false;

}


// 使用可能な計略だけ抽選

let availableStrategies =
attacker.strategy.filter(function(s){

    if(
        s === "回復" &&
        attacker.hp >= attacker.maxHp
    ){
        return false;
    }

    return true;

});


if(availableStrategies.length === 0){

    return false;

}


let strategyName =
availableStrategies[
    Math.floor(
        Math.random() * availableStrategies.length
    )
];
    //ログ
    console.log(
    "選択された計略：",
    strategyName
    );

    addLog(
        attacker.name +
        "の計略発動！"
    );

    //ログ
    console.log(
    "計略処理開始",
    attacker.name,
    strategyName
    );


    addLog(
        "「" +
        strategyName +
        "」"
    );



 // 攻撃系計略のみ成功率判定

if(
    strategyName === "火計" ||
    strategyName === "強撃"
){

    let successRate =
    getStrategySuccessRate(
        attacker,
        defender
    );


    if(Math.random() > successRate){

        addLog(
            "しかし計略は失敗した！"
        );

        addLog("");

        return true;

    }

}

    // 効果処理

    if(strategyName === "強撃"){

        let damage =
        attacker.attack -
        Math.floor(defender.defense / 2);


        damage =
        Math.floor(damage * 1.3);


        defender.hp -= damage;


        if(defender.hp < 0){

            defender.hp = 0;

        }


        addLog(
            damage +
            "ダメージ！"
        );

        return true;

    }



 if(strategyName === "火計"){

    let power = 1.2;
    let defenseRate = 0.5;

    let damage =
    (attacker.intelligence * power)
    -
    (defender.intelligence * defenseRate);


    damage =
    Math.floor(damage);


    if(damage < 1){

        damage = 1;

    }


    defender.hp -= damage;


    if(defender.hp < 0){

        defender.hp = 0;

    }


    addLog(
        "🔥 火計！ " +
        damage +
        "ダメージ！"
    );


    return true;

}

    if(strategyName === "回復"){


    // 基本20% + 知力補正

    let healRate =
    0.2 +
    (attacker.intelligence * 0.002);


    if(healRate > 0.5){

        healRate = 0.5;

    }


    let heal =
    Math.floor(
        attacker.maxHp * healRate
    );


    attacker.hp += heal;


    if(attacker.hp > attacker.maxHp){

        heal =
        heal -
        (attacker.hp - attacker.maxHp);

        attacker.hp = attacker.maxHp;

    }


    addLog(
        heal +
        "回復！"
    );

    return true;

}



if(strategyName === "鉄壁"){


    if(attacker.damageReduction > 0){

        addLog(
            attacker.name +
            "はすでに鉄壁状態だ！"
        );

        return true;

    }


    attacker.damageReduction = 0.5;

    attacker.damageReductionTurn = 3;


    addLog(
        attacker.name +
        "は防御態勢に入った！"
    );


    addLog(
        "3ターンの間、受けるダメージ50%減少！"
    );

    return true;

}
}