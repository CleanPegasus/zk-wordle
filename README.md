# zk-Wordle
--------------------------
zk-Wordle is a zero-knowledge proof implementation of the popular word game Wordle. This project leverages cryptographic techniques to verify the correctness of a Wordle solution without revealing the solution itself.

#### Circuits
- private input signal -> answer
- private input signal -> attempts

- output signal -> final array
- output signal -> answer hash
--------------------------------
- constrain all letters to be ASCII / 0
- create an array of an attemp letter compared against all answer letter
- find the greates value of the array for each attempt letter
- create a poseidon hash of the answer

--------------------
##### How It Works

- Prompts the user for 5 attempts.
- Converts each attempt to ASCII and checks it against the answer.
- Generates and verifies a zero-knowledge proof.
- Displays the results and proof verification status.
---------------------