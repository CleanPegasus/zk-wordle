const circomlibjs = require("circomlibjs");
const snarkjs = require("snarkjs");
const fs = require("fs");

const readline = require("readline");

function wordToLowercaseAscii(word) {
  return word.toLowerCase().split('').map(char => char.charCodeAt(0));
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function generateProof(attempts, answer) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { attempts: attempts, answer: answer }, 
    "build/wordle_js/wordle.wasm", 
    "helpers/wordle_0001.zkey");

    return [proof, publicSignals]
}

async function main(answer) {
  let results = []
  let resultsEmojis = []
  let attempts = [];

  for(var i=0; i<5; i++) {
    let attempt = await askQuestion("Attempt ", i + 1);
    attempts.push(wordToLowercaseAscii(attempt));
    let result = matchAttemptAnswer(attempt, answer);
    results.push(result);
    let resultEmoji = result.map((res) => resultToEmoji(res));
    resultsEmojis.push(resultEmoji);
    console.log(resultsEmojis);
  }
  let answer_ascii = wordToLowercaseAscii(answer);
  const [proof, publicSignals] = await generateProof(attempts, answer_ascii);

  
  console.log("proof: ", proof);
  console.log("publicSignals: ", publicSignals);

  const publicSignalsHash = publicSignals[0];


  const res = await verifyProof({proof, publicSignals, results });
  

  console.log("res: ", res);


}

async function verifyProof({proof, publicSignals, results}) {
  const vKey = JSON.parse(fs.readFileSync("verification_key.json"));
  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  
  publicSignals.pop();

  const resultFlat = results.flat(1);

  console.log("resultFkat: ", resultFlat);
  console.log("res: ", publicSignals);
  
  return res;
}

function matchAttemptAnswer(attempt, answer) {
  let answer_chars = answer.toLowerCase().split("");
  let attempt_chars = attempt.toLowerCase().split("");

  let result = [];

  for (let i = 0; i < attempt_chars.length; i++) {
    if (attempt_chars[i] === answer_chars[i]) {
      result.push(3);
    } else if (answer_chars.includes(attempt_chars[i])) {
      result.push(2);
    } else {
      result.push(1);
    }
  }

  return result;
}

function resultToEmoji(val) {
  if (val == 3) {
    return "\u{1F7E9}";
  } else if (val == 2) {
    return "\u{1F7E8}";
  } else {
    return "\u{2B1B}";
  }
}


main("hello").then(() => {
  process.exit(0);
})
