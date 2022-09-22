import {
  Button,
  Checkbox,
  Select,
  SelectItem,
  Tag
} from '@carbon/react';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { ALWAYS_LEADS, HEROES, VILLAIN_GROUPS, HENCHMEN_GROUPS } from './constants';
import { PlayerRequirements } from './constants/requirements';
import { Heroes, Villains, Henchmen, Masterminds, Schemes } from './constants/sets/core';

import './App.scss';

function App() {
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [mastermind, setMastermind] = useState<string>('');
  const [scheme, setScheme] = useState<string>('');
  const [heroes, setHeroes] = useState<string[]>([]);
  const [villains, setVillains] = useState<string[]>([]);
  // const [villainGroups, setVillainGroups] = useState<string[]>([]);

  const sanitizeString = s => s !== '' ? s : '???';

  const onSetNumPlayers = useCallback(
    event => {
      setNumPlayers(parseInt(event.target.value))
    },
    [setNumPlayers]
  );

  const generateGame = useCallback(
    () => {
      const numSchemes = Object.keys(Schemes).length;
      const schemeIndex = Math.floor(Math.random() * numSchemes);
      const theScheme = Object.keys(Schemes)[schemeIndex]
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
        numVillains = schemeProps[HENCHMEN_GROUPS](numHenchmen, numPlayers);
      }

      const theHeroes : string[] = [];
      const remainingHeroes = _.cloneDeep(Heroes);

      const theVillains : string[] = [];
      const remainingVillains = _.cloneDeep(Villains);

      const theHenchmen : string[] = [];
      const remainingHenchmen = _.cloneDeep(Henchmen);

      const alwaysLeads = mastermindProps[ALWAYS_LEADS];
      if (Object.keys(Villains).includes(alwaysLeads)) {
        theVillains.push(alwaysLeads);
        delete remainingVillains[alwaysLeads];
        numVillains = numVillains - 1;
      } else if (Object.keys(Henchmen).includes(alwaysLeads)) {
        theVillains.push(alwaysLeads);
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
    },
    [
      numPlayers,
      setHeroes,
      setMastermind,
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
      </div>
    </div>
  );
}

export default App;
