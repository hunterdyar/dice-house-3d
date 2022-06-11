import React, {useState} from 'react';
import Button from '@mui/material/Button';
import {Box, IconButton, TextField, TableFooter, Collapse, Tabs, Tab} from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

//icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GridOnIcon from '@mui/icons-material/GridOn';
import Paper from "@mui/material/Paper";

import DiceChoiceTable from "./DiceChoiceTable";
import DungeonWorld from "./dungeonWorld";

//TODO: move input text and Roll button to this, and have it pass its children through? or?

//From https://mui.com/material-ui/react-tabs/
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function RollTable(props)
{
  const [open, setOpen] = useState(true);
  const [diceString, setDiceString] = useState("");
  const [textInput, setTextInput] = useState(false);

  const rollClicked = () =>
  {
    //check for empty string.
    if(diceString != "") {
      props.roll(diceString);
    }
  };

  const textInputChange = (e) => {
    setTextInput(true);
    setDiceString(e.target.value);
  };

  //Tabs
  const [value, setValue] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: 500,
      }}>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 400}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={1}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {(open == true) ? <KeyboardArrowUpIcon /> : <GridOnIcon />}
                </IconButton>
              </TableCell>
              <TableCell colSpan={5}>
                <TextField value={diceString} onChange={textInputChange} label="Dice Input" size="small" fullWidth={true} color={(textInput) ? "secondary" : ""}></TextField>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <Collapse in={open}>
          <Box sx={{ flexGrow: 1, display: 'flex', borderBottom: 1, borderColor: 'divider' }}>

          <Tabs  value={value} onChange={handleTabChange} aria-label="basic tabs example" orientation={"vertical"}
                  sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Table" value={0}/>
              <Tab label="DW"  value={1} />
            </Tabs>
          <TabPanel value={value} index={0} sx={{flexGrow: 0}}>
            <DiceChoiceTable value={1} setDiceString={setDiceString} onRoll={rollClicked} results={props.results}/>
          </TabPanel>
          <TabPanel value={value} index={1} sx={{flexGrow: 0}}>
            <DungeonWorld value={2} setDiceString={setDiceString} onRoll={rollClicked} results={props.results} />
          </TabPanel>
          </Box>


        </Collapse>
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell colSpan = {6}>
                <Button onClick={rollClicked} fullWidth={true} variant={"contained"}>Roll!</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan = {6}>
                <h2>{props.results}</h2>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default RollTable;
