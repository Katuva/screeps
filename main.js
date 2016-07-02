var _ = require('lodash');

var roleHarvester = require('role.harvester');
var roleCarry = require('role.carry');
var roleMelee = require('role.melee');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var spawner = require('app.spawner');

let resources = Game.spawns.Spawn1.room.find(FIND_SOURCES);

if (!_.has(Memory, 'sources')) {
    Memory.sources = [];

    for (let source of resources) {
        Memory.sources.push({id: source.id, harvesters: []});
    }
}

if (!_.has(Memory, 'build_queue')) {
    Memory.build_queue = [];
}

if (!_.has(Memory, 'carry_queue')) {
    Memory.carry_queue = [];
}

module.exports.loop = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }

    spawner.check();
    spawner.spawn();

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'carry') {
            roleCarry.run(creep);
        }
        else if (creep.memory.role == 'melee') {
            roleMelee.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
    }
};
