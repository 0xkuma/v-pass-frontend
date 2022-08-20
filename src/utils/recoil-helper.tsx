import { atom, selector } from 'recoil';

export const walletBalanceState = atom({ key: 'walletBalanceState', default: '' });
export const openState = atom({ key: 'openState', default: false });
export const userProfileState = atom({
  key: 'userProfileState',
  default: {
    walletAddress: '',
    walletAddressShorthand: '',
    userName: '',
    idNumber: '',
    birthDate: '',
    isActive: false,
    records: [[], [], []],
    numVaccinations: 0,
  },
});
export const userVaccineRecordState = atom({
  key: 'userVaccineRecordState',
  default: {
    walletAddress: '',
    vaccineType: '',
    location: '',
  },
});
