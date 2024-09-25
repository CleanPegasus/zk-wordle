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


    it("Should return the right status of letter ", async()=>{
        const circuit = await wasm_tester(path.join(__dirname,"../circuits","wordle.circom"));
        await circuit.loadConstraints();
        
        let witness = await circuit.calculateWitness({
            "letter": 10,
            "index" : 2,
            "answer": [2, 10, 6, 10, 6]
        }, true);

        console.log(witness[1]);
    })



    it("Should create a Poseidon circuit and return hash ", async()=>{
        const circuit = await wasm_tester(path.join(__dirname,"../circuits","wordle.circom"));
        await circuit.loadConstraints();
        let witness; 
        
        // const expectedOutput =BigInt("13228398647784447210439614471177094041448537357530375455925342970514529536310");
        
        // witness = await circuit.calculateWitness({"a":32,"b":11,"c":99,"d":44},true);
        // assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        // assert(Fr.eq(Fr.e(witness[1]), Fr.e(expectedOutput)));

        // witness = await circuit.calculateWitness({"a":22,"b":7,"c":65,"d":623},true);
        // let expectedOutput2  = BigInt("20975096508187766231858611645250735876341389173332244772711207858519760900883");
        // assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        // assert(Fr.eq(Fr.e(witness[1]), Fr.e(expectedOutput2)));
    })
})