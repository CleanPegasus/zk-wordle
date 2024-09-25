pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template GreatestValue(n) {
  signal input in_arr[n];
  signal output out;

  signal gt_arr[n];
  signal temps[n];
  component gte[n];

  // TODO: Constrain signals to 0, 1, 2

  gt_arr[0] <== in_arr[0];

  for(var i=1; i<n; i++) {
    gte[i] = GreaterEqThan(8); // using 8 bit because the inputs are constrained b/w 97 and 122
    gte[i].in[0] <== gt_arr[i-1];
    gte[i].in[1] <== in_arr[i];
    temps[i] <== ((1 - gte[i].out) * in_arr[i]);
    gt_arr[i] <== (gte[i].out * gt_arr[i-1]) + temps[i];
  }

  out <== gt_arr[n-1];

}

template CheckLetterStatus(n) {
  signal input letter;
  signal input index;
  signal input answer[n];

  signal output status;

  signal statusValues[n];

  component ise[n][2];

  for(var i=0; i<n; i++) {
    // ise(letter,answer[i]) * (1 + ise(index, i))
    ise[i][0] = IsEqual();
    ise[i][0].in[0] <== letter;
    ise[i][0].in[1] <== answer[i];

    ise[i][1] = IsEqual();
    ise[i][1].in[0] <== index;
    ise[i][1].in[1] <== i;

    statusValues[i] <== ise[i][0].out * (1 + ise[i][1].out);
  }

  component gv = GreatestValue(n);
  gv.in_arr <== statusValues;

  status <== gv.out;
} 

template Wordle(n, m) {
  signal input attemps[n][m];
  signal input answer[n];
  signal output answer_hash;
  signal output out[n][m];

  signal temps[n][n][m];

  // TODO: constrain all inputs to be the ascii value
  // TODO: think about empty values too
  // a - 97
  // z - 122


  

  // for (var i=0; i<m; i++) {
  //   for(var j=0; j<n; j++) {
      
  //   }
  // }

}

component main = CheckLetterStatus(5);