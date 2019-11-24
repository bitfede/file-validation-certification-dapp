pragma solidity ^0.5.12;

contract Authenticity {

  event FileCertified(address author, string fileHash, uint timestamp, uint fileSize, string fileExtension);

  struct FileCertificate {
    address author;
    string fileHash;
    uint timestamp;
    uint fileSize;
    string fileExtension;
  }

  mapping (string => FileCertificate) fileCertificatesMap;

  function certifyFile(uint fileSize, string memory fileHash, string memory fileExtension) public payable {
    FileCertificate memory newFileCertificate = FileCertificate(msg.sender, fileHash, block.timestamp, fileSize, fileExtension);
    fileCertificatesMap[fileHash] = newFileCertificate;
    emit FileCertified(msg.sender, fileHash, block.timestamp, fileSize, fileExtension);
  }

  function verifyFile(string memory fileHash) public view returns (address, string memory, uint, uint, string memory) {
    return (fileCertificatesMap[fileHash].author, fileCertificatesMap[fileHash].fileHash, fileCertificatesMap[fileHash].timestamp, fileCertificatesMap[fileHash].fileSize, fileCertificatesMap[fileHash].fileExtension);
  }


}
