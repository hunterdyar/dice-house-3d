import DiceChoiceTable from './DiceChoiceTable.js';
import {Container, Grid, Typography} from "@mui/material";
//
import DisplayResults from "@3d-dice/dice-ui/src/displayResults"; // fui index exports are messed up -> going to src
import DiceParser from "@3d-dice/dice-parser-interface";
import { Dice } from "./components/diceBox";
import './App.css';
import {useEffect, useState} from "react";
import RollResult from "./RollResult";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";
import {RollResultDisplay, DiceResult} from "./RollResult";
import RollHistoryList from "./rollHistorylist";

const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
// create Dice Roll Parser to handle complex notations
const DRP = new DiceParser();
// create display overlay for final results
const DiceResults = new DisplayResults("#dice-box");
// initialize the Dice Box outside of the component
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
            DiceResults.clear();
        }
    });
});

// trigger dice roll
const rollDice = (notation, group) => {
    // trigger the dice roll using the parser
    let parsedNotation = DRP.parseNotation(notation);
    Dice.show().roll(parsedNotation);
    console.log(notation,parsedNotation);
};
let rollCompleteListener;
Dice.onRollComplete = (results) => {
    // handle any rerolls
    const rerolls = DRP.handleRerolls(results);
    if (rerolls.length) {
        rerolls.forEach((roll) => Dice.add(roll, roll.groupId));
        return rerolls;
    }

  // if no re-rolls needed then parse the final results
  let finalResults = DRP.parseFinalResults(results);
    // show the results in the popup from Dice-UI
    DiceResults.showResults(finalResults);

    //Show the results in the App RollResult
    if(rollCompleteListener)
    {
        rollCompleteListener(new DiceResult(finalResults));
    }
    // console.log(finalResults);
};

export default function App() {
  const [parsedResult, setParsedResult] = useState({});
  //const [results, setResults] = useState({});
  useEffect(() => {
    rollCompleteListener = setParsedResult;

    //cleanup
    return () => {
      rollCompleteListener = false;
    }
  }, [setParsedResult]);

  //Todo: This is getting called twice.
  console.log("find breakpoint lol");
  //todo: Theme provider to theme entire page.
  return (
    <Container className="App">
      <Grid container>
        <Grid item xs={12}>
          <header className="App-header">
            <Typography variant="h1">Dice House</Typography>
          </header>
        </Grid>
        <Grid item xs={6}>
          <DiceChoiceTable onRoll={rollDice}/>
          <RollResultDisplay result={parsedResult}/>
        </Grid>
        <Grid item xs={6}>
          <RollHistoryList/>
        </Grid>
      </Grid>
      {/*<RollResultDialogue result={parsedResult}/>*/}
    </Container>
  );
}
