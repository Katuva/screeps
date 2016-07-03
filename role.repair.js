var roleRepair = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.repairing && creep.carry.energy == 0) creep.memory.repairing = false;
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) creep.memory.repairing = true;

        if (creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            targets.sort((a, b) => a.hits - b.hits);

            if (targets.length > 0) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
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

module.exports = roleRepair;
