import { ethers, providers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import VaccinePassport from '../common/VaccinePassport.json';

const NETWORK = process.env.NETWORK || 'http://13.250.52.3:8545';
const INFURA_ID = process.env.INFURA_ID || '30f1c72e308a458fa5a036dc887fa03b';
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || '0xe2031199C6833F3aDdF6Fa90C7b7bf317D239b97';

let hWeb3Modal: Web3Modal;
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID,
    },
  },
};

export const connectWalletHandler = async () => {
  const abi = (VaccinePassport as any).abi;
  hWeb3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: false,
    providerOptions,
  });
  const provider = await hWeb3Modal.connect();
  const hWeb3Provider = new providers.Web3Provider(provider);
  const signer = hWeb3Provider.getSigner();
  const hContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  const hAddress = await signer.getAddress();
  return { hWeb3Modal, hWeb3Provider, hContract, hAddress };
};
