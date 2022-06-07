import React, {useState, useEffect} from "react";
import {Button} from "@mui/material";

const DiceInput = ({val, onChange}) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(current => {
            if (current !== val) {
                return val;
            }
            return current;
        })
    }, [val, setValue]);

    return <>
    <div>
        Input: {value}
        <Button onClick={() => onChange(value)}>Roll!</Button>
        <Button onClick={() => onChange("")}>Clear</Button>
    </div>
        TODO: Dice Input
        <Button onClick={() => setValue("2d20")}>2d20</Button>
        <Button onClick={() => setValue("2d100")}>2d100</Button>
        </>
}
export default DiceInput;