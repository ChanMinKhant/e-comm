// function can return another function

function multiplyBy(num) {
  return function (x) {
    return x * num;
  };
}

const multiplyByTwo = multiplyBy(2);
console.log(multiplyByTwo(10));

// multiplyByTwo(num) => num * 2
// multiplyByThree(num) => num * 3
// multiplyByFour(num) => num * 4

// calculate callback function

function calculate(num1, num2, cb) {
  return cb(num1, num2);
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

calculate(11, 5, add); // 16
calculate(11, 5, subtract); // 6
