var constants = {
    app: {
        main_room: 'W36S37'
    },
    totals: {
        // Per source
        harvester_source: 3,
        harvester_min: 2,
        // Per harvester
        carry_harvester: 1,
        upgrader: 2,
        builder: 1,
        repair: 2,
        // Per enemy
        melee_enemy: 2,
        melee_min: 2
    },
    costs: {
        move: 50,
        work: 100,
        carry: 50,
        attack: 80,
        ranged_attack: 150,
        heal: 250,
        claim: 600,
        tough: 10
    },
    creeps: {
        default: [
            {body: [WORK, CARRY, MOVE], cost: 200},
            {body: [WORK, WORK, CARRY, MOVE], cost: 300},
            {body: [WORK, WORK, CARRY, MOVE, MOVE], cost: 350},
            {body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], cost: 500},
            {body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], cost: 600},
            {body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], cost: 750}
        ],
        carry: [
            {body: [CARRY, MOVE, MOVE], cost: 150},
            {body: [CARRY, MOVE, MOVE, MOVE], cost: 200},
            {body: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], cost: 300},
            {body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], cost: 400},
            {body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], cost: 500}
        ],
        melee: [
            {body: [ATTACK, MOVE, MOVE, TOUGH], cost: 190},
            {body: [ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH, TOUGH], cost: 290},
            {body: [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH], cost: 450},
            {
                body: [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH],
                cost: 570
            }
        ]
    }
};

module.exports = constants;
