import {useEffect, useState} from "react"; // fui index exports are messed up -> going to src
import DiceParser from "@3d-dice/dice-parser-interface";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";

import {DiceResult} from "../components/RollResult";

import {diceBox} from "../utils";

diceBox.init({
  scale: 4,
  enableShadows: true,
  shadowOpacity: 0.6,
  delay:10,
  theme: 'default',
  themeColor: "#492563",
});
  
const DiceApp = {
  settings: {
    popupRemoteRolls: true,
  },
  DiceResults: new DisplayResults("#dice-box"),
  rollHistory: new Set(),
  latestLocalString: "",
  Dice: Dice
};

export function makeSocketEvents()
{
  DiceApp.socket.on('connectToRoom',function(data){
    console.log("Connection with Room: "+data);
    DiceApp.lobby = data;
    window.history.replaceState({room: DiceApp.lobby},DiceApp.lobby,DiceApp.lobby);
  });

  DiceApp.socket.on('otherRoll',function(diceSet){
    diceSet.isLocalRoll = false;
    console.log("received other event");
    //todo: merge with our history. Check for duplicates and so on.
    AddToHistory(diceSet);
    Object.keys(rollCompleteListeners).forEach(key => {
      if (rollCompleteListeners[key]) {
        rollCompleteListeners[key](diceSet);
      }
    });
  })
}
function AddToHistory(diceRoll)
{
  DiceApp.rollHistory.add(diceRoll);
  if(rollHistoryChangeListener) {
    rollHistoryChangeListener(DiceApp.rollHistory);
  }
}
function GetHistoryHooks()
{
  const [activeHistory, setActiveHistory] = useState([]);
  useEffect(() => {
    rollHistoryChangeListener = setActiveHistory;
    //cleanup
    return () => {
      rollHistoryChangeListener = false;
    }
  }, [DiceApp.rollHistory,setActiveHistory]);

  return [activeHistory, setActiveHistory];
}

function GetDiceHooks()
{
  const [parsedResult, setParsedResult] = useState({});

  useEffect(() => {
    rollCompleteListeners.setpr = setParsedResult;
    //cleanup
    return () => {
      delete rollCompleteListeners.setpr;
    }
  }, [setParsedResult]);
  return [parsedResult, setParsedResult];
}

Dice.onRollComplete = (results) => {
  // handle any rerolls
  const rerolls = DiceApp.DRP.handleRerolls(results);
  if (rerolls.length) {
    rerolls.forEach((roll) => Dice.add(roll, roll.groupId));
    return rerolls;
  }
  // if no re-rolls needed then parse the final results
  let finalResults = DiceApp.DRP.parseFinalResults(results);

  // show the results in the popup from Dice-UI
  // DiceApp.DiceResults.showResults(finalResults);

  //this is OUR parsed data, the DiceResult class. This is what we want to work with and send over sockets.
  DiceApp.latestResult = new DiceResult(finalResults);
  //Results data doesn't store the diceString, so we need to inject it here from a saved cache.
  DiceApp.latestResult.diceString = DiceApp.latestLocalString;
  AddToHistory(DiceApp.latestResult);
  emitLatestDiceRoll();
};

function emitLatestDiceRoll()
{
  //Inject net-related data.
  DiceApp.latestResult.room = DiceApp.lobby;//add room stamp
  DiceApp.latestResult.user = DiceApp.socket.id;
  DiceApp.latestResult.isLocalRoll = true;//gets overridden to false when pulled from remote.

  //todo: add timestamp/roll id for syncing roll history index.
  //i feel like i want to add timestamps on the server...
  //Show the results in the App RollResult

  DiceApp.socket.emit("roll",DiceApp.latestResult);

  //call all "listeners" on the "roll complete" event.
  Object.keys(rollCompleteListeners).forEach(key => {
    if (rollCompleteListeners[key]) {
      rollCompleteListeners[key](DiceApp.latestResult);
    }
  });

}

//do a local roll
const rollDice = (notation, group) => {
  // trigger the dice roll using the parser
  DiceApp.latestLocalString = notation;//We cache this then inject it into the results to hold onto.
  let parsedNotation = DiceApp.DRP.parseNotation(notation);
  Dice.show().roll(parsedNotation);
};

//function that we call when dice are done being rolled.
let rollCompleteListeners = {};
let rollHistoryChangeListener;

export {DiceApp, rollCompleteListeners, rollHistoryChangeListener, GetDiceHooks, GetHistoryHooks, rollDice};
