import React from 'react';
function DungeonWorld(props)
{
  const instaRoll = (e) =>{
    props.setDiceString("2d6"+sign(e.target.value)+e.target.value);
    props.onRoll();
  }
  const sign = (v) =>{
    let s = Math.sign(v);
    if(s>0)
    {
      return "+";
    }else
    return "";
  }
  const mods = [-3,-2,-1,0,1,2,3,4,5]
  return (
    mods.map((v)=>{
      return <Button onClick={instaRoll} value={v}>{sign(v)}{v}</Button>
    })
);
}

import Button from '@mui/material/Button';
export default DungeonWorld;
