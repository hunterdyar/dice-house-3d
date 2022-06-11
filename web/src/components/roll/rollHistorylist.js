import {Box, Container, List, ListItemText} from "@mui/material";
import Button from "@mui/material/Button";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import {ListSubheader} from "@mui/material";
import Paper from "@mui/material/Paper";
import {GetHistoryHooks} from "../../roomLogic/diceEvents";
import {RollResultDisplay} from "./RollResult";
import {rollDice} from "../../roomLogic/diceEvents";

export default function RollHistoryList(props)
{
  const [history,setHistory] = GetHistoryHooks();

  const renderSet = [];
  history.forEach(value => {
    renderSet.push(<RollHistoryListItem key={value.id} result={value} />);
  })


    return(
    <Box
      sx={{
        width: 400,
      }}>
    <Paper elevation={1}>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      subheader={<ListSubheader>Roll History</ListSubheader>}
    >
      <ListItem>
        {/*<ListItemIcon>*/}
          {/*<Icon />*/}
        {/*</ListItemIcon>*/}
        <ListItemText id="switch-list-label-wifi" primary="Roll History" />
      </ListItem>
      {renderSet}
    </List>
    </Paper>
    </Box>
  );
}


function reRollHistory(rollString)
{
  //in this file, need to access const from other file...
  console.log("reroll: "+rollString)
  rollDice(rollString);
  // App.rollDice(rollString);
}

function RollHistoryListItem({result: item})
{

  return (
    <ListItem>
      <ListItemIcon>
        <CircleIcon/>
      </ListItemIcon>
      <ListItemText >
        <RollResultDisplay result={item}/>
      </ListItemText>
      {/*Todo: shouldn't be a button, should be a hover that changes the text to a dice string*/}
      <Button
        edge="end"
        onClick = {() => reRollHistory(item.diceString)}
      >Re-Roll {item.diceString}</Button>
    </ListItem>
  );
}
