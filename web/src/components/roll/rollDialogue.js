import {RollResultDisplay} from "./RollResult";
import {Dialog, Divider} from "@mui/material";
import React, {useState} from "react";
import {DiceApp, rollCompleteListeners} from "../../roomLogic/diceEvents";

function RollResultDialogue()
{
  const [results,setResults] = React.useState({});
  const [open, setOpen] = React.useState(false);
  let r;
  const handleOpen = (result) => {
    console.log("popup",result);
    if(typeof result !== "undefined" ) {
      setResults(result);
      // setResults(result)
      if (result.isLocalRoll || DiceApp.settings.popupRemoteRolls) {
        setOpen(true);
        // console.log(r);
      }
    }else{
      console.log("result undefined");
    }
  };
  rollCompleteListeners.dialoguePopup = handleOpen;

  const handleClose = (value) => {
    setOpen(false);
  };

  return(
    <Dialog onClose={handleClose} open={open} >
      <RollResultDisplay result={results} />
    </Dialog> );
}

export default RollResultDialogue;
