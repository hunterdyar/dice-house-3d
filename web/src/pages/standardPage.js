import React from "react";

import { DiceInput, DiceCanvas, DiceResults } from "./components";

const StandardPage = () => {
    // TODO: Confirm structure
    return (<div>
        <DiceInput/>
        <DiceCanvas/>
        <DiceResults/>
    </div>);
}

export default StandardPage;