import DiceBox from "@3d-dice/dice-box";
import DiceParser from "@3d-dice/dice-parser-interface";

import "./diceBox.css";

let containerElm;
const containerId = "dice-box-container";

function initContainer() {
    if (!containerElm) {
        const existingContainer = document.getElementById(containerId);
        if (existingContainer) {
            // make sure there aren't children existing (probably just from re-renders)
            while (existingContainer.firstChild) {
                existingContainer.removeChild(existingContainer.firstChild);
              }
            containerElm = existingContainer;

        } else {
            containerElm = document.createElement("div");
            containerElm.id = containerId;
            document.body.appendChild(containerElm);
        }
    }
}

export function addOnClick(...args) {
    initContainer();
    containerElm.addEventListener("mousedown", ...args);
}
export function removeClickListner(...args) {
    initContainer();
    containerElm.removeClickListner("mousedown", ...args);
}

let diceInstance;
let parser;
let initPromise;
export function init(config) {
    initContainer();
    if (!parser) {
        parser = new DiceParser();
    } 
    let newInstance = !diceInstance;
    if (newInstance) {
        diceInstance = new DiceBox(`#${containerId}`, {assetPath: "/assets/dice-box/", ...config});        
    }
    //  else {
    //     diceInstance.updateConfig(config);
    // }
    // this is to save the init call and return it's promise every time, that way multiple calls waiting will resolve together. 
    if (!initPromise) {
        initPromise = diceInstance.init();
    }
    if (!newInstance && config) {
        return updateConfig(config);
    }
    return initPromise;
};



export async function updateConfig(config) {
    // init calls update on an existing instance so just pass it in here
    await init();
    diceInstance.updateConfig(config);
}

export async function hide() {
    await init();
    diceInstance.hide();
}
export async function clear() {
    // hide calls init so assume its initialized
    await hide();
    diceInstance.clear();
}

// TODO: See if this is correct
async function rerollIfNeeded(results) {
    const rerolls = parser.handleRerolls(results);
    if (Array.isArray(rerolls) && rerolls.length > 0) {
        const nextResults = await diceInstance.reroll(rerolls);
        return rerollIfNeeded(nextResults);
    }
}

export async function rollDice(input) {
    await init();

    const parsed = parser.parseNotation(input);
        const initialResults = await diceInstance.show().roll(parsed);
        await rerollIfNeeded(initialResults);

        const finalReults = diceInstance.getRollResults();
        return parser.parseFinalResults(finalReults);

};

