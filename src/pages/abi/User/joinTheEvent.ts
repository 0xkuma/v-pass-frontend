import { Contract } from 'ethers';

export const joinTheEventHandler = async (contract: Contract) => {
  const tx = await contract.joinTheEvent();
  console.log(tx);
  return tx;
};

module.exports = { joinTheEventHandler };
