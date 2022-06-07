import React, {useState, useEffect, useCallback, useMemo} from "react";
import DiceBox from "@3d-dice/dice-box";

import {Box} from "@mui/material"


const DiceCanvas = ({input, config, onResults, overlay}) => {
    const [diceBox, setDiceBox] = useState();

    const onMountRef = useCallback(async (node) => {
        const dice = new DiceBox(node && node.id && `#${node.id}`, config);
        await dice.init();
        setDiceBox(dice);
    }, []);

    // update config from prop change
    useEffect(() => {
        // TODO: debug and see if the current config can be viewed to check for changes
        // otherwise will current re-apply the config on new dicebox
        if (diceBox) {
            diceBox.updateConfig(config);
        }
    }, [diceBox, config]);

    useEffect(() => {
        if (diceBox) {
            if (input) {
                diceBox.roll(input).then(results => onResults(results));
            } else {
                // if input falsy, assume resetting the view
                diceBox.clear();
            }
        }
    }, [diceBox, input]);



    const useSx = useMemo(() => {
        // default values: fill container space, but not full screen
        const output =  {
            width: "100%", 
            height: "100%", 
            position: "relative", 
            "> canvas": {
                position: "absolute",
                zIndex: 99,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            }
        };
        if (overlay) {
            Object.assign(output, {
                pointerEvents: "none",
                position: "fixed",
                top: 0,
                left: 0
            });
        }
        return output;
    }, [overlay]);


    return <Box id="dice-box-div" ref={onMountRef} sx={useSx}/>
}
export default DiceCanvas;