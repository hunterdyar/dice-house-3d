import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Box, Input, TextField, TableFooter, Collapse, IconButton} from "@mui/material";
import React from 'react';
import Button from '@mui/material/Button';
//icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GridOnIcon from '@mui/icons-material/GridOn';

function createDiceRow(
    name, sides, sVal) {
    return { name, sides, sVal:""};
}

const rows = [
    createDiceRow('D4', 4),
    createDiceRow('D6', 6),
    createDiceRow('D8', 8),
    createDiceRow('D10', 10),
    createDiceRow('D12', 12),
    createDiceRow('D20', 20),
];

class ButtonCell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showSelected: props.showSelected,
            onClick: props.onClick,
            onSelect: props.onSelect,
            dice: props.sides,
            value: props.value,
        };
        this.state.onSelect = this.state.onSelect.bind(this)
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    buttonClicked()
    {
        // this.setState(prevState => ({
        //     selected: !prevState.selected
        // }));
        this.state.onSelect(this.state.value);
    }

    render() {
        let button;

        // console.log("is "+this.state.selectedVal+" === "+this.state.value +"? "+ (this.state.selectedVal == this.state.value));
        if(this.state.showSelected(this.state.value))
        {
            button = <Button variant="contained" onClick={this.buttonClicked}>{this.state.value}</Button>
        }else{
            button = <Button variant="outlined" onClick={this.buttonClicked}>{this.state.value}</Button>
        }
        return <TableCell align="center" padding="none">
            {button}
                </TableCell>;
    }
}

class DiceRow extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            onChange: props.onChange,
            sides: props.sides,
            selectedValue: 0
        };

        //bindings so 'this' works in callback.
        this.newAmountSelected = this.newAmountSelected.bind(this);
        this.rowAsString = this.rowAsString.bind(this);
        this.showSelected = this.showSelected.bind(this);
    }

    newAmountSelected(val)
    {
        // this.setState(previousState => ({
        //     selectedValue: val != previousState.val ? val : 0
        // }));
        var newVal = val;
        if(this.state.selectedValue === val)
        {
            newVal = 0;
        }

        //clear others?
        this.setState(
            {selectedValue: newVal}
        );

        //callback to update parent
        //state is out of date? setState is async so this happens before selectedValue changes. override with newVal?
        this.state.onChange(this.state.sides,this.rowAsString(newVal))
    }
    showSelected(button)
    {
        return button == this.state.selectedValue;
    }

    rowAsString(val)
    {
        if(val === 0)
        {
            return "";
        }else {
            return val + "d" + this.state.sides;
        }
    }


    render()
    {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            <TableCell component="th" scope="row">
                {this.props.name}
            </TableCell>
            <ButtonCell sides={this.props.sides} value="1" onSelect={this.newAmountSelected} showSelected={this.showSelected}>1</ButtonCell>
            <ButtonCell sides={this.props.sides} value="2" onSelect={this.newAmountSelected} showSelected={this.showSelected}>2</ButtonCell>
            <ButtonCell sides={this.props.sides} value="3" onSelect={this.newAmountSelected} showSelected={this.showSelected}>3</ButtonCell>
            <ButtonCell sides={this.props.sides} value="4" onSelect={this.newAmountSelected} showSelected={this.showSelected}>4</ButtonCell>
            <ButtonCell sides={this.props.sides} value="5" onSelect={this.newAmountSelected} showSelected={this.showSelected}>5</ButtonCell>
            {/*Todo: Custom Input*/}
            {/*todo: With Advantage?*/}
            {/*<TableCell component="th" scope="row"><input type="number"/></TableCell>*/}
        </TableRow>
    }
}
 class DiceTable extends React.Component
 {
     constructor(props) {
         super(props);
         this.state = {
             results: props.results,
             open:true,
             onRoll: props.onRoll,
             diceString: "",
             textInput: false
         };
         this.rollClicked = this.rollClicked.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.textInputChange = this.textInputChange.bind(this);
         this.setOpen = this.setOpen.bind(this);
     }

     rollClicked()
     {
         //check for empty string.
         if(this.state.diceString != "") {
             this.state.onRoll(this.state.diceString);
         }
     }
     textInputChange(e){
         this.setState({
             textInput: true,
             diceString: e.target.value
         });
     }
     handleChange(sides,val){
         let total = "";
         for(let i =0;i<rows.length;i++)
         {
             if(sides == rows[i].sides)
             {
                 rows[i].sVal = val;
             }
             if(total != "" && rows[i].sVal != "")
             {
                 total = total + " + ";
             }
             total = total +  rows[i].sVal;
         }
         this.setState({
             textInput: false,
             diceString: total,
         })
     }
     setOpen(o){
        this.setState({
            open: o
        })
    }


    render () {
        return <Box
            sx={{
                width: 400,
            }}>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 400}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={1}>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => this.setOpen(!this.state.open)}
                                >
                                    {(this.state.open == true) ? <KeyboardArrowUpIcon /> : <GridOnIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell colSpan={5}>
                                <TextField value={this.state.diceString} onChange={this.textInputChange} label="Dice Input" size="small" fullWidth={true} color={(this.state.textInput == true) ? "secondary" : ""}></TextField>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                <Collapse in={this.state.open}>
                <Table>
                    <TableBody>
                        {rows.map((row) => (
                            <DiceRow key={row.name} name={row.name} sides={row.sides} onChange={this.handleChange}></DiceRow>
                        ))}
                        {/*//todo: Clear table button, set every row value to 0.*/}
                    </TableBody>
                </Table>
                </Collapse>
                <Table>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan = {6}>
                                <Button onClick={this.rollClicked} fullWidth={true} variant={"contained"}>Roll!</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan = {6}>
                                <h2>{this.state.results}</h2>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    }
}
function Roll(ds)
{
    console.log(ds);
}
export default function DiceChoiceTable(params)
{
    return (
        <DiceTable onRoll={params.onRoll} results={params.results}/>
    )
}
