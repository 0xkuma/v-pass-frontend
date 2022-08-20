import { Contract } from 'ethers';

interface UserVaccineRecord {
  walletAddress: string;
  vaccineType: string;
  location: string;
}

export const addVaccineRecord = async (
  contract: Contract,
  userVaccineRecord: UserVaccineRecord,
) => {
  const tx = await contract.addVaccineRecord(
    userVaccineRecord.walletAddress,
    userVaccineRecord.vaccineType,
    userVaccineRecord.location,
  );
  tx.wait();
  console.log(tx);
  return tx;
};

module.exports = { addVaccineRecord };
