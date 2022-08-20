import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { createUserProfileHandler } from '../pages/abi/User/createUserProfile';
import React from 'react';
import { useRecoilState } from 'recoil';
import { userProfileState } from '../utils/recoil-helper';

export default function Profile(props: any) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);

  const contract = props.contract;
  return (
    <Container maxWidth='sm' id='profile'>
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
          disabled={userProfile.isActive}
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
          disabled={userProfile.isActive}
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
          disabled={userProfile.isActive}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={(event) => {
            console.log(event);
            createUserProfileHandler(contract, userProfile);
            setUserProfile({
              ...userProfile,
              isActive: true,
            });
          }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

module.exports = Profile;
