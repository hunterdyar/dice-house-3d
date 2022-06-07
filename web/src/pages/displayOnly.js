import React from "react";

import { DiceCanvas } from "./components";
import {useWebhookRoom} from "../hooks"

const DisplayPage = () => {
    const {input} = useWebhookRoom();
    // TODO: Confirm structure
    return (
    <>
        <DiceCanvas input={input} onResults={results => console.log(results) }/>
    </>
    );       
};

export default DisplayPage;