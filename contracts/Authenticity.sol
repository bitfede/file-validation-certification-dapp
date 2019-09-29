pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Authenticity {

  struct FileCertificate {
    uint fileSize;
    string fileHash;
    uint timestamp;
  }

  mapping (address => FileCertificate[]) usersMap;

  function certifyFile(uint fileSize, string memory fileHash) public payable {
    FileCertificate memory newCertificate = FileCertificate(fileSize, fileHash, block.timestamp);
    usersMap[msg.sender].push(newCertificate);
  }

  function getHistory() public view returns(FileCertificate[] memory) {
    uint historyLen = usersMap[msg.sender].length;
    FileCertificate[] memory retValue = new FileCertificate[](historyLen);
    for (uint i = 0; i < historyLen; i++) {
        retValue[i] = usersMap[msg.sender][i];
    }
    return retValue;
  }
}
