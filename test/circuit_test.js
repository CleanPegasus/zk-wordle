const chai = require('chai');
const { wasm } = require('circom_tester');
const path = require("path");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const wasm_tester = require("circom_tester").wasm;

const assert = chai.assert;

describe("Wordle Test ", function (){
    this.timeout(100000);

//     it("Should output the greatest value from an array ", async()=>{
//       const circuit = await wasm_tester(path.join(__dirname,"../circuits","wordle.circom"));
//       await circuit.loadConstraints();
      
//       const expectedOutput =BigInt("13228398647784447210439614471177094041448537357530375455925342970514529536310");
      
//       let witness = await circuit.calculateWitness({"in_arr": [1, 6, 3, 4, 5]},true);
//       console.log(witness[1]);
//   })


    // it("Should return the right status of letter ", async()=>{
    //     const circuit = await wasm_tester(path.join(__dirname,"../circuits","wordle.circom"));
    //     await circuit.loadConstraints();
        
    //     let witness = await circuit.calculateWitness({
    //         "letter": 10,
    //         "index" : 2,
    //         "answer": [2, 10, 6, 10, 6]
    //     }, true);

    //     console.log(witness[1]);
    // })

    it("Should test the wordle template ", async()=>{
        const circuit = await wasm_tester(path.join(__dirname,"../circuits","wordle.circom"));
        await circuit.loadConstraints();
        
        let witness = await circuit.calculateWitness({
            "attempts": [[1, 2], [2, 10]],
            "answer": [2, 10]
        }, true);

        // console.log(witness);
    })

})