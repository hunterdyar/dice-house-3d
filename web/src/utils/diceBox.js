import DiceBox from "@3d-dice/dice-box";
import DiceParser from "@3d-dice/dice-parser-interface";

import "./diceBox.css";

let containerElm;
const containerId = "dice-box-container";

let diceInstance;
let parser;

const warnFn = () => console.warn("Must init dicebox");
let output = {
    updateConfig: warnFn,
    clear: warnFn,
    roll: warnFn
}

let updateConfig = warnFn;
let clear = warnFn;
let roll = warnFn;
export function init(config) {
    if (!containerElm) {
        const existingContainer = document.getElementById(containerId);
        if (existingContainer) {
            containerElm = existingContainer;
        } else {
            containerElm = document.createElement("div");
            containerElm.id = containerId;
            document.body.appendChild(containerElm);
        }
        existingContainer.addEventListener("mousedown", () => {
            console.log("dice-box-container click");
        });
    }
    if (!diceInstance) {
        diceInstance = new DiceBox(`#${containerId}`, config);
    } else {
        diceInstance.updateConfig(config);
    }
    if (!parser) {
        parser = new DiceParser();
    }   
    
    updateConfig = function(config) {
        diceInstance.updateConfig(config);
    };

    clear = function() {
diceInstance.hide().clear();
    };

    // TODO: See if this is correct
    async function rerollIfNeeded(results) {
        const rerolls = parser.handleRerolls(results);
        if (Array.isArray(rerolls) && rerolls.length > 0) {
            const nextResults = await diceInstance.reroll(rerolls);
            return rerollIfNeeded(nextResults);
        }
    }

    roll = async function(input) {
        const parsed = parser.parseNotation(input);
        const initialResults = await diceInstance.show().roll(parsed);
        await rerollIfNeeded(initialResults);

        const finalReults = diceInstance.getRollResults();
        return parser.parseFinalResults(finalReults);
    }
};

export {
    updateConfig,
    clear,
    roll
};

