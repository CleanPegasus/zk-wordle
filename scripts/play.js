const circomlibjs = require("circomlibjs");
const snarkjs = require("snarkjs");

const readline = require("readline");

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

async function main(answer) {
  let attempt0 = await askQuestion("Attempt 1:");
  let result = matchAttemptAnswer(attempt0, answer);
  console.log(result);
  let resultEmoji = result.map((res) => resultToEmoji(res));
  console.log(resultEmoji);
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
main("hello");
