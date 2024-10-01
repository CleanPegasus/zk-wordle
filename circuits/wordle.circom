pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template GreatestValue(n) {
  signal input in_arr[n];
  signal output out;

  signal gt_arr[n];
  signal temps[n];
  component gte[n];


  // Constrain signals to 0, 1, 2, 3
  signal constrainTemps[n][2];
  for(var i=0; i<n; i++) {
    constrainTemps[i][0] <== in_arr[i] * (in_arr[i] - 1);
    constrainTemps[i][1] <== constrainTemps[i][0] * (in_arr[i] - 2);
    constrainTemps[i][1] * (in_arr[i] - 3) === 0;
  }

  signal constrainTemp[n][2];

  for(var j=0; j < n; j++) {
    constrainTemp[j][0] <== in_arr[j] * (in_arr[j] - 1);
    constrainTemp[j][1] <== constrainTemp[j][0] * (in_arr[j] - 2);
   
    constrainTemp[j][1] * (in_arr[j] - 3) === 0;
  }

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

  // signal statusTemps[n];
  signal statusValues[n];

  component ise[n][2];
  component isz[n];

  for(var i=0; i<n; i++) {
    // ise(letter,answer[i]) * (1 + ise(index, i))
    ise[i][0] = IsEqual();
    ise[i][0].in[0] <== letter;
    ise[i][0].in[1] <== answer[i];

    ise[i][1] = IsEqual();
    ise[i][1].in[0] <== index;
    ise[i][1].in[1] <== i;

    isz[i] = IsZero();
    isz[i].in <== letter;
    statusValues[i] <== (ise[i][0].out * (1 + ise[i][1].out) + 1) - isz[i].out;
  }

  component gv = GreatestValue(n);
  gv.in_arr <== statusValues;
  status <== gv.out;
}

template ConstrainLimit(startVal, endVal) {
  signal input in;
  signal output out;
  signal temps[endVal-startVal+1];

  temps[0] <== (in - startVal);
  for(var i=startVal+1; i<=endVal; i++) {
    temps[i - startVal] <== temps[i - startVal - 1] * (in - i);
  }
  temps[endVal-startVal] === 0;
}

template Wordle(n, m) {
  signal input attempts[n][m];
  signal input answer[m];
  signal output answer_hash;
  signal output out[n][m];


  // empty letter = 0
  // a - 97
  // z - 122
  component attemptsLimitConstrains[n][m];
  for(var i=0; i<m; i++) {
    for(var j=0; j<n; j++) {
      attemptsLimitConstrains[i][j] = ConstrainLimit(97, 122);
      attemptsLimitConstrains[i][j].in <== attempts[i][j];
      attemptsLimitConstrains[i][j].out * attempts[i][j] === 0; // attempts[i][j] can be zero
    }
  }

  component answerLimitConstrains[n];
  for(var i=0; i<n; i++) {
    answerLimitConstrains[i] = ConstrainLimit(97, 122);
    answerLimitConstrains[i].in <== answer[i];
  }

  component letterStatus[n][m];  

  for(var i=0; i<m; i++) {
    for(var j=0; j<n; j++) {

      letterStatus[i][j] = CheckLetterStatus(n);
      letterStatus[i][j].letter <== attempts[i][j];
      letterStatus[i][j].index <== j;
      letterStatus[i][j].answer <== answer;

      out[i][j] <== letterStatus[i][j].status;
    }
  }

  component poseidon = Poseidon(m);
  poseidon.inputs <== answer;
  answer_hash <== poseidon.out;

}

component main = Wordle(5, 5);