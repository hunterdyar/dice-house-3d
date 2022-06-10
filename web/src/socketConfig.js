
//Copied from the other project, this stuff is just here for conveninent split-pane reference.

socket.on('otherRoll',function(diceSet){
  console.log("remote roll");
  showDice(diceSet);
})

socket.on('otherForm',function(diceSet){
  console.log("remote form update");
  updateForm(diceSet);
})

function onLoad()
{
  formData = getFormDataFromField();
  //todo ask for form update.
}
function join(roomName)
{
  console.log("client wants to join "+roomName);
  socket.emit("joinRoom",roomName);
}

function updateForm(otherFormData)
{
  formData = otherFormData;
  if(lobby != otherFormData.room)
  {
    console.log("wonky lobby hiccup?");
  }
}
function diceNumberChange()
{
  let number = document.getElementById("numDiceInput").value;
  if(formData['numDice'] != number)
  {
    formData['numDice'] = number;
    sendFormUpdate();
  }
}
function diceSidesChange()
{
  let sides = document.getElementById("diceSidesSelectInput").value;
  if(formData['sides'] != sides)
  {
    formData['sides'] = sides;
    sendFormUpdate();
  }
}
function getFormDataFromField()
{
  let form = {}
  form['room'] = lobby;
  let sides= document.querySelector("#diceSidesSelectInput");
  let dice = document.getElementById("numDiceInput").value;

  form['sides'] = sides.value;
  form['numDice'] = dice;

  return form;
}
function sendFormUpdate()
{
  formData.room = lobby;//force lobby update lazily.
  socket.emit("updateForm",formData);
}
