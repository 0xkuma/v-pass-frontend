import { atom, selector } from 'recoil';

export const walletBalanceState = atom({ key: 'walletBalanceState', default: '' });
export const txIdState = atom({ key: 'txId', default: '' });
export const openState = atom({ key: 'openState', default: false });
export const userProfileState = atom({
  key: 'userInfoState',
  default: {
    walletAddress: '',
    walletAddressShorthand: '',
    userName: '',
    idNumber: '',
    birthDate: '',
  },
});
export const disableItemState = atom({ key: 'disableItemState', default: true });
