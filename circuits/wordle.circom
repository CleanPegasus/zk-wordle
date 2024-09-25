pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template GreatestValue(n) {
  signal input in_arr[n];
  signal output out;

  signal gt_arr[n];
  signal temps[n];
  component gte[n];

  gt_arr[0] <== in_arr[0];

  for(var i=1; i<n; i++) {
    gte[i] = GreaterEqThan(8); // using 8 bit because the inputs are constrained b/w 97 and 122
    gte[i].in[0] <== gt_arr[i-1];
    gte[i].in[1] <== in_arr[i];
    temps[i] <== ((1 - gte[i].out) * in_arr[i]);
    log(temps[i]);
    gt_arr[i] <== (gte[i].out * gt_arr[i-1]) + temps[i];
  }

  out <== gt_arr[n-1];

}

// template Wordle(n, m) {
//   signal input attemps[n][m];
//   signal input answer[n];
//   signal output answer_hash;
//   signal output out[n][m];

//   signal temps[n][n][m];

//   // TODO: constrain all inputs to be the ascii value
//   // TODO: think about empty values too
//   // a - 97
//   // z - 122

  

//   for (var i=0; i<m; i++) {

//     for(var j=0; j<n; j++) {
      
//       for(var k)
//     }
//   }

// }

component main = GreatestValue(5);