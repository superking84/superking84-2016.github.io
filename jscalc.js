window.onload = function () {
var calc = (function() {
  var inputInProcess = false; // for handling equations in process vs answers
  var operatorRE = new RegExp(/[\/*+\-]/);
  var digitRE = new RegExp(/[0-9]/);
  var queue = [0];
  var keyCodes = {
    47: "/", 42: "*", 45: "-", 43: "+",
    48: "0", 49: "1", 50: "2", 51: "3", 52: "4",
    53: "5", 54: "6", 55: "7", 56: "8", 57: "9",
    96: "0", 97: "1", 98: "2", 99: "3", 100: "4",
    101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 
    106: "*", 107: "+", 109: "-", 110: ".", 111: "/"    
  };
  var validateInput = function(input) {
    // just don't let an equation begin with an operator
    if (operatorRE.test(input) && queue.length === 0)
      return false;
    // digits and operators can always be added after any character  
    if (/[0-9\/\-+*]/.test(input))
      return true;
    else if (input === '.') {
      var lastInput = queue[queue.length - 1];
      if (lastInput === '.')
        return false;
      else if (digitRE.test(lastInput)) {
        // check if the last input is an operand that already has a decimal point
        var operands = queue.join('').split(/[^0-9.]/);
        var lastOperand = operands[operands.length - 1];
        // valid if (last number DOESN'T have a decimal) OR
        // inputInProcess is false, meaning we're starting a NEW number
        return (!/[.]/.test(lastOperand) || !inputInProcess);
      }
      else
        return true;
    }
  };
  return {
    getLastInQueue: function() { return queue[queue.length - 1]; },
    getQueue: function() { return queue; },
    getCommandFromKeyCode: function(keyCode) {
      return keyCodes[keyCode];
    },
    calculate: function() {
      var equation = queue.join('');
      try {
        var answer = eval(equation);
        queue = answer.toString().split('');
      } catch(err) {
        queue = ["Invalid input"];
      }
      inputInProcess = false;
    },
    addToQueue: function(ch) { 
      if (queue.length >= 18)
        return;
      else if (validateInput(ch)) {
        if (queue[0] === "Invalid input")
          this.clearQueue();
        
        var last = this.getLastInQueue();
        // after calculation done, start new number if decimal or digit entered
        if ((digitRE.test(ch) || ch === '.') && !inputInProcess) {
          queue = [];
        }
        inputInProcess = true;
        
        // if input is a decimal point and you're starting a new number,
        // then add a leading 0
        if (ch === '.' && 
            (operatorRE.test(last) || queue.length === 0)) {
            queue.push('0');
        }
        // If the input is an operator, replace any operator or decimal
        else if (operatorRE.test(ch) && /[.\/*\-+]/.test(last))
          this.removeLastFromQueue();
        
        queue.push(ch);
      }
    },
    removeLastFromQueue: function() { queue.pop(); },
    clearQueue: function() {
      queue = [0];
      inputInProcess = false;
    },
    squareCurrentInput: function() {
      var currentInput = queue.join('');
      
      // do not run immediately after an invalid input
      if (currentInput === "Invalid input")
        return;
      
      // do not run on a potentially invalid input, such as
      // an equation ending in an operator
      if (!/[0-9.]$/.test(currentInput))
        return;
      
      // calculate a valid expression before squaring
      if (/[^0-9.]/.test(currentInput)) {
        console.log(currentInput)
        this.calculate();
        var answer = [Math.pow(queue[0],2)];
      }
      else {
        var answer = [Math.pow(currentInput,2)];
      }
      queue = answer.toString().split('');
      inputInProcess = false;
    },
    updateDisplay: function() {
      var ioBox = document.getElementById("io");
      ioBox.innerHTML = queue.join('');
      if (queue.length > 29)
        ioBox.style.fontSize = "0.8em";
      else if (queue.length > 25)
        ioBox.style.fontSize = "0.9em";
      else
        ioBox.style.fontSize = "1em";
    }
  }
})();

// style functions for buttons on/off hover
function highlightButton() {
  this.style.background = "blue";
  this.style.color = "white";
}
function unhighlightButton() {
  this.style.background = null;
  this.style.color = null;
}

// event handler functions
function keyboardButtonHighlight(e) {
  var buttonId;
  if (e.keyCode === 8) {
    buttonId = "backspace";
  } else if (e.keyCode === 13) {
    buttonId = "equals";
  } else {
    buttonId = calc.getCommandFromKeyCode(e.keyCode);
  }
  var button = document.getElementById(buttonId);
  button.style.background = "blue";
  button.style.color = "white";
}
function handleKeyboardInput(e) {
  var ch = calc.getCommandFromKeyCode(e.keyCode);
  if (e.keyCode === 13) {
    ch = "equals";
    calc.calculate();
  }
  // else if (e.keyCode === 8) {
  //   ch = "backspace";
  //   calc.removeLastFromQueue();
  // }
  else if (ch !== undefined) {
    calc.addToQueue(ch);
  }
  if (ch !== undefined) {
    button = document.getElementById(ch);
    button.style.background = null;
    button.style.color = null;
  }
  calc.updateDisplay();
}
function buttonClickHandler() {
  var buttonId = this.id;
  switch (buttonId) {
    case "clear":
      calc.clearQueue();
      break;
    case "backspace":
      calc.removeLastFromQueue();
      break;
    case "square":
      calc.squareCurrentInput();
      break;
    case "equals":
      calc.calculate();
      break;
    default:
      calc.addToQueue(buttonId);
  }
  calc.updateDisplay();
}

// event listener assignments
var buttons = document.getElementsByClassName("col-xs-3");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("mouseover", highlightButton);
  buttons[i].addEventListener("mouseout", unhighlightButton);
  buttons[i].addEventListener("click", buttonClickHandler);
}

var calcArea = document.getElementById("calc");

calcArea.addEventListener("mousedown", function(e) {e.preventDefault();});

window.addEventListener("keydown", keyboardButtonHighlight);
window.addEventListener("keyup", handleKeyboardInput);

calc.updateDisplay();
window.focus();
}
// Comment this out when debugging in codepen,
// It will keep grabbing focus otherwise
// window.onload = function() {
//   window.focus();
// };