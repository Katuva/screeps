var _ = require('lodash');

var roleHarvester = require('role.harvester');
var roleMelee = require('role.melee');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');

var creepsPerSource = 3;
var creepsDefense = 2;
var defensePerEnemy = 2;
var creepsUpgraders = 2;
var creepsBuilders = 1;
var creepsRepairers = 2;
var harvesterBP = [WORK, CARRY, MOVE];
var meleeBP = [TOUGH, ATTACK, MOVE, MOVE];

module.exports.loop = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }

    var resources = Game.spawns.Spawn1.room.find(FIND_SOURCES);

    if (!_.has(Memory, 'sources')) {
        Memory.sources = [];

        for (let source of resources) {
            Memory.sources.push({id: source.id, harvesters: []});
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var defense = _.filter(Game.creeps, (creep) => creep.memory.role == 'melee');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var hostiles = Game.rooms['W36S37'].find(FIND_HOSTILE_CREEPS);

    if (hostiles.length > defense.length * defensePerEnemy && harvesters.length >= 2) {
        let result = Game.spawns.Spawn1.createCreep(meleeBP, undefined, {role: 'melee'});
        if (_.isString(result)) {
            console.log('Created melee: ' + result);
        }
    }

    if (harvesters.length >= 2 && defense.length < creepsDefense) {
        let result = Game.spawns.Spawn1.createCreep(meleeBP, undefined, {role: 'melee'});
        if (_.isString(result)) {
            console.log('Created melee: ' + result);
        }
    }
    else if (upgraders.length < creepsUpgraders && harvesters.length >= 2) {
        let result = Game.spawns.Spawn1.createCreep(harvesterBP, undefined, {role: 'upgrader'});
        if (_.isString(result)) {
            console.log('Created upgrader: ' + result);
        }
    }
    else if (repairers.length < creepsRepairers && harvesters.length >= 2) {
        let result = Game.spawns.Spawn1.createCreep(harvesterBP, undefined, {role: 'repairer'});
        if (_.isString(result)) {
            console.log('Created repairer: ' + result);
        }
    }
    else if (builders.length < creepsBuilders && harvesters.length >= 2) {
        let result = Game.spawns.Spawn1.createCreep(harvesterBP, undefined, {role: 'builder'});
        if (_.isString(result)) {
            console.log('Created builder: ' + result);
        }
    }
    else if (harvesters.length < 2 || defense.length == creepsDefense) {
        for (let source in Memory.sources) {
            if (Memory.sources[source].harvesters.length < creepsPerSource) {
                let result = Game.spawns.Spawn1.createCreep(harvesterBP, undefined, {
                    role: 'harvester',
                    source: Memory.sources[source].id
                });
                if (_.isString(result)) {
                    Memory.sources[source].harvesters.push(result);
                    console.log('Created harvester: ' + result);

                    break;
                }
            }
            else {
                for (let harvester in Memory.sources[source].harvesters) {
                    if (Game.creeps[Memory.sources[source].harvesters[harvester]] == undefined || Game.getObjectById(Game.creeps[Memory.sources[source].harvesters[harvester]].id) == null) {
                        Memory.sources[source].harvesters.splice(harvester, 1);
                    }
                }
            }
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'melee') {
            roleMelee.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if (creep.memory.role == 'repairer') {
            roleRepair.run(creep);
        }
    }
};
