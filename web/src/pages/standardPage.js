import React, {useState, useEffect} from "react";

import {Container, Button} from "@mui/material";

import { DiceInput, DiceResults } from "./components";

import {useWebhookRoom} from "../hooks";

import { diceBox } from "../utils";

const StandardPage = () => {
    useEffect(() => {
        // start the init process
        diceBox.init();
    }, []);
    
    console.log("Standard page rendered");
    const [overlay, setOverlay] = useState(false);

    const {input, setInput, results, addResults} = useWebhookRoom();

    useEffect(() => {
        if (!input) {
            diceBox.clear();
        } else {
            diceBox.rollDice(input).then(results => console.log("Results: ", results));
        }

    }, [input]);
    // TODO: Confirm structure
    return (
        <Container fixed>
            <Button onClick={() => setOverlay(val => !val)}>{overlay ? "overlay OFF" : "overlay ON"}</Button>
   
            <DiceInput val={input} onChange={val => setInput(val)} />
        
    <Button onClick={() => {addResults("2d20: so much, like a lot"); setInput(""); }}>Add the result</Button>
    <DiceResults results={results}/>
    </Container>);
}

export default StandardPage;