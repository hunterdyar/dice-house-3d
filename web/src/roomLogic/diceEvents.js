import { Dice } from "../components/diceBox";
import DiceParser from "@3d-dice/dice-parser-interface";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults";
import {DiceResult} from "../components/RollResult";
import {useEffect, useState} from "react"; // fui index exports are messed up -> going to src


const DiceApp = {};
DiceApp.DRP = new DiceParser();
DiceApp.DiceResults = new DisplayResults("#dice-box");
DiceApp.rollHistory = new Set();//set cant have duplicates.
DiceApp.latestLocalString = "";//It's important that this is local only, so it stays in sync between rolls and their respective strings.
//when does this function run?
DiceApp.Dice = Dice;
Dice.init().then(() => {
  Dice.updateConfig({
    scale: 4,
    enableShadows: true,
    shadowOpacity: 0.6,
    delay:10,
    theme: 'default',
    themeColor: "#492563",
  });

  // clear dice on click anywhere on the screen
  window.addEventListener("mousedown", () => {
    const diceBoxCanvas = document.getElementById("dice-canvas");
    if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
      Dice.hide().clear();
      DiceApp.DiceResults.clear();
    }
  });
});

export function makeSocketEvents()
{
  DiceApp.socket.on('connectToRoom',function(data){
    console.log("Connection with Room: "+data);
    DiceApp.lobby = data;
    window.history.replaceState({room: DiceApp.lobby},DiceApp.lobby,DiceApp.lobby);
  });

  DiceApp.socket.on('otherRoll',function(diceSet){
    console.log("received other event");
    //todo: merge with our history. Check for duplicates and so on.
    AddToHistory(diceSet);
    if (rollCompleteListener) {
      rollCompleteListener(diceSet);
    }
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
    rollCompleteListener = setParsedResult;
    //cleanup
    return () => {
      rollCompleteListener = false;
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
  DiceApp.DiceResults.showResults(finalResults);

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

  //todo: add timestamp/roll id for syncing roll history index.
  //i feel like i want to add timestamps on the server...
  //Show the results in the App RollResult

  DiceApp.socket.emit("roll",DiceApp.latestResult);

  if (rollCompleteListener) {
    rollCompleteListener(DiceApp.latestResult);
  }

}

//do a local roll
const rollDice = (notation, group) => {
  // trigger the dice roll using the parser
  DiceApp.latestLocalString = notation;//We cache this then inject it into the results to hold onto.
  let parsedNotation = DiceApp.DRP.parseNotation(notation);
  Dice.show().roll(parsedNotation);
};

//function that we call when dice are done being rolled.
let rollCompleteListener;
let rollHistoryChangeListener;

export {DiceApp, rollCompleteListener, rollHistoryChangeListener, GetDiceHooks, GetHistoryHooks, rollDice};
