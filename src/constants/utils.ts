import _ from 'lodash';

import {
	ALWAYS_LEADS,
	BYSTANDERS,
	HENCHMEN_GROUPS,
	HEROES,
	MASTER_STRIKE,
	NO_SINGLE_PLAYER,
	REQUIRED,
	SCHEME_TWIST,
	SETS,
	VILLAIN_GROUPS,
	Henchman,
	HenchmanDefinition,
	HenchmanStack,
	Hero,
	HeroDefinition,
	HeroStack,
	Mastermind,
	MastermindDefinition,
	Scheme,
	SchemeDefinition,
	SpecialCaseAdditions,
	Villain,
	VillainDefinition,
	VillainStack
} from './index';
import { PlayerRequirements } from './requirements';

import {
	Henchmen as CoreHenchmen,
	Heroes as CoreHeroes,
	Masterminds as CoreMasterminds,
	Schemes as CoreSchemes,
	Villains as CoreVillains
} from './sets/core';
import {
	Henchmen as SecretWarsHenchmen,
	Heroes as SecretWarsHeroes,
	Masterminds as SecretWarsMasterminds,
	Schemes as SecretWarsSchemes,
	Villains as SecretWarsVillains,
	manageSpecialCases as manageSecretWarsSpecialCases
} from './sets/secret-wars';

export const getMastermind = (usingSets: SETS[]): Mastermind => {
	const masterminds: MastermindDefinition = {};

	if (usingSets.includes(SETS.CORE)) {
		_.extend(masterminds, CoreMasterminds);
	}
	if (usingSets.includes(SETS.SECRET_WARS)) {
		_.extend(masterminds, SecretWarsMasterminds);
	}

	const numMasterminds = Object.keys(masterminds).length;
	const index = Math.floor(Math.random() * numMasterminds);
	const mastermind = Object.keys(masterminds)[index];
	const props = { ...masterminds[mastermind] };
	delete masterminds[mastermind];

	return {
		mastermind,
		props,
		remaining: masterminds
	};
};

export const getScheme = (usingSets: SETS[], numPlayers: number): Scheme => {
	const schemes: SchemeDefinition = {};

	if (usingSets.includes(SETS.CORE)) {
		_.extend(schemes, CoreSchemes);
	}
	if (usingSets.includes(SETS.SECRET_WARS)) {
		_.extend(schemes, SecretWarsSchemes);
	}

	if (numPlayers === 1) {
		for (const key of Object.keys(schemes)) {
			if (schemes[key][NO_SINGLE_PLAYER] === true) {
				delete schemes[key];
			}
		}
	}

	const numSchemes = Object.keys(schemes).length;
	const index = Math.floor(Math.random() * numSchemes);
	const scheme = Object.keys(schemes)[index];
	const props = { ...schemes[scheme] };
	delete schemes[scheme];

	return {
		scheme,
		props,
		remaining: schemes
	};
};

export const getHeroes = (
	usingSets: SETS[],
	numPlayers: number,
	scheme: Scheme
): HeroStack => {
	const heroes: HeroDefinition = {};

	if (usingSets.includes(SETS.CORE)) {
		_.extend(heroes, CoreHeroes);
	}
	if (usingSets.includes(SETS.SECRET_WARS)) {
		_.extend(heroes, SecretWarsHeroes);
	}

	let numHeroes = PlayerRequirements[numPlayers][HEROES];
	if (scheme.props[HEROES]) {
		numHeroes = scheme.props[HEROES](numHeroes, numPlayers);
	}

	const selectedHeroes: Hero[] = [];
	
	// SCHEME ADJUSTING THE NUMBER OF HEROES
	const schemeRequirement = scheme.props[REQUIRED];
	if (!_.isEmpty(_.get(schemeRequirement, HEROES))) {
		for (const hero of schemeRequirement[HEROES]) {
			const props = { ...heroes[hero] };
			selectedHeroes.push({ hero, props });
			delete heroes[hero];
			numHeroes = numHeroes - 1;
		}
	}

	while (numHeroes > 0) {
		const numRemainingHeroes = Object.keys(heroes).length;
		const index = Math.floor(Math.random() * numRemainingHeroes);
		const hero = Object.keys(heroes)[index];

		const props = { ...heroes[hero] };
		selectedHeroes.push({ hero, props });
		delete heroes[hero];
		numHeroes = numHeroes - 1;
	}

	return {
		heroes: selectedHeroes,
		remaining: heroes
	};
};

export const getVillains = (
	usingSets: SETS[],
	numPlayers: number,
	scheme: Scheme,
	mastermind: Mastermind
): VillainStack => {
	const villains: VillainDefinition = {};

	if (usingSets.includes(SETS.CORE)) {
		_.extend(villains, CoreVillains);
	}
	if (usingSets.includes(SETS.SECRET_WARS)) {
		_.extend(villains, SecretWarsVillains);
	}

	let numVillains = PlayerRequirements[numPlayers][VILLAIN_GROUPS];
	if (scheme.props[VILLAIN_GROUPS]) {
		numVillains = scheme.props[VILLAIN_GROUPS](numVillains, numPlayers);
	}

	const selectedVillains: Villain[] = [];

	// SCHEME ADJUSTING THE NUMBER OF VILLAINS
	const schemeRequirement = scheme.props[REQUIRED];
	if (!_.isEmpty(_.get(schemeRequirement, VILLAIN_GROUPS))) {
		for (const villain of schemeRequirement[VILLAIN_GROUPS]) {
			const props = { ...villains[villain] };
			selectedVillains.push({ villain, props });
			delete villains[villain];
			numVillains = numVillains - 1;
		}
	}

	// MASTERMIND'S "ALWAYS LEADS" ADJUSTING THE NUMBER OF VILLAINS
	if (numPlayers !== 1) {
		const alwaysLeads = mastermind.props[ALWAYS_LEADS];
		if (Object.keys(villains).includes(alwaysLeads)) {
			const props = { ...villains[alwaysLeads] };
			selectedVillains.push({ villain: alwaysLeads, props });
			delete villains[alwaysLeads];
			numVillains = numVillains - 1;
		}
	}

	while (numVillains > 0) {
		const numRemainingVillains = Object.keys(villains).length;
		const index = Math.floor(Math.random() * numRemainingVillains);
		const villain = Object.keys(villains)[index];

		const props = { ...villains[villain] };
		selectedVillains.push({ villain, props });
		delete villains[villain];
		numVillains = numVillains - 1;
	}

	return {
		villains: selectedVillains,
		remaining: villains
	};
};

export const getHenchmen = (
	usingSets: SETS[],
	numPlayers: number,
	scheme: Scheme,
	mastermind: Mastermind
): HenchmanStack => {
	const henchmen: HenchmanDefinition = {};

	if (usingSets.includes(SETS.CORE)) {
		_.extend(henchmen, CoreHenchmen);
	}
	if (usingSets.includes(SETS.SECRET_WARS)) {
		_.extend(henchmen, SecretWarsHenchmen);
	}

	let numHenchmen = PlayerRequirements[numPlayers][HENCHMEN_GROUPS];
	if (scheme.props[HENCHMEN_GROUPS]) {
		numHenchmen = scheme.props[HENCHMEN_GROUPS](numHenchmen, numPlayers);
	}

	const selectedHenchmen: Henchman[] = [];

	// SCHEME ADJUSTING THE NUMBER OF HENCHMEN
	const schemeRequirement = scheme.props[REQUIRED];
	if (!_.isEmpty(_.get(schemeRequirement, HENCHMEN_GROUPS))) {
		for (const henchman of schemeRequirement[HENCHMEN_GROUPS]) {
			const props = { ...henchmen[henchman] };
			selectedHenchmen.push({ henchman, props });
			delete henchmen[henchman];
			numHenchmen = numHenchmen - 1;
		}
	}

	// MASTERMIND'S "ALWAYS LEADS" ADJUSTING THE NUMBER OF HENCHMEN
	if (numPlayers !== 1) {
		const alwaysLeads = mastermind.props[ALWAYS_LEADS];
		if (Object.keys(henchmen).includes(alwaysLeads)) {
			const props = { ...henchmen[alwaysLeads] };
			selectedHenchmen.push({ henchman: alwaysLeads, props });
			delete henchmen[alwaysLeads];
			numHenchmen = numHenchmen - 1;
		}
	}

	while (numHenchmen > 0) {
		const numRemainingHenchmen = Object.keys(henchmen).length;
		const index = Math.floor(Math.random() * numRemainingHenchmen);
		const henchman = Object.keys(henchmen)[index];

		const props = { ...henchmen[henchman] };
		selectedHenchmen.push({ henchman, props });
		delete henchmen[henchman];
		numHenchmen = numHenchmen - 1;
	}

	// TELL USER THAT ONLY THREE COPIES ARE USED FOR SINGLE-PLAYER MODE
	if (numPlayers === 1) {
		for (const index in selectedHenchmen) {
			selectedHenchmen[index].henchman = `${selectedHenchmen[index].henchman} (3)`;
		}
	}

	return {
		henchmen: selectedHenchmen,
		remaining: henchmen
	};
};

export const getNumBystanders = (numPlayers: number, scheme: Scheme): number => {
	let numBystanders = PlayerRequirements[numPlayers][BYSTANDERS];
	if (scheme.props[BYSTANDERS]) {
		numBystanders = scheme.props[BYSTANDERS](numBystanders, numPlayers);
	}

	return numBystanders;
};

export const getNumSchemeTwists = (numPlayers: number, scheme: Scheme) => {
	return scheme.props[SCHEME_TWIST]();
}

export const getNumMasterStrikes = (numPlayers: number) => {
	return PlayerRequirements[numPlayers][MASTER_STRIKE];
}

export const manageSpecialCases = (
	usingSets: SETS[],
	numPlayers: number,
	scheme: Scheme,
	mastermind: Mastermind,
	remainingHeroes: HeroDefinition | undefined,
	remainingVillains: VillainDefinition | undefined,
	remainingHenchmen: HenchmanDefinition | undefined
): SpecialCaseAdditions => {
	const specialCases: SpecialCaseAdditions = {
		heroes: [],
		villains: [],
		other: []
	};

	if (Object.keys(SecretWarsSchemes).includes(scheme.scheme)) {
		const cases = manageSecretWarsSpecialCases(
			usingSets,
			numPlayers,
			scheme,
			mastermind,
			remainingHeroes,
			remainingVillains,
			remainingHenchmen
		);
		specialCases.heroes = [ ...specialCases.heroes, ...cases.heroes ];
		specialCases.villains = [ ...specialCases.villains, ...cases.villains ];
		specialCases.other = [ ...specialCases.other, ...cases.other ];
	}

	return specialCases;
}
