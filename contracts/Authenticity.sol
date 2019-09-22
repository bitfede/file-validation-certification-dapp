pragma solidity ^0.5.0;

contract Authenticity {

  struct FileCertificate {
    uint fileSize;
    string fileHash;
  }

  mapping (address => Interaction[])

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData + 1;
  }
}
