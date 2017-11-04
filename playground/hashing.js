const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var salt = '123abc';
var token = jwt.sign(data, salt);
console.log("coded: ", token);

var decoded = jwt.verify(token, salt);
console.log("decoded: ", decoded);

// var message = "i am user number 3";
// var hash = SHA256(message).toString();
//
// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + "somerandomsalt").toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data)+ "somerandomsalt").toString();
//
// if(resultHash===token.hash){
//   console.log('Data was not changed, trust');
// }else {
//   console.log('Data was changed, do not trust');
// }
