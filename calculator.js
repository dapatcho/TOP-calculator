// Functions to perform calculations
let addition = (a, b) => a + b;
let subtraction = (a, b) => a - b;
let multiplication = (a, b) => a * b;
let division = (a, b) => (b !== 0 ? a / b : "Error: Cannot divide by zero");

// Default state of variables for user inputs and state tracking
let firstNum = "";
let secondNum = "";
let currentOperator = "";
let displayValue = "0";
let shouldResetDisplay = false;

// Function that receives operator and two numbers and calls a mathematical function  using those variables
let operate = (num1, num2, operator) => {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  switch (operator) {
    case "+":
      return addition(num1, num2);
    case "-":
      return subtraction(num1, num2);
    case "*":
      return multiplication(num1, num2);
    case "/":
      return division(num1, num2);
    default:
      return "Invalid operator";
  }
};

// DOM code
document.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector(".display");
  const numberButtons = document.querySelectorAll(".number-btn");
  const operationButtons = document.querySelectorAll(".operation-btn");
  const equalsButton = document.querySelector(".equals-btn");
  const clearButton = document.querySelector(".clear-btn");
  const decimalButton = document.querySelector(".decimal-btn");
  const deleteButton = document.querySelector(".delete-btn");

  // Display updater, accomodates for reset state, mirrors the current external display value display.textContent to the "memory" of what is on the display using the displayValue JS variable
  // Makes performing operations on the current value easier as there is no need to read from the DOM each time
  function updateDisplay(number) {
    if (displayValue === "0" || shouldResetDisplay) {
      display.textContent = number;
      displayValue = number;
      shouldResetDisplay = false;
    } else {
      display.textContent += number;
      displayValue += number;
    }
  }

  //DEL or backspace which removes most recently appended value
  function backspace() {
    if (displayValue.length === 1) {
      displayValue = "0";
    } else {
      displayValue = displayValue.slice(0, -1);
    }
    display.textContent = displayValue;
  }

  deleteButton.addEventListener("click", backspace);

  // Updates the display on click using number buttons
  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateDisplay(button.textContent);
    });
  });

  operationButtons.forEach((button) => {
    // Checks if previous operation matches the current operation, does nothing
    button.addEventListener("click", () => {
      if (currentOperator === button.textContent && shouldResetDisplay) {
        return;
      }

      // Stores the display value as the first number
      // If already have a first number and an operator, calculate and store result as first number
      if (firstNum === "") {
        firstNum = displayValue;
      } else if (currentOperator !== "") {
        secondNum = displayValue;
        const result = operate(firstNum, secondNum, currentOperator);
        display.textContent = result;
        displayValue = result.toString();
        firstNum = displayValue;
      }

      // Updates current operator to the button that is being pressed, and signifies that the display content should be reset.
      currentOperator = button.textContent;
      shouldResetDisplay = true;
    });
  });

  //Reset all "state" variables when CLEAR is pressed.
  function clearCalc() {
    firstNum = "";
    secondNum = "";
    currentOperator = "";
    displayValue = "0";
    display.textContent = "0";
    shouldResetDisplay = false;
  }
  clearButton.addEventListener("click", clearCalc);

  equalsButton.addEventListener("click", () => {
    if (currentOperator === "" || firstNum === "") return;
    secondNum = displayValue;
    const result = operate(firstNum, secondNum, currentOperator);
    display.textContent = result;
    displayValue = result.toString();

    firstNum = displayValue;
    currentOperator = "";
    shouldResetDisplay = true;
  });

  // Prevents multiple decimals being added
  decimalButton.addEventListener("click", () => {
    if (displayValue.includes(".")) {
      return;
    }
    updateDisplay(".");
  });

  //Keyboard support
  document.addEventListener("keydown", handleKeyboardInput);

  function handleKeyboardInput(e) {
    if (/^\d$/.test(e.key)) {
      updateDisplay(e.key);
    } else if (["+", "-", "*", "/"].includes(e.key)) {
      const operatorButton = Array.from(operationButtons).find(
        (button) => button.textContent === e.key
      );
      if (operatorButton) operatorButton.click();
    } else if (e.key === "=" || e.key === "Enter") {
      equalsButton.click();
    } else if (e.key === ".") {
      if (!displayValue.includes(".")) {
        updateDisplay(".");
      }
    } else if (e.key === "Backspace") {
      backspace();
    } else if (e.key === "Escape") {
      clearButton.click();
    }
  }
});
