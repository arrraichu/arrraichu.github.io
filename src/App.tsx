import {
  Button,
  Checkbox,
  Select,
  SelectItem,
  Tag
} from '@carbon/react';
import { useCallback, useState } from 'react';
import {
  SETS,
  Henchman,
  Hero,
  Mastermind,
  Scheme,
  Villain
} from './constants';
import {
  getHenchmen,
  getHeroes,
  getMastermind,
  getNumBystanders,
  getNumMasterStrikes,
  getNumSchemeTwists,
  getScheme,
  getVillains,
  manageSpecialCases
} from './constants/utils';

import './App.scss';

function App() {
  const [additionalSets, setAdditionalSets] = useState<{ [k: string]: boolean }>({});
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [mastermind, setMastermind] = useState<Mastermind | undefined>(undefined);
  const [scheme, setScheme] = useState<Scheme | undefined>(undefined);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [villains, setVillains] = useState<Villain[]>([]);
  const [henchmen, setHenchmen] = useState<Henchman[]>([]);
  const [numberOfBystanders, setNumberOfBystanders] = useState<number>(0);
  const [numberOfTwists, setNumberOfTwists] = useState<number>(0);
  const [numberOfStrikes, setNumberOfStrikes] = useState<number>(0);

  const [additionalHeroes, setAdditionalHeroes] = useState<string[]>([]);
  const [additionalVillains, setAdditionalVillains] = useState<string[]>([]);
  const [otherCards, setOtherCards] = useState<string[]>([]);

  const onSetNumPlayers = useCallback(
    event => {
      setNumPlayers(parseInt(event.target.value))
    },
    [setNumPlayers]
  );

  const toggleAdditionalSet = useCallback(
    setName => {
      const activeSets = { ...additionalSets };
      const enabled = activeSets[setName] ?? false;
      activeSets[setName] = !enabled;

      setAdditionalSets(activeSets);
    },
    [
      additionalSets,
      setAdditionalSets
    ]
  );

  const generateGame = useCallback(
    () => {
      const usingSets = Object.keys(additionalSets).filter(s => !!additionalSets[s]) as SETS[];

      const theScheme = getScheme(usingSets, numPlayers);
      const theMastermind = getMastermind(usingSets);
      const { heroes: theHeroes, remaining: remainingHeroes } = getHeroes(usingSets, numPlayers, theScheme);
      const { villains: theVillains, remaining: remainingVillains } = getVillains(usingSets, numPlayers, theScheme, theMastermind);
      const { henchmen: theHenchmen, remaining: remainingHenchmen } = getHenchmen(usingSets, numPlayers, theScheme, theMastermind);
      const numBystanders = getNumBystanders(numPlayers, theScheme);
      const numTwists = getNumSchemeTwists(numPlayers, theScheme);
      const numStrikes = getNumMasterStrikes(numPlayers);

      const { heroes: addHeroes, villains: addVillains, other: addOther } = manageSpecialCases(
        usingSets,
        numPlayers,
        theScheme,
        theMastermind,
        remainingHeroes,
        remainingVillains,
        remainingHenchmen
      );

      setScheme(theScheme);
      setMastermind(theMastermind);
      setHeroes(theHeroes);
      setVillains(theVillains);
      setHenchmen(theHenchmen);
      setNumberOfBystanders(numBystanders);
      setNumberOfTwists(numTwists);
      setNumberOfStrikes(numStrikes);

      setAdditionalHeroes(addHeroes);
      setAdditionalVillains(addVillains);
      setOtherCards(addOther);
    },
    [
      additionalSets,
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

      <div className="App__center-container checkbox-list">
        <Checkbox id="core-set" checked disabled labelText="Core set (default)" />
        {Object.values(SETS).filter(set => set !== SETS.CORE).map(set => {
          return (
            <Checkbox
              key={set.toLowerCase()}
              id={set.toLowerCase().replace(' ', '-')}
              labelText={set}
              enabled={(additionalSets[set] ?? false).toString()}
              onClick={() => toggleAdditionalSet(set)}/>
          );
        })}
      </div>

      <div className="App__center-container num-players">
        <Select
          defaultValue="1"
          helperText=""
          id="num-players"
          labelText="Number of players"
          inline
          onChange={onSetNumPlayers}>
          {[1, 2, 3, 4, 5].map((item) => {
            return (
              <SelectItem key={`select-${item.toString()}-players`} text={item.toString()} value={item.toString()} />
            );
          })}
        </Select>
      </div>

      <div className="App__center-container">
        <Button size="md" onClick={generateGame}>
          Generate
        </Button>
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Mastermind</div>
        <div className="App__bordered-horizontal-content--body">{mastermind ? mastermind.mastermind ?? '???' : '???'}</div>
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Scheme</div>
        <div className="App__bordered-horizontal-content--body">{scheme ? scheme.scheme ?? '???' : '???'}</div>
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Hero Deck</div>
        {heroes.map((hero, index) => {
          return (
            <Tag key={`hero-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{hero.hero}</Tag>
          );
        })}
        {additionalHeroes.map((hero, index) => {
          return (
            <Tag key={`add-hero-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{hero}</Tag>
          );
        })}
      </div>

      <div className="App__bordered-horizontal-content">
        <div className="App__bordered-horizontal-content--title">Villain Deck</div>
        {villains.map((villain, index) => {
          return (
            <Tag key={`villain-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{villain.villain}</Tag>
          );
        })}
        {henchmen.map((henchman, index) => {
          return (
            <Tag key={`henchman-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{`Henchman: ${henchman.henchman}`}</Tag>
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
        {additionalVillains.map((villain, index) => {
          return (
            <Tag key={`add-villain-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{villain}</Tag>
          );
        })}      
      </div>
      {otherCards.length === 0 ? <></> :
        <div className="App__bordered-horizontal-content">
          <div className="App__bordered-horizontal-content--title">Other Cards</div>
          {otherCards.map((name, index) => {
            return (
              <Tag key={`other-card-${index}`} className="App__bordered-horizontal-content--body" type="cool-gray">{name}</Tag>
            );
          })}
        </div>
      }
    </div>
  );
}

export default App;
