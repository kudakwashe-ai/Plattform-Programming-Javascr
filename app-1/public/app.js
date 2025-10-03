let x = 10;
let y = 20;

let temp = x; // store x temporarily
x = y;        // assign y to x
y = temp;     // assign temp (old x) to y

console.log("x:", x); // 20
console.log("y:", y); // 10
