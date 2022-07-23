import { Contract } from 'ethers';
import { encrtpyHandler } from '../../../utils/crypto';

interface UserProfile {
  walletAddress: string;
  walletAddressShorthand: string;
  userName: string;
  idNumber: string;
  birthDate: string;
}

export const createUserProfileHandler = async (contract: Contract, userProfile: UserProfile) => {
  console.log('start add user profile...');
  const timeStamp = new Date(userProfile.birthDate).getTime().toString();
  const encryptedData = {
    userName: await encrtpyHandler(userProfile.userName, userProfile.walletAddress),
    idNumber: await encrtpyHandler(userProfile.idNumber, userProfile.walletAddress),
    birthDate: await encrtpyHandler(timeStamp, userProfile.walletAddress),
  };
  const tx = await contract.createUserProfile(
    encryptedData.userName,
    encryptedData.idNumber,
    encryptedData.birthDate,
  );
  await tx.wait();
  console.log(tx);
};

module.exports = { createUserProfileHandler };
