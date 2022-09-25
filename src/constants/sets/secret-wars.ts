import * as freeze from 'deep-freeze';
import _ from 'lodash';

import {
	ALWAYS_LEADS,
	HENCHMEN_GROUPS,
	SCHEME_TWIST,
	SETS,
	SIDEKICKS,
	VILLAIN_GROUPS,
	HenchmanDefinition,
	HeroDefinition,
	Mastermind,
	MastermindDefinition,
	Scheme,
	SchemeDefinition,
	SpecialCaseAdditions,
	VillainDefinition
} from '../index';

import { getMastermind } from '../utils';

const HERO_MAXIMUS = 'Maximus';
const HERO_MAGIK = 'Magik';
const HERO_LADY_THOR = 'Lady Thor';
const HERO_DR_STRANGE = 'Dr. Strange'
const HERO_CAPTAIN_MARVEL = 'Captain Marvel';
const HERO_BLACK_PANTHER = 'Black Panther';
const HERO_BLACK_BOLT = 'Black Bolt';
const HERO_SUPERIOR_IRON_MAN = 'Superior Iron Man';
const HERO_APOCALYPTIC_KITTY_PRYDE = 'Apocalyptic Kitty Pryde';
const HERO_PROXIMA_MIDNIGHT = 'Proxima Midnight';
const HERO_ULTIMATE_SPIDER_MAN = 'Ultimate Spider-Man';
const HERO_THANOS = 'Thanos';
const HERO_OLD_MAN_LOGAN = 'Old Man Logan';
const HERO_NAMOR_THE_SUB_MARINER = 'Namor, The Sub-Mariner';

export const Heroes: HeroDefinition = freeze({
	[HERO_MAXIMUS]: {},
	[HERO_MAGIK]: {},
	[HERO_LADY_THOR]: {},
	[HERO_DR_STRANGE]: {},
	[HERO_CAPTAIN_MARVEL]: {},
	[HERO_BLACK_PANTHER]: {},
	[HERO_BLACK_BOLT]: {},
	[HERO_SUPERIOR_IRON_MAN]: {},
	[HERO_APOCALYPTIC_KITTY_PRYDE]: {},
	[HERO_PROXIMA_MIDNIGHT]: {},
	[HERO_ULTIMATE_SPIDER_MAN]: {},
	[HERO_THANOS]: {},
	[HERO_OLD_MAN_LOGAN]: {},
	[HERO_NAMOR_THE_SUB_MARINER]: {}
});

const VILLAIN_THE_DEADLANDS = 'The Deadlands';
const VILLAIN_SENTINEL_TERRITORIES = 'Sentinel Territories';
const VILLAIN_WASTELAND = 'Wasteland';
const VILLAIN_DOMAIN_OF_APOCALYPSE = 'Domain of Apocalypse';
const VILLAIN_LIMBO = 'Limbo';
const VILLAIN_MANHATTAN_EARTH_1610 = 'Manhattan (Earth-1610)';

export const Villains: VillainDefinition = freeze({
	[VILLAIN_THE_DEADLANDS]: {},
	[VILLAIN_SENTINEL_TERRITORIES]: {},
	[VILLAIN_WASTELAND]: {},
	[VILLAIN_DOMAIN_OF_APOCALYPSE]: {},
	[VILLAIN_LIMBO]: {},
	[VILLAIN_MANHATTAN_EARTH_1610]: {}
});

const HENCHMEN_GHOST_RACERS = 'Ghost Racers';
const HENCHMEN_MODOKS = 'M.O.D.O.K.S';
const HENCHMEN_THOR_CORPS = 'Thor Corps';

export const Henchmen: HenchmanDefinition = freeze({
	[HENCHMEN_GHOST_RACERS]: {},
	[HENCHMEN_MODOKS]: {},
	[HENCHMEN_THOR_CORPS]: {}
});

const MASTERMIND_NIMROD_SUPER_SENTINEL = 'Nimrod, Super Sentinel';
const MASTERMIND_ZOMBIE_GREEN_GOBLIN = 'Zombie Green Goblin';
const MASTERMIND_MADELYNE_PRYOR_GOBLIN_QUEEN = 'Madelyne Pryor, Goblin Queen';
const MASTERMIND_WASTELAND_HULK = 'Wasteland Hulk';

export const Masterminds: MastermindDefinition = freeze({
	[MASTERMIND_NIMROD_SUPER_SENTINEL]: {
		[ALWAYS_LEADS]: VILLAIN_SENTINEL_TERRITORIES
	},
	[MASTERMIND_ZOMBIE_GREEN_GOBLIN]: {
		[ALWAYS_LEADS]: VILLAIN_THE_DEADLANDS
	},
	[MASTERMIND_MADELYNE_PRYOR_GOBLIN_QUEEN]: {
		[ALWAYS_LEADS]: VILLAIN_LIMBO
	},
	[MASTERMIND_WASTELAND_HULK]: {
		[ALWAYS_LEADS]: VILLAIN_WASTELAND
	}
});

const SCHEME_BUILD_AN_ARMY_OF_ANNIHILATION = 'Build an Army of Annihilation';
const SCHEME_CORRUPT_THE_NEXT_GENERATION_OF_HEROES = 'Corrupt the Next Generation of Heroes';
const SCHEME_CRUSH_THEM_WITH_MY_BARE_HANDS = 'Crush Them With My Bare Hands';
const SCHEME_DARK_ALLIANCE = 'Dark Alliance';
const SCHEME_FRAGMENTED_REALITIES = 'Fragmented Realities';
const SCHEME_MASTER_OF_TYRANTS = 'Master of Tyrants';
const SCHEME_PAN_DIMENSIONAL_PLAGUE = 'Pan-Dimensional Plague';
const SCHEME_SMASH_TWO_DIMENSIONS_TOGETHER = 'Smash Two Dimensions Together';

export const Schemes: SchemeDefinition = freeze({
	[SCHEME_BUILD_AN_ARMY_OF_ANNIHILATION]: {
		[SCHEME_TWIST]: _players => 9
	},
	[SCHEME_CORRUPT_THE_NEXT_GENERATION_OF_HEROES]: {
		[SCHEME_TWIST]: _players => 8,
		[SIDEKICKS]: () => 10
	},
	[SCHEME_CRUSH_THEM_WITH_MY_BARE_HANDS]: {
		[SCHEME_TWIST]: players => players === 1 ? 6 : 5
	},
	[SCHEME_DARK_ALLIANCE]: {
		[SCHEME_TWIST]: _players => 8
	},
	[SCHEME_FRAGMENTED_REALITIES]: {
		[SCHEME_TWIST]: players => 2 * players,
		[HENCHMEN_GROUPS]: (henchmen, _players) => henchmen + 1
	},
	[SCHEME_MASTER_OF_TYRANTS]: {
		[SCHEME_TWIST]: _players => 8
	},
	[SCHEME_PAN_DIMENSIONAL_PLAGUE]: {
		[SCHEME_TWIST]: _players => 10
	},
	[SCHEME_SMASH_TWO_DIMENSIONS_TOGETHER]: {
		[SCHEME_TWIST]: _players => 8,
		[VILLAIN_GROUPS]: (villains, _players) => villains + 1
	}
});

export const manageSpecialCases = (
	additionalSets: SETS[],
	numPlayers: number,
	scheme: Scheme,
	mastermind: Mastermind,
	remainingHeroes: HeroDefinition | undefined,
	remainingVillains: VillainDefinition | undefined,
	remainingHenchmen: HenchmanDefinition | undefined
): SpecialCaseAdditions => {
	// NOTE that this set's special cases are based ONLY on cases.
	// In other sets where special cases can be based on masterminds,
	// heroes, etc., DO NOT return the object directly from within
	// the if-statement. Instead, build and extend from a
	// SpecialCaseAdditions object.
	if (scheme.scheme === SCHEME_BUILD_AN_ARMY_OF_ANNIHILATION) {
		return manageCaseBuildAnArmyOfAnnihilation(
			additionalSets,
			numPlayers,
			scheme,
			mastermind,
			remainingHeroes,
			remainingVillains,
			remainingHenchmen
		);
	} else if (scheme.scheme === SCHEME_MASTER_OF_TYRANTS) {
		return manageCaseMasterOfTyrants(
			additionalSets,
			numPlayers,
			scheme,
			mastermind,
			remainingHeroes,
			remainingVillains,
			remainingHenchmen
		);
	}

	// ELSE CASE
	return { heroes: [], villains: [], other: [] };
};

export const manageCaseBuildAnArmyOfAnnihilation = (
	additionalSets: SETS[],
	numPlayers: number,
	scheme: Scheme,
	mastermind: Mastermind,
	remainingHeroes: HeroDefinition | undefined,
	remainingVillains: VillainDefinition | undefined,
	remainingHenchmen: HenchmanDefinition | undefined
): SpecialCaseAdditions => {
	if (!_.isEmpty(remainingHenchmen)) {
		const secretWarsHenchmen = Object.keys(remainingHenchmen as HenchmanDefinition).filter(h => Object.keys(Henchmen).includes(h));
		if (secretWarsHenchmen.length > 0) {
			const index = Math.floor(Math.random() * secretWarsHenchmen.length);
			const name = secretWarsHenchmen[index];
			return { heroes: [], villains: [], other: [`KO - Henchman: ${name}`] };
		}
	}

	return { heroes: [], villains: [], other: [] };
}

export const manageCaseMasterOfTyrants = (
	additionalSets: SETS[],
	numPlayers: number,
	scheme: Scheme,
	mastermind: Mastermind,
	remainingHeroes: HeroDefinition | undefined,
	remainingVillains: VillainDefinition | undefined,
	remainingHenchmen: HenchmanDefinition | undefined
): SpecialCaseAdditions => {
	const specialCase: SpecialCaseAdditions = { heroes: [], villains: [], other: [] };

	while (specialCase.villains.length < 3) {
		const newMastermind = getMastermind(additionalSets);
		if (newMastermind !== mastermind) {
			specialCase.villains.push(`Mastermind Tactics: ${newMastermind.mastermind} x4`);
		}
	}

	return specialCase;
}
