export const NO_SINGLE_PLAYER = 'no_single_player';
export const REQUIRED = 'required';

export const HEROES = 'Heroes';
export const VILLAIN_GROUPS = 'Villain Groups';
export const HENCHMEN_GROUPS = 'Henchmen Groups';
export const BYSTANDERS = 'Bystanders';
export const SIDEKICKS = 'Sidekicks';

export const ALWAYS_LEADS = 'Always Leads';
export const MASTER_STRIKE = 'Master Strike';
export const SCHEME_TWIST = 'Scheme Twist';
export const WOUND = 'Wound';

export enum SETS {
	CORE = 'Core Set (default)',
	SECRET_WARS = 'Secret Wars'
};

export type Properties = string | {
	[k: string]: any
};

export type Mastermind = {
	mastermind: string,
	props: Properties,
	remaining?: MastermindDefinition
};

export type Scheme = {
	scheme: string,
	props: Properties,
	remaining?: SchemeDefinition
};

export type Hero = {
	hero: string,
	props: Properties
};

export type HeroStack = {
	heroes: Hero[],
	remaining?: HeroDefinition
};

export type Villain = {
	villain: string,
	props: Properties
};

export type VillainStack = {
	villains: Villain[],
	remaining?: VillainDefinition
};

export type Henchman = {
	henchman: string,
	props: Properties
};

export type HenchmanStack = {
	henchmen: Henchman[],
	remaining?: HenchmanDefinition
};

export type MastermindDefinition = {
	[name: string]: {
		'Always Leads': string
	}
};

export type SchemeDefinition = {
	[name: string]: {
		'Scheme Twist': (p: number) => number,
		'no_single_player'?: boolean,
		'Heroes'?: (h: number, p: number) => number,
		'Villain Groups'?: (v: number, p: number) => number,
		'Henchmen Groups'?: (h: number, p: number) => number,
		'Bystanders'?: () => number,
		'Sidekicks'?: () => number,
		required?: {
			'Heroes'?: string[],
			'Villain Groups'?: string[],
			'Henchmen Groups'?: string[]
		}
	}
};

export type HeroDefinition = {
	[name: string]: Object
};

export type VillainDefinition = {
	[name: string]: Object
};

export type HenchmanDefinition = {
	[name: string]: Object
};

export type SpecialCaseAdditions = {
	heroes: string[],
	villains: string[],
	other: string[]
}
