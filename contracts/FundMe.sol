// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();
/**
 * @title This is a crowd funding contract
 * @author Pavin Kiptoo
 * @notice This is to demo a sample contract for crowd funding
 * @dev This implements price feeds as our library
 */
contract FundMe {
    using PriceConverter for uint256;
    address[] public funders;
    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;
    mapping (address => uint256) public addressToAmountFunded;
    modifier onlyOwner {
        if(i_owner == msg.sender){
            revert FundMe__NotOwner();
        }
        _;
    }
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }
    receive() external payable{
            fund();
        }
    fallback() external payable{
        fund();
    }
    /**
     * @notice This Function funds the program
     * @dev This implements price feeds as our library
     */
    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >=10000000000, "Didn't send enough wei");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public /*onlyOwner*/{
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder]=0;
        }
        funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
        }
}