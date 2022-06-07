import React, {useMemo} from 'react';
import RandomGUID from "@3d-dice/dice-box/dist/world.onscreen";
import Paper from "@mui/material/Paper";

//todo: Export this class, then write the result display components to utilize it. This way we only parse once.
export class DiceResult
{
    constructor(res) {
        this.id = crypto.randomUUID();
        if(typeof res == "undefined") {
            this.parts = [];
            this.total = 0;
        }else {
            //check if this is coming from a deserialized object or not? todo?
            this.parts = resultsToParts(res);
            this.total = res.value;
        }
    }
    id = "zero";
    total = 0;
    parts = [];

    toString()
    {
        var t = "";
        for(let i = 0;i<this.parts.length;i++)
        {
            let pre = "";
            let post = "";
            let part = this.parts[i];
            //Modifier
            if(part.type === "number")
            {
                let s = Math.sign(part.value) === -1 ? "-" : "+";
                pre = s;
            }

            //THis shouldn't be in a .tostring, it should be in a react component.
            if(part.crit == "success"){
                // pre = "<span class='crit-success'>";
                // post = "</span>";
            }
            t = t+pre+part.value.toString()+post;
            if(i<this.parts.length-1)
            {
                t = t+", ";
            }
        }
        if(this.parts.length > 0) {
            t = t + " = " + this.total;
        }
        return t;
    }
    //Network Deserialization. Makes object from json from network.
    fromObject(obj)
    {
        //todo: Can you over-ride constructors
        this.parts = obj.parts;
        this.total = obj.total;
    }
    //Network Serialization. converts object to json then sends it.
    toObject()
    {
        return {
            parts:this.parts,
            total:this.total
        };

    }
}
//parsing
function resultsToParts(res)
{
    if(typeof res === "undefined")
    {
        return [];
    }
    const v = [];
    //////

    if(res.type === "expressionroll")
    {
        res.dice.forEach(function (dice) {
                v.push(...resultsToParts(dice));
            }
        )
    }else if(res.type==="dice")
    {
        res.dice.forEach(function (di){
            v.push(...resultsToParts(di));
        })
    }else if(res.type==="die")
    {
        res.rolls.forEach(function (roll) {
                v.push(...rollToPart(roll));
            });

    }else if(res.type==="number")
    {
        v.push(...rollToPart(res));
    }

   return v
}

//parsing logic
function rollToPart(roll)
{
    if(!roll.valid)
    {
        return [];
    }

    if(roll.type === "roll") {
        //check roll.critical for syntax.
        return [{
            isSuccess: roll.success,
            crit: roll.critical,//either "success" or "failure"
            sides: roll.die,
            value: roll.value,
            type: "dice"
        }];
    }else{
        if(roll.type === "number") {
            //check roll.critical for syntax.
            return [{
                isSuccess: null,//same problem as crits. +1 is not a Check or Fail.
                crit: null,//todo: what should crit be for numbers?
                sides: 1,
                value: roll.value,
                type: "number"
            }];
        }
    }
    return [];
}

//todo: make a RolLResultDialog for popup

export function RollResultDisplay({result = {}})
{
    console.log("rendering roll result display.",result);
    const {parts = [],total = 0} = result;//wtf is this backwards syntax for default values.
    let lastIndex = parts.length-1;
    if(parts.length !== 0) {
        return (
        <Paper>
            <span>
            {parts.map((part, index) => (
                //todo: generate a key during parsing.
                <RollPartDisplay key={`${index}-${part.value}-${part.crit}-${part.sides}`} roll={part} last={index === lastIndex}/>
            ))}

                <span className="dice-total"> = {total}</span>
        </span>
        </Paper>
        )
    }else{
        return null;
    }
}

class RollPartDisplay extends React.Component
{
    //todo needs refactoring.
    constructor(props) {
        super(props);
        let critClass = "";
        if(props.roll.crit === "success")
        {
            critClass = "crit-success";
        }else if(props.roll.crit === "failure")
        {
            critClass = "crit-failure";
        }
        let pre = "";
        if(props.roll.type === "number"){
            pre =  Math.sign(props.roll.value) === -1 ? "-" : "+";
        }
        this.state = {
            rollPart: props.roll,
            crit: critClass,
            prefix: pre,
            value:props.roll.value,
            last: props.last
        }
    }

    render()
    {
        return(
        <span className={this.state.crit}>{this.state.prefix}{this.state.value}{this.state.last ? "" : ", "}</span>)
    }
}
