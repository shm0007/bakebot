let constraintsToWin = 7;
let constraintsFixed = 0;
let minTime = 0;
let maxTime = 1440;
let minIngredient = 0;
let maxIngredient = 1000;
let minTemp = 0;
let maxTemp = 500;
constraintProgress = 0;
let progress = 0;

const cakeIngredients = 'ADD 1 Flour\nADD 2 Water\nADD 1 Sugar\nBAKE AT 375 DEGREES FOR 35 MINUTES';
const breadIngredients = 'ADD 3 Flour\nADD 1 Water\nADD 0.25 Sugar\nBAKE AT 350 DEGREES FOR 60 MINUTES';
const biscuitIngredients = 'ADD 2 Flour\nADD 1 Water\nADD 0.5 Sugar\nBAKE AT 325 DEGREES FOR 25 MINUTES';
const validIngredients = [
    'flour',
    'water',
    'salt',
    'sugar'
  ];
const toxicIngredients = [
    'knife',
    'bleach',
    'sponge',
    'mixer',
    'sink',
    'oven',
    'range'
];
const successMsg = 'Congrats! You made a food!';

let  spacetime = 'Oh dear. Negative ingredients?! Bakebot can\'t handle that idea! Define a minimum ingredient ' +
   'constraint!';
 let future = 'Oh no! Bake times over ' + maxTime + ' minutes result in the kitchen being transported to the ' +
   'distant future! How embarassing. Define a safe maximum bake time limit at or below ' + maxTime + '.';
 let  fire = 'Uffda! Bake temperatures above ' + maxTemp + ' cause everything to burst into flames! We really ' +
   'should have thought of that! Please define a maximum temperature limit at or below ' + maxTemp + '!';
 let  past = 'Uh oh! Negative bake times transport the kitchen to the prehistoric past! That\'s not great. Define a ' +
   'safe minimum bake time constraint.';
 let  cold = 'Brrrrr! Negative bake temperatures cause the system to go haywire and freeze everything! Define a safe ' +
   'minimum bake temperature.';
 let  tooMuchIngredient = 'Uh oh, ingredient amounts greater than ' + maxIngredient + ' units result a disastrous ' +
   'overflow! Please define a maximum ingredient amount at or below ' + maxIngredient + '.';
 let  flood = tooMuchIngredient;
 let winner = 'You set all the constraints to valid values! Now BakeBot is safe from harmful input!';

 const bakeSyntax = 'The last line must be a BAKE instruction of the form: BAKE AT [TEMP] FOR [MINUTES] MINUTES!';
 const poison = 'Oh no! You used something in your recipe that is dangerous for humans! ' +
 'Define a comma-separated list of accepted ingredients! ' +
 'The list of ingredients should include ALL valid ingredients in the kitchen (and only those items).';

 const disapprovedIngredient = ' is not in the list of approved ingredients! ' +
 'The comma-separated list of ingredients should include ALL valid ingredients in the kitchen (and only those items). ' +
 'Recipes should not include any disapproved ingredients.';

const warning = "You made Bakebot do something that shouldn't be possible! Each time you do this, we\'ll give you a tool to"
                + "constrain the relevant input so that only valid input is processed by Bakebot. After a new constraint is"
                + "revealed, set it to a sensible value and bake something to ensure that the constraint restricts Bakebot to safe"
                + "operation."

function myFunction() {
    document.getElementById("robot").src = "assets/images/robot/bakebot5000-confused.svg";
    document.getElementById("max-ingredients").style.display = "block";
    document.getElementById("approved-ingredients").style.display = "block";
}
function insertCakeRecipe(){
    document.getElementById("recipe-input").value =  cakeIngredients
}
function insertBiscuitRecipe(){
    document.getElementById("recipe-input").value =  biscuitIngredients

}
function insertBreadRecipe(){
    document.getElementById("recipe-input").value =  breadIngredients
}
function parseInput(){
    let future = false;
    let flood = false;
    let poison = false;
    const confused = false;
    let cold = false;
    let spacetimeParadox = false;
    let past = false;
    let fire = false;
    let invalidIngredient = false;
    let tooMuchIngredient = false;
    updateProgressBar();
    const input = document.getElementById('recipe-input').value.toLowerCase();
    const lines = input.split('\n');
    console.log("lines before delete "+ lines.length)
    deleteMsg('', lines)

    // checks that there is a valid baking line before parsing input
    const hasBakeLine = new RegExp(/bake /).test(lines[lines.length - 1]);
    let temp = '';
    let time;
    const getBake = /bake( at)? (-?\d+)/;

    if (hasBakeLine) {
      // short circuit when incorrect bake line
      if (! getBake.test(lines[lines.length - 1])) {
        alert("getbake")
        displayAlert(bakeSyntax);
        nopeBackground();
        return;
      }
      temp = (lines[lines.length - 1].match(/bake[ at]* (-?\d+)/))[1];
      // console.log(temp);
      time = parseTime(lines[lines.length - 1]);
      // deepcode ignore UseNumberIsNan: Number.isNaN is appropriate only if we are GUARANTEED a number (which we aren't)
      if (isNaN(time)) {
        displayAlert('You want me to bake this for how long?');
        nopeBackground();
        return;
      }
      // console.log('time is: ' + time);
    }  else { // (!hasBakeLine) {
      // person didn't enter BAKE line
      displayAlert(bakeSyntax);
      this.nopeBackground();
      return;
    }
     // checks for emergency conditions in baking line
     if (hasConstraint("min-temp-input") && +temp < getMinTempConstraint()) {
      displayAlert('The oven can\'t be that cold!');
      nopeBackground();
      return;
    }
    if (hasConstraint("max-temp-input") && +temp > getMaxTempConstraint()) {
      displayAlert('That\'s too hot! Set the oven to a lower temperature.');
      nopeBackground();
      return;
    }
    


      if (+temp < minTemp) {
        cold = true;
        document.getElementById("min-temp").style.display = "block";
      } else if (+temp > maxTemp) {
        fire = true;
        document.getElementById("max-temp").style.display = "block";
    
      }
      console.log("timeee "+ time);

      if (hasConstraint("min-time-input") &&  time < getIntConstraint("min-time-input")) {
        displayAlert('You need to bake it longer than that!');
        nopeBackground();
        return;
      }
      if (hasConstraint("max-time-input") && time > getIntConstraint("max-time-input")) {
        displayAlert('You can\'t bake it that long!');
        nopeBackground();
        return;
      }
      
  
  
      if (time < minTime) {
        past = true;
        document.getElementById("min-time").style.display = "block";
      } else if (time > maxTime) {
        future = true;
        document.getElementById("max-time").style.display = "block";
      }

      const getIngredient = /([a-z]+)$/;
      const getQuantity = /add (-?\d*[.]?\d*)/;
      let ingredient
      let quantity;
      let HasSomeQuantity = false;
      for (let i = 0; i < lines.length - 1; i++) {
        ingredient = (lines[i].match(getIngredient))[0];
        if (! getQuantity.test(lines[i])) {
          displayAlert('Not sure what line ' + +(i + 1) + ' is supposed to be...');
          whatBackground();
          return;
        }
  
        quantity = parseFloat((lines[i].match(getQuantity))[1]);
  
        if (isNaN(quantity)) {
          displayAlert('How much ' + ingredient + ' did you want?');
          whatBackground();
          return;
        }
  
        // Check for ingredient in approved list 
        if (hasTextConstraint("approved-ingredients-input")) {
          console.log("Checking")
           if (!getConstraint("approved-ingredients-input").includes(ingredient)) {
             this.displayAlert(ingredient + disapprovedIngredient);
             this.nopeBackground();
             return;
           }
         }
  
         
  
  
        if (validIngredients.some(v => ingredient.includes(v))) {
          //TODO: might need to reorder the if else conditions
          if (hasConstraint("max-ingredients-input") && quantity > getIntConstraint("max-ingredients-input")) {
              displayAlert('That\'s too much ' + ingredient + '!');
              nopeBackground();
              return;
          }   
          else if (quantity > maxIngredient) {
                  tooMuchIngredient = true;
                  if (ingredient === 'water') {
                    flood = true;
                  }
            }
        } else if (toxicIngredients.some(v => ingredient.includes(v))) {
          // ingredient is toxic!
          poison = true;
        } else { // ingredient doesn't exist
          invalidIngredient = true;
          displayAlert('The robot doesn\'t know what \"' + ingredient + '\" is!');
          confusedBackground();
          return;
        }
        console.log("Quantity "+ quantity);
       if (hasConstraint("min-ingredients-input") && quantity < getIntConstraint("min-ingredients-input")) {
            displayAlert('You need to add more ' + ingredient + '!');
            nopeBackground();
            return;
        } 
  
        if (quantity < minIngredient) {
            spacetimeParadox = true;
        }
  
        if (quantity !== 0) {
            // some quantity of some thing was included - this lets us check for baking "nothing" - an easter egg
            HasSomeQuantity = true;
        }
      }

      if (fire) {
        drawEnding('fire');
        document.getElementById("max-temp").style.display = "block"; 
      } else if (cold) {
        document.getElementById("min-temp").style.display = "block";
        drawEnding('cold');
      } else if (spacetimeParadox) {
        document.getElementById("min-ingredients").style.display = "block";
        drawEnding('spacetime');
      } else if (future) {
        document.getElementById("max-time").style.display = "block";
        drawEnding('future');
      } else if (past) {
        document.getElementById("min-time").style.display = "block";
        drawEnding('past');
      } else if (poison) {
        document.getElementById("approved-ingredients").style.display = "block";
        drawEnding('poison');
      } else if (flood) {
        document.getElementById("max-ingredients").style.display = "block";
        drawEnding('flood');
      } else if (tooMuchIngredient) {
        document.getElementById("max-ingredients").style.display = "block";
        drawEnding('tooMuchIngredient');
      } else if (getConstraintProgress() === constraintsToWin) {
        drawEnding('winner');
      } else if (!HasSomeQuantity) {
        drawEnding('success_nothing');
      } else if (!invalidIngredient && input === cakeIngredients.toLowerCase()) {
        drawEnding('success_cake');
      } else if (!invalidIngredient && input === breadIngredients.toLowerCase()) {
        drawEnding('success_bread');
      } else if (!invalidIngredient && input === biscuitIngredients.toLowerCase()) {
        drawEnding('success_biscuits');
      } else if (!invalidIngredient) {
        drawEnding('success');
      }


    console.log("lines after delete "+ lines.length)
}
//TODO: need to fix bug
function deleteMsg(msg, data) {
    const index= data.indexOf(msg);
    if (index !== -1) {
      data.splice(index, 1);
    }
}
function drawEnding(ending) {
  console.log("ending "+ ending); 
  let imageSrc =  'assets/images/robot/bakebot5000-base.svg';

  let hideFirstConstraintAlert = true;

  switch (ending) {
    case 'winner':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-winner.svg";
      document.getElementById("bad-alert").style.display = "none";
      document.getElementById("banner").style.display = "block";
      document.getElementById("banner").textContent= winner;
      break;
    case 'success':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-success-a-thing.svg";
      document.getElementById("bad-alert").style.display = "none";
      document.getElementById("banner").style.display = "block";
      document.getElementById("banner").textContent= "Congrats, you made a food";
      break;
    case 'success_cake':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-success-cake.svg";
      document.getElementById("bad-alert").style.display = "none";
      document.getElementById("banner").style.display = "block";
      document.getElementById("banner").textContent= "Congrats, you made a cake";
      break;
    case 'success_bread':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-success-bread.svg";
      document.getElementById("bad-alert").style.display = "none";
      document.getElementById("banner").style.display = "block";
      document.getElementById("banner").textContent= "Congrats, you make a bread";
      break;
    case 'success_biscuits':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-success-biscuits.svg";
      document.getElementById("bad-alert").style.display = "none";
      document.getElementById("banner").style.display = "block";
      document.getElementById("banner").textContent= "Congrats, you make a biscuits";
      break;
    case 'success_nothing':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-success-nothing.svg";
      document.getElementById("bad-alert").style.display = "none";
      document.getElementById("banner").style.display = "block";
      document.getElementById("banner").textContent= "Congrats, you make some air";
      break;
    case 'poison':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-poisoned.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= poison;
      break;
    case 'spacetime':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-spacetime.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= spacetime;
      break;
    case 'future':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-future.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= future;
      break;
    case 'fire':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-fire.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= fire;
      break;

    case 'past':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-prehistoric.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= past;
      break;

    case 'cold':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-frozen.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= cold;
      break;

    case 'flood':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-water.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= flood;
      break;


    case 'tooMuchIngredient':
      document.getElementById("robot").src = "assets/images/robot/bakebot5000-too-much-dry.svg";
      document.getElementById("bad-alert").style.display = "block";
      document.getElementById("banner").textContent = warning;
      document.getElementById("bad-alert").textContent= tooMuchIngredient;
      break;
    default:
      console.log('not a valid ending string');
  }


}

function parseTime(s) {
    const inYears = new RegExp('year[s]?$');
    const time = new RegExp(/(-?\d*[.]?\d*) [a-z]*$/);
    let n;
    if (time.test(s)) {
      n = parseFloat(s.match(time)[1]);
      if (n < 0) {
        return -1;
      }
      if (isNaN(n)) {
        return NaN;
      }
      // console.log('time is: ' + n);
      // console.log('time thinks it is: ' + s.match(time));
    } else {
      this.badDialog('Invalid time input');
      return NaN;
    }

    if (inYears.test(s)) {
      // user specified years
      return 2147483647;
    }

    const inDays = new RegExp('day[s]?$');
    if (inDays.test(s)) { return 1000000; }

    const inHours = new RegExp('hour[s]?$');
    if (inHours.test(s)) { return +n * 60; }

    const inMinutes = new RegExp('minute[s]?$');
    if (inMinutes.test(s)) { return +n; }

  }
function displayAlert(s) {
   // alert("inside " +s);
   document.getElementById("banner").textContent = s
   document.getElementById("banner").style.backgroundColor = "#36f"
    
//    document.getElementById("bad-alert").style.display = "block"

}


function nopeBackground() {
  document.getElementById("bad-alert").style.display = "none";
  document.getElementById("robot").src = "assets/images/robot/bakebot5000-nope.svg";
}
function confusedBackground() {
    document.getElementById("robot").src = "assets/images/robot/bakebot5000-confused.svg";
}
 function whatBackground() {
    document.getElementById("robot").src = "assets/images/robot/bakebot5000-what.svg"; 
}


function hasConstraint(ctName){
  let ct = parseInt(document.getElementById(ctName).value);
  return !isNaN(ct);
}
function hasTextConstraint(ctName){
  let ct = (document.getElementById(ctName).value);
  console.log("Text"  + ct)
  return !(!ct);
}

function getMinTempConstraint(){
  return parseInt(document.getElementById("min-temp-input").value)
}
function getMaxTempConstraint(){
  return parseInt(document.getElementById("max-temp-input").value)
}
function getIntConstraint(ctName){
  let c =  parseInt(document.getElementById(ctName).value)
  console.log(c)
  return c
}
function getConstraint(ctName){
  let c =  (document.getElementById(ctName).value)
  console.log("TEXT CONT "+ c)
  return c.toLowerCase()
}


function updateProgressBar(){
    document.getElementById("ct-progress").textContent = getConstraintProgress() + "/7";
}

function getConstraintProgress(){
  let currentProgress = 0;
  if(hasConstraint("min-temp-input") && getIntConstraint("min-temp-input")>=minTemp)
    currentProgress++;
    if(hasConstraint("max-temp-input") && getIntConstraint("max-temp-input")<=maxTemp)
    currentProgress++;
    if(hasConstraint("min-time-input") && getIntConstraint("min-time-input")>=minTime)
    currentProgress++;
    if(hasConstraint("max-time-input") && getIntConstraint("max-time-input")<=maxTime)
    currentProgress++;
    if(hasConstraint("min-ingredients-input") && getIntConstraint("min-ingredients-input")>=minIngredient)
    currentProgress++;
    if(hasConstraint("max-ingredients-input") && getIntConstraint("max-ingredients-input")<=maxIngredient)
    currentProgress++;
    if(hasTextConstraint("approved-ingredients-input"))
    currentProgress++;
    
    return currentProgress;
}
