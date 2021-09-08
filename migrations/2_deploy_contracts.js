const TypicalProduct = artifacts.require("TypicalProduct");

module.exports = function(deployer) {
  deployer.deploy(TypicalProduct);
};
