const solc=require('solc');
const fs = require('fs').promises;


let data
async function testGeneratorForsSolidity(contractName,inputFile,outputFile) {
  try {
    let ans=''
    let constructor=''
    data = await fs.readFile(`${inputFile}`, 'utf8');
 //console.log('Read file successfully')
  //  await fs.writeFile('./t.txt', data);
  //console.log("Taking input from file")
    const input = {
        language: 'Solidity',
        sources: {
          'test.sol': {
            content: data
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      
      //console.log("Compiling the contract")
      const output = JSON.parse(solc.compile(JSON.stringify(input)));
      //console.log("Compiled successfully")
      //console.log(output.contracts['test.sol'].MyContract)
     //
        //console.log("ABI: ",abi);
        const abi=output.contracts['test.sol'][contractName].abi;

        for(let i=0;i<abi.length;i++){
          if(abi[i].type==='constructor'){
            for(let j=0;j<abi[i].inputs.length;j++){
              if(j===0){
                constructor+=abi[i].inputs[j].name;
              }
              else{
              constructor+= ','+abi[i].inputs[j].name;}
            }
          }

        }
       // console.log(abi)
       
       for(let i=0;i<abi.length;i++){
        if(abi[i].type==='function'){
            let input=abi[i].inputs;
            let str='';
            let z='';
            for(let j=0;j<input.length;j++){
                str+='const '+input[j].name+' = ;\n';
                if(String(input[j])!='undefined'){
                  z+=input[j].name+',';
                }
            }
            ans+=`it('Test ${abi[i].name}',async()=>{
               const instance = await ${contractName}.new(${constructor});
               ${str}
               const result=await instance.${abi[i].name}(${z})
               assert.equal(result,)
          })\n`
            
        }
       }
        
       
       await fs.writeFile(outputFile,
        `
         contract('${contractName}',(accounts)=>{
                        ${ans}
})`)
  } catch (err) {
    console.error(err);
  }
}
module.exports = testGeneratorForsSolidity;



