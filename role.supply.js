var roleSupply = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.supplying && creep.carry.energy == 0) creep.memory.supplying = false;
        if (!creep.memory.supplying && creep.carry.energy == creep.carryCapacity) creep.memory.supplying = true;

        if (creep.memory.supplying) {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (target != null) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.energy > 0;
                }
            });

            if (target == null) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy > 0;
                    }
                });
            }

            if (target.structureType == STRUCTURE_EXTENSION || target.structureType == STRUCTURE_SPAWN) {
                if (target.transferEnergy(creep, creep.energyCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else if (target != null && target.structureType == STRUCTURE_CONTAINER) {
                if (target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleSupply;
