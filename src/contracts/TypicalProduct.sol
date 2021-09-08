pragma solidity >=0.5.16;

import "./ERC721Full.sol";

contract TypicalProduct is ERC721Full {

  struct Product {
    string region;
    string typeProduct;
    string nameProduct;
  }

  Product[] public products;
  
  constructor() ERC721Full("TypicalProduct", "TYP") public {
  }

   function mint(string memory region, string memory typeProduct, string memory nameProduct) public {
    Product memory p = Product(region, typeProduct,nameProduct);
    uint _id = products.push(p);
    _mint(msg.sender, _id);
   }
}
