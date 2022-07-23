import { Contract } from 'ethers';

export const isExistingUserHandler = async (contract: Contract) => {
  const tx = await contract.isExistingUser();
  console.log(tx);
  return tx;
};

module.exports = { isExistingUserHandler };
