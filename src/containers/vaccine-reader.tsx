import React, { useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Grid } from '@mui/material';
import { useRecoilState } from 'recoil';
import { userProfileState } from '../utils/recoil-helper';
import VaccineCard from '../components/vaccine-card';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import { getSecretKey } from '../utils/crypto';

export default function VaccineReader(props: any) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  useEffect(() => {
    let token = jwt.sign(
      {
        walletAddress: userProfile.walletAddress,
        isActive: true,
        numVaccination: userProfile.numVaccinations,
      },
      getSecretKey(),
      { expiresIn: '5m' },
    );
    const qrcodeGenerator = async () => {
      await QRCode.toCanvas(document.getElementById('qrcode'), token);
    };
    qrcodeGenerator();
  }, [userProfile.numVaccinations, userProfile.walletAddress]);

  return (
    <Container maxWidth='sm' id='vaccine-reader'>
      <form>
        <Box sx={{ my: 3 }}>
          <Typography color='textPrimary' variant='h4'>
            Vaccine Record
          </Typography>
        </Box>
        <canvas id='qrcode' width='300' height='300'></canvas>
        {/* <Image blurDataURL={qrcode} placeholder='blur' width='300' height='300' alt='qr-code' /> */}
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
        {Array.from(Array(userProfile.numVaccinations)).map(
          (_, index) => (
            console.log(_, index),
            (
              <VaccineCard
                key={index}
                vYype={userProfile.records[0][index]}
                vLocation={userProfile.records[1][index]}
                vTime={userProfile.records[2][index]}
              />
            )
          ),
        )}
      </form>
    </Container>
  );
}
