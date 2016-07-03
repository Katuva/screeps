var _ = require('lodash');

var roleHarvester = require('role.harvester');
var roleCarry = require('role.carry');
var roleMelee = require('role.melee');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleSupply = require('role.supply');
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

module.exports.loop = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }

    spawner.check();
    spawner.spawn();

    let towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    if (towers.length > 0) {
        let targets = towers[0].room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax &&
            object.structureType == STRUCTURE_CONTAINER ||
            object.structureType == STRUCTURE_WALL ||
            object.structureType == STRUCTURE_RAMPART
        });

        if (targets != null) {
            targets.sort((a, b) => a.hits - b.hits);
            towers.forEach(tower => {
                tower.repair(targets[0]);
            });
        }
    }

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
        else if (creep.memory.role == 'supply') {
            roleSupply.run(creep);
        }
    }
};
