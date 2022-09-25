import * as freeze from 'deep-freeze';

import {
	ALWAYS_LEADS,
	BYSTANDERS,
	HEROES,
	HENCHMEN_GROUPS,
	NO_SINGLE_PLAYER,
	REQUIRED,
	SCHEME_TWIST,
	VILLAIN_GROUPS,
	HenchmanDefinition,
	HeroDefinition,
	MastermindDefinition,
	SchemeDefinition,
	VillainDefinition
} from '../index';

const HERO_EMMA_FROST = 'Emma Frost';
const HERO_THOR = 'Thor';
const HERO_BLACK_WIDOW = 'Black Widow';
const HERO_GAMBIT = 'Gambit';
const HERO_CAPTAIN_AMERICA = 'Captain America';
const HERO_WOLVERINE = 'Wolverine';
const HERO_NICK_FURY = 'Nick Fury';
const HERO_ROGUE = 'Rogue';
const HERO_DEADPOOL = 'Deadpool';
const HERO_CYCLOPS = 'Cyclops';
const HERO_HAWKEYE = 'Hawkeye';
const HERO_STORM = 'Storm';
const HERO_HULK = 'Hulk';
const HERO_IRON_MAN = 'Iron Man';
const HERO_SPIDER_MAN = 'Spider-Man';

export const Heroes: HeroDefinition = freeze({
	[HERO_EMMA_FROST]: {},
	[HERO_THOR]: {},
	[HERO_BLACK_WIDOW]: {},
	[HERO_GAMBIT]: {},
	[HERO_CAPTAIN_AMERICA]: {},
	[HERO_WOLVERINE]: {},
	[HERO_NICK_FURY]: {},
	[HERO_ROGUE]: {},
	[HERO_DEADPOOL]: {},
	[HERO_CYCLOPS]: {},
	[HERO_HAWKEYE]: {},
	[HERO_STORM]: {},
	[HERO_HULK]: {},
	[HERO_IRON_MAN]: {},
	[HERO_SPIDER_MAN]: {}
});

const VILLAIN_HYDRA = 'HYDRA';
const VILLAIN_SPIDER_FOES = 'Spider-Foes';
const VILLAIN_BROTHERHOOD = 'Brotherhood';
const VILLAIN_RADIATION = 'Radiation';
const VILLAIN_MASTERS_OF_EVIL = 'Masters of Evil';
const VILLAIN_ENEMIES_OF_ASGARD = 'Enemies of Asgard';
const VILLAIN_SKRULLS = 'Skrulls';

export const Villains: VillainDefinition = freeze({
	[VILLAIN_HYDRA]: {},
	[VILLAIN_SPIDER_FOES]: {},
	[VILLAIN_BROTHERHOOD]: {},
	[VILLAIN_RADIATION]: {},
	[VILLAIN_MASTERS_OF_EVIL]: {},
	[VILLAIN_ENEMIES_OF_ASGARD]: {},
	[VILLAIN_SKRULLS]: {}
});

const HENCHMEN_HAND_NINJAS = 'Hand Ninjas';
const HENCHMEN_DOOMBOT_LEGION = 'Doombot Legion';
const HENCHMEN_SENTINEL = 'Sentinel';
const HENCHMEN_SAVAGE_LAND_MUTATES = 'Savage Land Mutates';

export const Henchmen: HenchmanDefinition = freeze({
	[HENCHMEN_HAND_NINJAS]: {},
	[HENCHMEN_DOOMBOT_LEGION]: {},
	[HENCHMEN_SENTINEL]: {},
	[HENCHMEN_SAVAGE_LAND_MUTATES]: {}
});

const MASTERMIND_RED_SKULL = 'Red Skull';
const MASTERMIND_LOKI = 'Loki';
const MASTERMIND_MAGNETO = 'Magneto';
const MASTERMIND_DR_DOOM = 'Dr. Doom';

export const Masterminds: MastermindDefinition = freeze({
	[MASTERMIND_RED_SKULL]: {
		[ALWAYS_LEADS]: VILLAIN_HYDRA
	},
	[MASTERMIND_LOKI]: {
		[ALWAYS_LEADS]: VILLAIN_ENEMIES_OF_ASGARD
	},
	[MASTERMIND_MAGNETO]: {
		[ALWAYS_LEADS]: VILLAIN_BROTHERHOOD
	},
	[MASTERMIND_DR_DOOM]: {
		[ALWAYS_LEADS]: HENCHMEN_DOOMBOT_LEGION
	}
});

const SCHEME_THE_LEGACY_VIRUS = 'The Legacy Virus';
const SCHEME_SUPER_HERO_CIVIL_WAR = 'Super Hero Civil War';
const SCHEME_NEGATIVE_ZONE_PRISON_BREAKOUT = 'Negative Zone Prison Breakout';
const SCHEME_REPLACE_EARTHS_LEADERS_WITH_KILLBOTS = 'Replace Earth\'s Leaders with Killbots';
const SCHEME_PORTALS_TO_THE_DARK_DIMENSION = 'Portals to the Dark Dimension';
const SCHEME_UNLEASH_THE_POWER_OF_THE_COSMIC_CUBE = 'Unleash the Power of the Cosmic Cube';
const SCHEME_SECRET_INVASION_OF_THE_SKRULL_SHAPESHIFTERS = 'Secret Invasion of the Skrull Shapeshifters';
const SCHEME_MIDTOWN_BANK_ROBBERY = 'Midtown Bank Robbery';

export const Schemes: SchemeDefinition = freeze({
	[SCHEME_THE_LEGACY_VIRUS]: {
		[SCHEME_TWIST]: _players => 8
	},
	[SCHEME_SUPER_HERO_CIVIL_WAR]: {
		[SCHEME_TWIST]: players => players <= 3 ? 8 : 5,
		[NO_SINGLE_PLAYER]: true,
		[HEROES]: (heroes, players) => players === 2 ? 4 : heroes
	},
	[SCHEME_NEGATIVE_ZONE_PRISON_BREAKOUT]: {
		[SCHEME_TWIST]: _players => 8,
		[NO_SINGLE_PLAYER]: true,
		[HENCHMEN_GROUPS]: henchmen => henchmen + 1
	},
	[SCHEME_REPLACE_EARTHS_LEADERS_WITH_KILLBOTS]: {
		[SCHEME_TWIST]: _players => 5,
		[BYSTANDERS]: () => 18
	},
	[SCHEME_PORTALS_TO_THE_DARK_DIMENSION]: {
		[SCHEME_TWIST]: _players => 7
	},
	[SCHEME_UNLEASH_THE_POWER_OF_THE_COSMIC_CUBE]: {
		[SCHEME_TWIST]: _players => 8
	},
	[SCHEME_SECRET_INVASION_OF_THE_SKRULL_SHAPESHIFTERS]: {
		[SCHEME_TWIST]: _players => 8,
		[HEROES]: _heroes => 6,
		[REQUIRED]: {
			[VILLAIN_GROUPS]: [VILLAIN_SKRULLS]
		}
	},
	[SCHEME_MIDTOWN_BANK_ROBBERY]: {
		[SCHEME_TWIST]: _players => 8,
		[BYSTANDERS]: () => 12
	}
});
