import ether from './helpers/ether';

const BigNumber = web3.BigNumber;

require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

const DappToken = artifacts.require('DappToken');
const DappTokenCrowdsale = artifacts.require('DappTokenCrowdsale');

contract('DappTokenCrowdsale', function([_, wallet, investor1, investor2]) {


	beforeEach(async function() {
		// Token config
		this.name = "DappToken";
		this.symbol = "DAPP";
		this.decimals = 18;

		this.token = await DappToken.new(this.name, this.symbol, this.decimals);

		// Crowdsale config
		this.rate = 500;
		this.wallet = wallet;
		this.cap = ether(100);

		this.crowdsale = await DappTokenCrowdsale.new(this.rate, this.wallet, this.token.address, this.cap);

		// Transfer token owenship to crowdsale
		await this.token.transferOwnership(this.crowdsale.address);
	});

	describe('crowdsale', function() {
		it('tracks the rate', async function() {
			const rate = await this.crowdsale.rate();
			rate.should.be.bignumber.equal(this.rate);
		})
		it('tracks the wallet', async function() {
			const wallet = await this.crowdsale.wallet();
			wallet.should.equal(this.wallet);
		})
		it('tracks the token', async function() {
			const token = await this.crowdsale.token();
			token.should.equal(this.token.address);
		})
	})

	describe('minted crowdsale', function() {
		it('mints tokens after purchase', async function() {
			const originalTotalSupply = await this.token.totalSupply();
			await this.crowdsale.sendTransaction({value: ether(1), from: investor1});
			const newTotalSupply = await this.token.totalSupply();
			assert.isTrue(newTotalSupply > originalTotalSupply);
		})
	})

	describe('capped crowdsale', async function() {
		it('has the correct hard cap', async function() {
			const cap = await this.crowdsale.cap();
			cap.should.be.bignumber.equal(this.cap);
		})
	})

	describe('accepting payments', function() {
		it('should accept payments', async function() {
			const value = ether(1);
			const purchaser = investor2;
			await this.crowdsale.sendTransaction({value: value, from: investor1}).should.be.fulfilled;
			await this.crowdsale.buyTokens(investor1, {value: value, from: purchaser}).should.be.fulfilled;
		})
	})
});


