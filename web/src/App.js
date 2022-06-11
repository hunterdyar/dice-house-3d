import DiceChoiceTable from './components/diceSelection/DiceChoiceTable.js';
import {Container, Grid, Typography} from "@mui/material";
import './App.css';
import {useEffect, useState} from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";
import {RollResultDisplay, DiceResult} from "./components/RollResult";
import RollHistoryList from "./components/rollHistory/rollHistorylist";
import RollTable from "./components/diceSelection/rollTable";
import {rollCompleteListener, GetDiceHooks, rollDice} from "./roomLogic/diceEvents";

const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});
// create Dice Roll Parser to handle complex notations
// create display overlay for final results


// trigger dice roll

    // console.log(finalResults);

export default function App() {

  const [parsedResult, setParsedResult] = GetDiceHooks();

  //Todo: This is getting called twice.
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
          <RollTable roll={rollDice}/>
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
