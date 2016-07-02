var constants = require('app.constants');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (!_.has(creep.memory, 'source')) {
            for (let source in Memory.sources) {
                if (Memory.sources[source].harvesters.length < constants.totals.harvester_source) {
                    Memory.sources[source].harvesters.push(creep.id);
                    creep.memory.source = Memory.sources[source].id;
                    break;
                }
                else {
                    for (let i = 0; i < Memory.sources[source].harvesters.length; i++) {
                        if (Game.getObjectById(Memory.sources[source].harvesters[i]) == null) {
                            Memory.sources[source].harvesters.splice(i, 1);
                            Memory.sources[source].harvesters.push(creep.id);
                            creep.memory.source = Memory.sources[source].id;
                            break;
                        }
                    }
                }
            }
        }

        if (creep.carry.energy < creep.carryCapacity) {
            creep.memory.waiting = false;
            let source = Game.getObjectById(creep.memory.source);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else if (!creep.memory.waiting) {
            creep.memory.waiting = true;
            Memory.carry_queue.push(creep.id);
        }
        // else if (creep.memory.waiting && !_.includes(Memory.carry_queue, creep.id)) {
        //     Memory.carry_queue.push(creep.id);
        // }
    }
};

module.exports = roleHarvester;
