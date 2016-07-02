var roleCarry = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity && creep.ticksToLive >= 200 && !creep.memory.target && !creep.memory.dump) {
            if (Memory.carry_queue.length > 0) {
                creep.memory.target = Memory.carry_queue.shift();
            }
        }
        else if (creep.memory.target) {
            if (creep.ticksToLive <= 50) {
                Memory.carry_queue.push(creep.memory.target);
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
        else if (creep.carry.energy == creep.carryCapacity && !creep.memory.dump) {
            creep.memory.dump = true;
        }
        else if (creep.ticksToLive <= 150 || creep.memory.dump) {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else {
                if (creep.carry.energy == 0) creep.memory.dump = false;
            }
        }
    }
};

module.exports = roleCarry;
