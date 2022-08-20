import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Collapse,
  Alert,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import { userProfileState } from '../utils/recoil-helper';
import VaccineCard from '../components/vaccine-card';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import { getSecretKey } from '../utils/crypto';
import { QrReader } from 'react-qr-reader';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface JwtProps {
  exp: number;
  iat: number;
  isActive: boolean;
  numVaccination: number;
  walletAddress: string;
}

export default function VaccineChecker(props: any) {
  const [verify, setVerify] = React.useState({ vaild: false, open: false });

  const jwtVerify = async (token: string) => {
    try {
      const decoded = jwt.verify(token, getSecretKey());
      console.log(decoded);
      return decoded;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const alertFormat = () => {
    if (verify.vaild) {
      return (
        <Alert
          severity='success'
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setVerify({ vaild: false, open: false });
              }}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }>
          You have already completed 3 vaccinationsl.
        </Alert>
      );
    } else {
      return (
        <Alert
          severity='error'
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setVerify({ vaild: false, open: false });
              }}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }>
          You have not completed 3 vaccinations.
        </Alert>
      );
    }
  };

  return (
    <>
      <Container maxWidth='sm' id='vaccine-reader'>
        <div id='alert'>
          <Collapse in={verify.open}>{alertFormat()}</Collapse>
        </div>

        <Box sx={{ my: 3 }}>
          <Typography color='textPrimary' variant='h4'>
            Vaccine Validator
          </Typography>
        </Box>

        <QrReader
          videoId='qr-reader'
          onResult={async (result, error) => {
            if (!!result) {
              try {
                const token = (await jwtVerify(result?.getText())) as JwtProps;
                if (token.numVaccination == 3) {
                  setVerify({ vaild: true, open: true });
                } else {
                  setVerify({ vaild: false, open: true });
                }
              } catch (err) {
                setVerify({ vaild: false, open: true });
              }
              setTimeout(() => {
                setVerify({ vaild: false, open: false });
              }, 5000);
            }
          }}
          constraints={{
            width: { ideal: 640 },
            height: { ideal: 480 },
            aspectRatio: { ideal: 1, max: 1 },
          }}
        />
      </Container>
    </>
  );
}
