This project creates ERC-721 NFT of Typical Italian Products. 
For each product, the Product Name must be entered, 
the Type of product and the Region where it is produced.


------------------------------------------------------

1. Run "npm install" to install all node modules

2. Enable Metamask 

3. Open Ganache and check port number is equal to port into truffle-config.js file:
networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // or 7545
      network_id: "*" 
    },
}

4. Launch App with "npm run start"