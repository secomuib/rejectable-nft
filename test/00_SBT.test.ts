import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import { Contract } from 'ethers';

chai.use(waffle.solidity);
const { expect } = chai;

const NFT_NAME = 'NFT test';
const NFT_SYMBOL = 'NFT1';
const RNFT_NAME = 'Rejectable NFT test';
const RNFT_SYMBOL = 'RNFT1';
const BASE_URI = 'https://example.com/nft';

describe('RejectableNFT', () => {
  let nft: Contract;
  let rejectableNFT: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    // deploy NFT
    const NFT = await ethers.getContractFactory('NFT');
    nft = await NFT.deploy(NFT_NAME, NFT_SYMBOL);
    await nft.deployed();

    // deploy RejectableNFT
    const RejectableNFT = await ethers.getContractFactory('RejectableNFT');
    rejectableNFT = await RejectableNFT.deploy(RNFT_NAME, RNFT_SYMBOL);
    await rejectableNFT.deployed();
  });

  /**
   * Deployment
   */
  describe('Deployment', () => {
    it('Contracts deployed successfully', async () => {
      expect(nft.address).to.not.be.undefined;
      expect(rejectableNFT.address).to.not.be.undefined;
    });

    it('Check name and symbol', async () => {
      expect(await nft.name()).to.be.equal(NFT_NAME);
      expect(await nft.symbol()).to.be.equal(NFT_SYMBOL);
      expect(await rejectableNFT.name()).to.be.equal(RNFT_NAME);
      expect(await rejectableNFT.symbol()).to.be.equal(RNFT_SYMBOL);
    });
  });

  /**
   * Ownership
   */
  describe('Ownership', () => {
    it('Check owner', async () => {
      expect(await nft.owner()).to.be.equal(owner.address);
      expect(await rejectableNFT.owner()).to.be.equal(owner.address);
    });

    it('Non owner can\'t transfer ownership', async () => {
      await expect(
        nft.connect(user1).transferOwnership(owner.address)
      ).to.be.reverted;
      await expect(
        rejectableNFT.connect(user1).transferOwnership(owner.address)
      ).to.be.reverted;
    });

    it('Owner can transfer ownership', async () => {
      expect(await nft.owner()).to.be.equal(owner.address);
      await nft.connect(owner).transferOwnership(user1.address);
      expect(await nft.owner()).to.be.equal(user1.address);

      expect(await rejectableNFT.owner()).to.be.equal(owner.address);
      await rejectableNFT.connect(owner).transferOwnership(user1.address);
      expect(await rejectableNFT.owner()).to.be.equal(user1.address);
    });
  });
});
