pragma solidity ^0.5.0;

contract Authenticity {
  uint storedData = 111;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData + 1;
  }
}
