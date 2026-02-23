// 

const SHA256 = require('crypto-js/sha256');

// created CryptoBlock and constructor method and initialise its properties 
class CryptoBlock{
    constructor(index, timestamp, data, precedingHash=" "){
     this.index = index;
     this.timestamp = timestamp;
     this.data = data;
     this.precedingHash = precedingHash;
     this.hash = this.computeHash();   
      this.nonce = 0;  
    }

    // Method to calculate the hash of the block based on its properties 
   computeHash(){
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }
// A function to identify a number passed as a difficulty property.  
    // the hash of every block contains leading zeros that correspond to this difficulty.
    // The higher the difficulty level, the more time it takes to mine new blocks. 
    proofOfWork(difficulty){
        console.log("data type of difficulty" , typeof difficulty)
      while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
        // nonce value added to every hashed block so when rehashing takes place difficulty levels are still met
          this.nonce++;
          this.hash = this.computeHash();
      }        
  }
}

// Handling the opertations of the entire chain using helper methods creating new blocks and adding them to the existing chain 


class CryptoBlockchain{
    // This initiates the blockchain 
    constructor(){
        this.blockchain = [this.startGenesisBlock()];   
        this.difficulty = 4;  
    }

    // This is the initial block which is usually hardcoded with an index of 0.
    //created using the CryptoBlock Class 
    startGenesisBlock(){
        return new CryptoBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
    }

    // Getting latest block assists in ensuring the hash of the current bloack points to the hash of the previous block
    obtainLatestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    } 
    // adds a new block to the chain 
    addNewBlock(newBlock){
        // set the previous has to the new block to be equal to the hash of the last block in the chain
        newBlock.precedingHash = this.obtainLatestBlock().hash;

        //newBlock.hash = newBlock.computeHash(); 
        newBlock.proofOfWork(this.difficulty); 
        // after updating the hash. the new block is pushed into the blockchain array     
        this.blockchain.push(newBlock);
    }

    checkChainValidity(){
        // loop over the entirety of the blockchain (initial block is not checked since it is hardcoded )
        for(let i = 1; i < this.blockchain.length; i++){
            
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];
        // check currentBlock hash is equal to the calculation 
          if(currentBlock.hash !== currentBlock.computeHash()){
              return false;
          }
          // verfiy whether the hashes of two consecutive blocks are pointing to one another
          if(currentBlock.precedingHash !== precedingBlock.hash)
            return false;
        }
        return true;
    }

}

// create a new instance of the CryptoBlockchain class 
let smashingCoin = new CryptoBlockchain();

// add two new blocks into the blockchain 
smashingCoin.addNewBlock(new CryptoBlock(1, "01/06/2020", {sender: "Iris Ljesnjanin", recipient: "Cosima Mielke", quantity: 50}));
smashingCoin.addNewBlock(new CryptoBlock(2, "01/07/2020", {sender: "Vitaly Friedman", recipient: "Ricardo Gimenes", quantity: 100}) );



console.log(JSON.stringify(smashingCoin, null, 4));


