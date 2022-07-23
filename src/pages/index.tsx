import type { NextPage } from 'next';
import { ChangeEvent, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  CSSObject,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  TextField,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useRecoilState } from 'recoil';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { txIdState, openState, userProfileState, disableItemState } from '../utils/recoil-helper';
import { connectWalletHandler } from '../utils/wallet-helper';
import { createUserProfileHandler } from './abi/User/createUserProfile';
import { isExistingUserHandler } from './abi/User/isExistUser';
import { getUserProfileHandler } from './abi/User/getUserProfile';
import AppBar from '../components/appbar';
import Drawer from '../components/drawer';
import DrawerHeader from '../components/drawer-header';
import React from 'react';
import { encrtpyHandler, decrpytHandler } from '../utils/crypto';

let web3Modal: Web3Modal;
let web3Provider: ethers.providers.Web3Provider;
let contract: ethers.Contract;

const Home: NextPage = () => {
  // const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState);
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [disableItem, setDisableItem] = useRecoilState(disableItemState);

  const theme = useTheme();
  const [open, setOpen] = useRecoilState(openState);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        web3Modal.clearCachedProvider();
        setUserProfile({
          walletAddress: '',
          walletAddressShorthand: '',
          userName: '',
          idNumber: '',
          birthDate: '',
        });
      });
      window.ethereum.on('accountsChanged', () => {
        web3Modal.clearCachedProvider();
        setUserProfile({
          walletAddress: '',
          walletAddressShorthand: '',
          userName: '',
          idNumber: '',
          birthDate: '',
        });
      });
    }
  }, [setUserProfile, userProfile]);

  const shorthandAddress = (address: string) => {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
  };

  const connectWallet = async () => {
    const { hWeb3Modal, hWeb3Provider, hContract, hAddress } = await connectWalletHandler();
    web3Modal = hWeb3Modal;
    web3Provider = hWeb3Provider;
    contract = hContract;
    console.log(contract);
    const address = hAddress;
    if (await isExistingUserHandler(contract)) {
      const res = await getUserProfileHandler(contract, address);
      setUserProfile(
        Object.assign(
          {
            walletAddress: address,
            walletAddressShorthand: shorthandAddress(address),
          },
          res,
        ),
      );
    } else {
      setDisableItem(false);
      setUserProfile({
        walletAddress: address,
        walletAddressShorthand: shorthandAddress(address),
        userName: '',
        idNumber: '',
        birthDate: '',
      });
    }
  };

  const disconnectWallet = async () => {
    web3Modal.clearCachedProvider();
    setUserProfile({
      walletAddress: '',
      walletAddressShorthand: '',
      userName: '',
      idNumber: '',
      birthDate: '',
    });
    setDisableItem(true);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let encryptWord: string;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            V-Pass
          </Typography>
          {!userProfile.walletAddress ? (
            <Button color='inherit' variant='outlined' onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Button color='inherit' variant='outlined' onClick={disconnectWallet}>
              Disconnect
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <Chip label={userProfile.walletAddressShorthand} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Profile', 'Vaccine Passport'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => {
                  console.log(text);
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  {index % 2 === 0 ? <PersonIcon /> : <VaccinesIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box
        component='main'
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
          p: 8,
        }}>
        <Container maxWidth='sm'>
          <form>
            <Box sx={{ my: 3 }}>
              <Typography color='textPrimary' variant='h4'>
                Your Profile
              </Typography>
            </Box>
            <TextField
              fullWidth
              label='Wallet Address'
              margin='normal'
              name='address'
              type='address'
              value={userProfile.walletAddress}
              variant='outlined'
              disabled
            />
            <TextField
              fullWidth
              label='Name'
              margin='normal'
              name='userName'
              type='text'
              value={userProfile.userName}
              onChange={(event) => {
                setUserProfile({ ...userProfile, userName: event.target.value });
              }}
              variant='outlined'
              disabled={disableItem}
            />
            <TextField
              fullWidth
              label='ID Number'
              margin='normal'
              name='idNumber'
              type='text'
              value={userProfile.idNumber}
              onChange={(event) => {
                setUserProfile({ ...userProfile, idNumber: event.target.value });
              }}
              variant='outlined'
              disabled={disableItem}
            />
            <TextField
              fullWidth
              margin='normal'
              name='birthDate'
              type='date'
              value={userProfile.birthDate}
              onChange={(event) => {
                setUserProfile({ ...userProfile, birthDate: event.target.value });
              }}
              variant='outlined'
              disabled={disableItem}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={(event) => {
                console.log(event);
                createUserProfileHandler(contract, userProfile);
              }}>
              Submit
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
