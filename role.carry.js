var roleCarry = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.dump && creep.carry.energy == 0) {
            creep.memory.dump = false;
        }

        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.dump = true;
            creep.memory.waiting = false;
            creep.memory.target = undefined;
        }

        if (creep.carry.energy < creep.carryCapacity && creep.ticksToLive >= 100 && !creep.memory.waiting && !creep.memory.dump) {
            creep.memory.waiting = true;
        }
        else if (creep.memory.target) {
            if (creep.ticksToLive <= 50) {
                Game.getObjectById(creep.memory.target).memory.waiting = false;
                console.log('not enough time to carry out carry order, killing myself');
                creep.suicide();
            }

            let target = Game.getObjectById(creep.memory.target);
            if (target !== null) {
                if (target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else {
                    creep.memory.target = undefined;
                }
            }
            else {
                creep.memory.target = undefined;
            }
        }
        else if (creep.carry.energy == 0 && creep.ticksToLive <= 100) creep.suicide();
        else if (creep.carry.energy == creep.carryCapacity && !creep.memory.dump) {
            creep.memory.dump = true;
        }
        else if (creep.ticksToLive <= 150 || creep.memory.dump) {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (target == null) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.energy < structure.storeCapacity;
                    }
                });
            }

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleCarry;
