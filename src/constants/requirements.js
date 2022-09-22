import {
	HEROES,
	VILLAIN_GROUPS,
	HENCHMEN_GROUPS,
	BYSTANDERS
} from './index';

export const PlayerRequirements = {
	1: {
		[HEROES]: 3,
		[VILLAIN_GROUPS]: 1,
		[HENCHMEN_GROUPS]: 1,
		[BYSTANDERS]: 1
	},
	2: {
		[HEROES]: 5,
		[VILLAIN_GROUPS]: 2,
		[HENCHMEN_GROUPS]: 1,
		[BYSTANDERS]: 2
	},
	3: {
		[HEROES]: 5,
		[VILLAIN_GROUPS]: 3,
		[HENCHMEN_GROUPS]: 1,
		[BYSTANDERS]: 8
	},
	4: {
		[HEROES]: 5,
		[VILLAIN_GROUPS]: 3,
		[HENCHMEN_GROUPS]: 2,
		[BYSTANDERS]: 8
	},
	5: {
		[HEROES]: 6,
		[VILLAIN_GROUPS]: 4,
		[HENCHMEN_GROUPS]: 2,
		[BYSTANDERS]: 12
	}
};
