import {
  Button,
  Checkbox,
  Select,
  SelectItem,
  Tag
} from '@carbon/react';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import {
  ALWAYS_LEADS,
  BYSTANDERS,
  HENCHMEN_GROUPS,
  HEROES,
  MASTER_STRIKE,
  NO_SINGLE_PLAYER,
  REQUIRED,
  SCHEME_TWIST,
  VILLAIN_GROUPS
} from './constants';
import { PlayerRequirements } from './constants/requirements';
import { Heroes, Villains, Henchmen, Masterminds, Schemes } from './constants/sets/core';

import './App.scss';

function App() {
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [mastermind, setMastermind] = useState<string>('');
  const [scheme, setScheme] = useState<string>('');
  const [heroes, setHeroes] = useState<string[]>([]);
  const [villains, setVillains] = useState<string[]>([]);
  const [numberOfBystanders, setNumberOfBystanders] = useState<number>(0);
  const [numberOfTwists, setNumberOfTwists] = useState<number>(0);
  const [numberOfStrikes, setNumberOfStrikes] = useState<number>(0);

  const sanitizeString = s => s !== '' ? s : '???';

  const onSetNumPlayers = useCallback(
    event => {
      setNumPlayers(parseInt(event.target.value))
    },
    [setNumPlayers]
  );

  const generateGame = useCallback(
    () => {
      const filteredSchemes = _.cloneDeep(Schemes);
      if (numPlayers === 1) {
        for (const key of Object.keys(filteredSchemes)) {
          if (filteredSchemes[key][NO_SINGLE_PLAYER] === true) {
            delete filteredSchemes[key];
          }
        }
      }

      const numSchemes = 
        Object.keys(filteredSchemes).length;
      const schemeIndex = Math.floor(Math.random() * numSchemes);
      const theScheme = Object.keys(filteredSchemes)[schemeIndex]
      setScheme(theScheme);
      const schemeProps = Schemes[theScheme];

      const numMasterminds = Object.keys(Masterminds).length;
      const mastermindIndex = Math.floor(Math.random() * numMasterminds);
      const theMastermind = Object.keys(Masterminds)[mastermindIndex]
      setMastermind(theMastermind);
      const mastermindProps = Masterminds[theMastermind];

      let numHeroes = PlayerRequirements[numPlayers][HEROES];
      if (schemeProps[HEROES]) {
        numHeroes = schemeProps[HEROES](numHeroes, numPlayers);
      }

      let numVillains = PlayerRequirements[numPlayers][VILLAIN_GROUPS];
      if (schemeProps[VILLAIN_GROUPS]) {
        numVillains = schemeProps[VILLAIN_GROUPS](numVillains, numPlayers);
      }

      let numHenchmen = PlayerRequirements[numPlayers][HENCHMEN_GROUPS];
      if (schemeProps[HENCHMEN_GROUPS]) {
        numHenchmen = schemeProps[HENCHMEN_GROUPS](numHenchmen, numPlayers);
      }

      let numBystanders = PlayerRequirements[numPlayers][BYSTANDERS];
      if (schemeProps[BYSTANDERS]) {
        numBystanders = schemeProps[BYSTANDERS](numBystanders, numPlayers);
      }

      const numTwists = schemeProps[SCHEME_TWIST]();

      const numStrikes = PlayerRequirements[numPlayers][MASTER_STRIKE];

      const theHeroes : string[] = [];
      const remainingHeroes = _.cloneDeep(Heroes);

      const theVillains : string[] = [];
      const remainingVillains = _.cloneDeep(Villains);

      const theHenchmen : string[] = [];
      const remainingHenchmen = _.cloneDeep(Henchmen);

      const schemeRequirement = schemeProps[REQUIRED];
      if (!_.isEmpty(schemeRequirement)) {
        if (!_.isEmpty(schemeRequirement[HEROES])) {
          for (const theHero of schemeRequirement[HEROES]) {
            theHeroes.push(theHero);
            delete remainingHeroes[theHero];
            numHeroes = numHeroes - 1;
          }
        } else if (!_.isEmpty(schemeRequirement[VILLAIN_GROUPS])) {
          for (const theVillain of schemeRequirement[VILLAIN_GROUPS]) {
            theVillains.push(theVillain);
            delete remainingVillains[theVillain];
            numVillains = numVillains - 1;
          }
        } else if (!_.isEmpty(schemeRequirement[HENCHMEN_GROUPS])) {
          for (const theHenchman of schemeRequirement[HENCHMEN_GROUPS]) {
            theHenchmen.push(theHenchman);
            delete remainingHenchmen[theHenchman];
            numHenchmen = numHenchmen - 1;
          }
        }
      }

      const alwaysLeads = mastermindProps[ALWAYS_LEADS];
      if (Object.keys(Villains).includes(alwaysLeads)) {
        theVillains.push(alwaysLeads);
        delete remainingVillains[alwaysLeads];
        numVillains = numVillains - 1;
      } else if (Object.keys(Henchmen).includes(alwaysLeads)) {
        theHenchmen.push(alwaysLeads);
        delete remainingHenchmen[alwaysLeads];
        numHenchmen = numHenchmen - 1;
      }

      while (numHeroes > 0) {
        const numRemainingHeroes = Object.keys(remainingHeroes).length;
        const heroIndex = Math.floor(Math.random() * numRemainingHeroes);
        const theHero = Object.keys(remainingHeroes)[heroIndex];

        theHeroes.push(theHero);
        delete remainingHeroes[theHero];
        numHeroes = numHeroes - 1;
      }
      setHeroes(theHeroes);

      while (numVillains > 0) {
        const numRemainingVillains = Object.keys(remainingVillains).length;
        const villainIndex = Math.floor(Math.random() * numRemainingVillains);
        const theVillain = Object.keys(remainingVillains)[villainIndex];

        theVillains.push(theVillain);
        delete remainingVillains[theVillain];
        numVillains = numVillains - 1;
      }

      while (numHenchmen > 0) {
        const numRemainingHenchmen = Object.keys(remainingHenchmen).length;
        const henchmanIndex = Math.floor(Math.random() * numRemainingHenchmen);
        const theHenchman = Object.keys(remainingHenchmen)[henchmanIndex];

        theHenchmen.push(theHenchman);
        delete remainingHenchmen[theHenchman];
        numHenchmen = numHenchmen - 1;
      }

      const allVillains = [ ...theVillains, ...theHenchmen.map(h => `Henchmen: ${h}`)];
      setVillains(allVillains);

      setNumberOfBystanders(numBystanders);
      setNumberOfTwists(numTwists);
      setNumberOfStrikes(numStrikes);
    },
    [
      numPlayers,
      setHeroes,
      setMastermind,
      setNumberOfBystanders,
      setScheme
    ]
  );

  return (
    <div className="App">
      <div className="App__center-container">
        <h1 className="header">
          Marvel Legendary Generator
        </h1>
      </div>

      <div className="App__center-container">
        <Checkbox id="core-set" checked disabled labelText="Core set (default)" />
      </div>

      <div className="App__center-container num-players">
        <Select
          defaultValue="1"
          helperText=""
          id="num-players"
          labelText="Number of players"
          inline
          onChange={onSetNumPlayers}>
          <SelectItem text="1" value="1" />
          <SelectItem text="2" value="2" />
          <SelectItem text="3" value="3" />
          <SelectItem text="4" value="4" />
          <SelectItem text="5" value="5" />
        </Select>
      </div>

      <div className="App__center-container">
        <Button size="md" onClick={generateGame}>
          Generate
        </Button>
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Mastermind</div>
        <div className="App__bordered-horizontal-content--body">{sanitizeString(mastermind)}</div>
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Scheme</div>
        <div className="App__bordered-horizontal-content--body">{sanitizeString(scheme)}</div>
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Hero Deck</div>
        {heroes.map((hero, index) => {
          return (
            <Tag key={`hero-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{hero}</Tag>
          );
        })}
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Villain Deck</div>
        {villains.map((villain, index) => {
          return (
            <Tag key={`villain-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{villain}</Tag>
          );
        })}
        {numberOfTwists > 0 ?
          <Tag key="scheme-twists" className="App__bordered-horizontal-content--body" type="cool-gray">{`Scheme Twists x ${numberOfTwists}`}</Tag>
          : <></>
        }
        {numberOfStrikes > 0 ?
          <Tag key="master-strikes" className="App__bordered-horizontal-content--body" type="cool-gray">{`Master Strikes x ${numberOfStrikes}`}</Tag>
          : <></>
        }
        {numberOfBystanders > 0 ?
          <Tag key="bystanders" className="App__bordered-horizontal-content--body" type="cool-gray">{`Bystanders x ${numberOfBystanders}`}</Tag>
          : <></>
        }       
      </div>
    </div>
  );
}

export default App;
