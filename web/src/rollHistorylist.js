import {Box, Container, List, ListItemText} from "@mui/material";
import Button from "@mui/material/Button";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import {ListSubheader} from "@mui/material";
import Paper from "@mui/material/Paper";


export default function RollHistoryList(props)
{
  const elements = [
    {id:"a", total: 10, rollString: "2d6"},
    {id:"b",total: 10, rollString: "10d5"},
    {id:"c",total: 99, rollString: "1d100"},
    {id:"d",total: 19, rollString: "1d20kh+4"}

  ];
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
      {elements.map((item)=>{
        return RollHistoryListItem(item)
      })

      }
    </List>
    </Paper>
    </Box>
  );
}

function reRollHistory(rollString)
{
  //in this file, need to access const from other file...

  console.log("re roll roll string.")
  // App.rollDice(rollString);
}

function RollHistoryListItem(item)
{
  return (
    //Todo I think key should be in the .map function?
    <ListItem key={item.id}>
      <ListItemIcon>
        <CircleIcon />
      </ListItemIcon>
      <ListItemText id="switch-list-label-bluetooth" primary={item.total}  />
      {/*//I would like it if the button looked less like a button, just on hover.*/}
      <ListItemText secondary={item.rollString} onClick={reRollHistory(item.rollString)} />
      <Button
        edge="end"
        onClick = {reRollHistory(item.rollString)}
      >Re-Roll {item.rollString}</Button>
    </ListItem>
  );
}
