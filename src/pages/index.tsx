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
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useRecoilState, useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { openState, userProfileState } from '../utils/recoil-helper';
import { connectWalletHandler } from '../utils/wallet-helper';
import { createUserProfileHandler } from './abi/User/createUserProfile';
import { isExistingUserHandler } from './abi/User/isExistUser';
import { getUserProfileHandler } from './abi/User/getUserProfile';
import { getUserVaccineRecordHandler } from './abi/User/getUserVaccineRecord';
import AppBar from '../components/appbar';
import Drawer from '../components/drawer';
import DrawerHeader from '../components/drawer-header';
import React from 'react';
import Profile from '../containers/profile';
import VaccineReader from '../containers/vaccine-reader';
import VaccineCreator from '../containers/vaccine-creator';
import VaccineChecker from '../containers/vaccine-checker';
import EventJoiner from '../containers/event-joiner';
import ReactDOM from 'react-dom';

let web3Modal: Web3Modal;
let web3Provider: ethers.providers.Web3Provider;
let contract: ethers.Contract;

const Home: NextPage = () => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);

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
          records: [[], [], []],
          isActive: false,
          numVaccinations: 0,
        });
      });
      window.ethereum.on('accountsChanged', () => {
        // web3Modal.clearCachedProvider();
        setUserProfile({
          walletAddress: '',
          walletAddressShorthand: '',
          userName: '',
          idNumber: '',
          birthDate: '',
          records: [[], [], []],
          isActive: false,
          numVaccinations: 0,
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
    if (await isExistingUserHandler(contract)) {
      const res = await getUserProfileHandler(contract, hAddress);
      console.log(res);
      const userVaccinesRecord = await getUserVaccineRecordHandler(contract);
      setUserProfile(
        Object.assign(
          {
            walletAddress: hAddress,
            walletAddressShorthand: shorthandAddress(hAddress),
            records: userVaccinesRecord,
          },
          res,
        ),
      );
    } else {
      setUserProfile({
        walletAddress: hAddress,
        walletAddressShorthand: shorthandAddress(hAddress),
        userName: '',
        idNumber: '',
        birthDate: '',
        records: [[], [], []],
        isActive: false,
        numVaccinations: 0,
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
      records: [[], [], []],
      isActive: false,
      numVaccinations: 0,
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

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
          <ListItem key='Profile' disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                ReactDOM.render(
                  <RecoilBridge>
                    <Profile contract={contract} />
                  </RecoilBridge>,
                  document.getElementById('main')!,
                );
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary='Profile' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key='VaccinePassport' disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                ReactDOM.render(
                  <RecoilBridge>
                    <VaccineReader contract={contract} />
                  </RecoilBridge>,
                  document.getElementById('main')!,
                );
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <VaccinesIcon />
              </ListItemIcon>
              <ListItemText primary='VaccinePassport' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key='EventJoiner' disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                ReactDOM.render(
                  <RecoilBridge>
                    <EventJoiner contract={contract} />
                  </RecoilBridge>,
                  document.getElementById('main')!,
                );
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary='EventJoiner' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key='Creator' disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                ReactDOM.render(
                  <RecoilBridge>
                    <VaccineCreator contract={contract} />
                  </RecoilBridge>,
                  document.getElementById('main')!,
                );
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary='Creator' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key='Checker' disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                ReactDOM.render(
                  <RecoilBridge>
                    <VaccineChecker contract={contract} />
                  </RecoilBridge>,
                  document.getElementById('main')!,
                );
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <FactCheckIcon />
              </ListItemIcon>
              <ListItemText primary='Checker' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component='main'
        id='main'
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
          p: 8,
        }}></Box>
    </Box>
  );
};

export default Home;
