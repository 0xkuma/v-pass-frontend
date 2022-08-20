import { Contract } from 'ethers';
import { decrpytHandler } from '../../../utils/crypto';

interface UserProfile {
  userName: string;
  idNumber: string;
  birthDate: string;
  isActive: boolean;
  numVaccinations: number;
}

// for timestamp to 'yyyy-MM-dd' format
const formatDate = (date: string | number | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const hexToDec = (hex: number): number => {
  return parseInt(hex.toString(16), 16);
};

export const getUserProfileHandler = async (
  contract: Contract,
  address: string,
): Promise<UserProfile> => {
  let userProfile: UserProfile;
  const tx = await contract.getUserProfile();
  console.log(tx);
  userProfile = {
    userName: await decrpytHandler(tx[0], address),
    idNumber: await decrpytHandler(tx[1], address),
    birthDate: formatDate(hexToDec(parseInt(await decrpytHandler(tx[2], address)))),
    isActive: tx[3],
    numVaccinations: hexToDec(parseInt(tx[4])),
  };
  return userProfile;
};

module.exports = { getUserProfileHandler };
