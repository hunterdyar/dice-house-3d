import React, {useState} from "react";

import {Container, Grid, Button} from "@mui/material";

import { DiceInput, DiceCanvas, DiceResults } from "./components";

import {useWebhookRoom} from "../hooks"

const StandardPage = () => {
    console.log("Standard page rendered");
    const [overlay, setOverlay] = useState(false);

    const {input, setInput, results, addResults} = useWebhookRoom();
    // TODO: Confirm structure
    return (
        <Container fixed>
            <Button onClick={() => setOverlay(val => !val)}>{overlay ? "overlay OFF" : "overlay ON"}</Button>
    <Grid container spacing={2}>
        <Grid item xs="auto">
            <DiceInput val={input} onChange={val => setInput(val)} />
        </Grid>
        <Grid item xs sx={{height: 500}}>
            <DiceCanvas input={input} overlay={overlay} onResults={results => console.log(results) }/>
        </Grid>
    </Grid>
    <Button onClick={() => {addResults("2d20: so much, like a lot"); setInput(""); }}>Add the result</Button>
    <DiceResults results={results}/>
    </Container>);
}

export default StandardPage;