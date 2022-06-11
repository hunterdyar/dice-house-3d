import DiceBox from "@3d-dice/dice-box";

import "./diceBox.css";

let containerElm;
const containerId = "dice-box-container";

let diceInstance;

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
}

export function updateConfig(config) {
    if (!diceInstance) {
        console.warn("Must call diceBox.init() first");
    } else {
        diceInstance.updateConfig(config);
    }
}

export function clear() {
    if (!diceInstance) {
        console.warn("Must call diceBox.init() first");
    } else {
        diceInstance.hide().clear();
    }
}

export function roll(input) {
    if (!diceInstance) {
        console.warn("Must call diceBox.init() first");
    } else {
        return diceInstance.show().roll(input);
    }
}

