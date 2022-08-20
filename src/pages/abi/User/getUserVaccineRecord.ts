import { Contract } from 'ethers';

interface UserVaccineRecord {
  [key: string]: any;
}

export const getUserVaccineRecordHandler = async (contract: Contract) => {
  const tx = await contract.getUserVaccineRecord();
  console.log(tx);
  return tx;
};

module.exports = { getUserVaccineRecordHandler };
