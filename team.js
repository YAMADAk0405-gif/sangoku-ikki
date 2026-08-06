// 三国一騎 Ver0.1.9
// 部隊管理


// プレイヤー部隊

let playerTeam = [];


// 敵部隊

let enemyTeam = [];



// 現在戦闘中の武将

let currentPlayerIndex = 0;

let currentEnemyIndex = 0;





// プレイヤー部隊作成

function createPlayerTeam(leaderWarrior){


    playerTeam = [];


    // 代表武将

    playerTeam.push(
        createBattleWarrior(leaderWarrior)
    );



    // 追加メンバー候補

    let candidates = warriors.filter(function(warrior){


        return (

            warrior.id !== leaderWarrior.id

            &&

            warrior.rank <= 3

        );

        
});

console.log(
    "敵候補",
    candidates
);


    // 2人追加

    for(let i = 0; i < 2; i++){


        let index =

        Math.floor(
            Math.random() *
            candidates.length
        );


        let member =
        candidates[index];


        playerTeam.push(
            createBattleWarrior(member)
        );


        candidates.splice(index,1);


    }



    console.log(
        "自軍部隊",
        playerTeam
    );

}

// 敵部隊作成

function createEnemyTeam(){


    enemyTeam = [];


let candidates =
warriors.filter(function(warrior){

    return !playerTeam.some(function(player){

        return player.id === warrior.id;

    });

});


    // 3人選出

    for(let i = 0; i < 3; i++){


        let index =

        Math.floor(
            Math.random() *
            candidates.length
        );



        let enemy =
        candidates[index];



        enemyTeam.push(
            createBattleWarrior(enemy)
        );


        candidates.splice(index,1);


    }

}
 
// 戦闘用武将データ作成

function createBattleWarrior(warrior){


    return {

    id: warrior.id,

    name: warrior.name,

    faction: warrior.faction,

    rank: warrior.rank,

    maxHp:100,

    hp:100,

    attack: warrior.attack,

    defense: warrior.defense,

    intelligence: warrior.intelligence,

    speed: warrior.speed,

    criticalRate: warrior.criticalRate,

    criticalDamage: warrior.criticalDamage,

    strategy: warrior.strategy,

    // 計略効果
    damageReduction:0,
    damageReductionTurn:0

};


}