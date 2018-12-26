pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract DappTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {
	constructor(
		uint256 _rate, 
		address _wallet, 
		ERC20 _token,
		uint256 _cap
	) 
		Crowdsale(_rate, _wallet, _token) 
		CappedCrowdsale(_cap)
		public {
		
	}
}