const result = document.querySelector(".result");
const history = document.querySelector(".history");
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "";
let firstOperand = null;
let operator = null;
let restart = false;

function updateDisplays(originClear = false) {
  if (firstOperand !== null && operator !== null) {
    history.innerText = `${firstOperand} ${operator} ${currentNumber}`;
  } else if (firstOperand !== null) {
    history.innerText = `${firstOperand} ${operator || ""}`;
  } else {
    history.innerText = "";
  }

  if (originClear) {
    result.innerText = 0;
  } else if (firstOperand !== null && operator !== null) {
    result.innerText = `${firstOperand} ${operator} ${currentNumber || ""}`;
  } else {
    result.innerText = currentNumber || firstOperand || 0;
  }
}

function backspace() {
  if (currentNumber) {
    currentNumber = currentNumber.slice(0, -1);
  } else if (operator) {
    operator = null;
  } else if (firstOperand !== null) {
    firstOperand = parseFloat(
      firstOperand.toString().slice(0, -1) || "0"
    );
    if (firstOperand === 0) firstOperand = null;
  }
  updateDisplays();
}

function addDigit(digit) {
  if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return;

  if (restart) {
    currentNumber = digit;
    restart = false;
  } else {
    currentNumber += digit;
  }

  updateDisplays();
}

function setOperator(newOperator) {
  if (currentNumber) {
    calculate();
    firstOperand = parseFloat(currentNumber.replace(",", "."));
    currentNumber = "";
  }
  operator = newOperator;
  updateDisplays();
}

function calculate() {
  if (operator === null || firstOperand === null || !currentNumber) return;
  let secondOperand = parseFloat(currentNumber.replace(",", "."));
  let resultValue;

  switch (operator) {
    case "+":
      resultValue = firstOperand + secondOperand;
      break;
    case "-":
      resultValue = firstOperand - secondOperand;
      break;
    case "×":
      resultValue = firstOperand * secondOperand;
      break;
    case "÷":
      resultValue = firstOperand / secondOperand;
      break;
    default:
      return;
  }

  if (resultValue.toString().split(".")[1]?.length > 5) {
    currentNumber = parseFloat(resultValue.toFixed(5)).toString();
  } else {
    currentNumber = resultValue.toString();
  }

  operator = null;
  firstOperand = null;
  restart = true;

  
  result.innerText = currentNumber.replace(".", ",");
  history.innerText = "";
}

function clearCalculator() {
  currentNumber = "";
  firstOperand = null;
  operator = null;
  updateDisplays(true);
}

function setPercentage() {
  let result = parseFloat(currentNumber) / 100;

  if (["+", "-"].includes(operator)) {
    result = result * (firstOperand || 1);
  }

  if (result.toString().split(".")[1]?.length > 5) {
    result = result.toFixed(5).toString();
  }

  currentNumber = result.toString();
  updateDisplays();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.innerText;

    if (/^[0-9,]+$/.test(buttonText)) {
      addDigit(buttonText);
    } else if (["+", "-", "×", "÷"].includes(buttonText)) {
      setOperator(buttonText);
    } else if (buttonText === "=") {
      calculate();
    } else if (buttonText === "C") {
      clearCalculator();
    } else if (buttonText === "⌫") {
      backspace();
    } else if (buttonText === "%") {
      setPercentage();
    }
  });
});
