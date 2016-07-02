var constants = require('app.constants');

var spawner = {
    check: function () {
        let harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length + this.check_queue('harvester');
        let carry = _.filter(Game.creeps, (creep) => creep.memory.role == 'carry').length + this.check_queue('carry');
        let melee = _.filter(Game.creeps, (creep) => creep.memory.role == 'melee').length + this.check_queue('melee');
        let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length + this.check_queue('upgrader');
        let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length + this.check_queue('builder');
        let repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair').length + this.check_queue('repair');
        let hostile = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS).length;

        if (harvester < 1) this.queue_spawn.harvester(true);
        if (carry < 1) this.queue_spawn.carry(true);

        if (hostile > melee * constants.totals.melee_enemy && harvester >= constants.totals.harvester_min && carry >= 1) {
            for (let i = 0; i < Memory.build_queue; i++) {
                if (Memory.build_queue[i].role != 'melee') {
                    Memory.build_queue.splice(i, 1);
                }
            }

            let queueCount = hostile * (constants.totals.melee_enemy - melee);
            for (let i = 0; i < queueCount; i++) {
                this.queue_spawn.melee();
            }
        }
        else {
            if (harvester >= constants.totals.harvester_min && carry >= 1 && melee < constants.totals.melee_min) {
                this.queue_spawn.melee();
            }
            else {
                if (harvester < Memory.sources.length * constants.totals.harvester_source) {
                    this.queue_spawn.harvester();
                }

                if (carry < harvester * constants.totals.carry_harvester) {
                    this.queue_spawn.carry();
                }

                if (harvester >= constants.totals.harvester_min && carry >= 1) {
                    if (upgrader < constants.totals.upgrader) {
                        this.queue_spawn.upgrader();
                    }

                    if (builder < constants.totals.builder) {
                        this.queue_spawn.builder();
                    }

                    if (repair < constants.totals.repair) {
                        this.queue_spawn.repair();
                    }
                }
            }
        }
    },
    check_queue: function (role) {
        return _.filter(Memory.build_queue, (queue) => queue.role == role).length;
    },
    queue_spawn: {
        base: function (type, role, basic) {
            if (basic) {
                console.log('queued: ', constants.creeps[type][0].body, ' role: ', role);
                Memory.build_queue.push({bp: constants.creeps[type][0].body, role: role});
            }
            else {
                for (let i = constants.creeps[type].length - 1; i >= 0; i--) {
                    if (i == 0) {
                        console.log('queued: ', constants.creeps[type][i].body, ' role: ', role);
                        Memory.build_queue.push({bp: constants.creeps[type][i].body, role: role});
                        break;
                    }
                    else if (Game.spawns.Spawn1.room.energyAvailable >= constants.creeps[type][i].cost) {
                        console.log('queued: ', constants.creeps[type][i].body, ' role: ', role);
                        Memory.build_queue.push({bp: constants.creeps[type][i].body, role: role});
                        break;
                    }
                }
            }
        },
        harvester: function (basic = false) {
            this.base('default', 'harvester', basic);
        },
        carry: function (basic = false) {
            this.base('carry', 'carry', basic);
        },
        melee: function (basic = false) {
            this.base('melee', 'melee', basic);
        },
        upgrader: function (basic = false) {
            this.base('default', 'upgrader', basic);
        },
        builder: function (basic = false) {
            this.base('default', 'builder', basic);
        },
        repair: function (basic = false) {
            this.base('default', 'repair', basic)
        }
    },
    spawn: function () {
        if (Memory.build_queue.length > 0) {
            let result = Game.spawns.Spawn1.createCreep(
                Memory.build_queue[0].bp,
                undefined,
                {role: Memory.build_queue[0].role}
            );

            if (_.isString(result)) {
                let item = Memory.build_queue.shift();
                console.log('Created ' + item.role + ': ' + result);
            }
        }
    }
};

module.exports = spawner;
