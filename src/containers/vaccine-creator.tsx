import { Box, Button, Container, Collapse, TextField, Typography, Alert } from '@mui/material';
import { addVaccineRecord } from '../pages/abi/Staff/addVaccineRecord';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userVaccineRecordState } from '../utils/recoil-helper';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { QrReader } from 'react-qr-reader';
import * as ReactDOM from 'react-dom';

export default function VaccineCreator(props: any) {
  const [userVaccineRecord, setUserVaccineRecord] = useRecoilState(userVaccineRecordState);
  const [open, setOpen] = React.useState(false);

  const contract = props.contract;

  const locations = [
    {
      value: 'Sun Yat Sen Memorial Park Sports Centre',
      label: 'Sun Yat Sen Memorial Park Sports Centre',
    },
    { value: 'Java Road Sports Centre', label: 'Java Road Sports Centre' },
  ];

  const vaccineTypes = [
    { value: 'CoronaVac', label: 'CoronaVac' },
    { value: 'Comirnaty', label: 'Comirnaty' },
  ];

  return (
    <Container maxWidth='sm' id='vaccine-creator'>
      <div id='alert'>
        <Collapse in={open}>
          <Alert
            severity='success'
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setOpen(false);
                }}>
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }>
            Successfully added vaccine record!!
          </Alert>
        </Collapse>
      </div>
      <form>
        <Box sx={{ my: 3 }}>
          <Typography color='textPrimary' variant='h4'>
            Vaccine Record Creator
          </Typography>
        </Box>

        <QrReader
          videoId='qr-reader'
          onResult={(result, error) => {
            if (!!result) {
              console.log(result?.getText());
              if (RegExp('^ethereum:0x[0-9a-fA-F]{40}$').test(result?.getText())) {
                const walletAddress = result?.getText().split(':')[1];
                console.log(walletAddress);
                setUserVaccineRecord({ ...userVaccineRecord, walletAddress: walletAddress });
              }
            }
            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{
            width: { ideal: 640 },
            height: { ideal: 480 },
            aspectRatio: { ideal: 1, max: 1 },
          }}
        />
        <TextField
          fullWidth
          label='Wallet Address'
          margin='normal'
          name='address'
          type='address'
          value={userVaccineRecord.walletAddress}
          onChange={(event) => {
            setUserVaccineRecord({ ...userVaccineRecord, walletAddress: event.target.value });
          }}
          variant='outlined'
        />
        <TextField
          fullWidth
          id='outlined-select-vaccine-type'
          select
          label='Select'
          value={userVaccineRecord.vaccineType}
          onChange={(event) => {
            setUserVaccineRecord({ ...userVaccineRecord, vaccineType: event.target.value });
          }}
          helperText='Please select vaccine type'>
          {vaccineTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          id='outlined-select-vaccine-type'
          select
          label='Select'
          value={userVaccineRecord.location}
          onChange={(event) => {
            setUserVaccineRecord({ ...userVaccineRecord, location: event.target.value });
          }}
          helperText='Please select location'>
          {locations.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant='contained'
          color='primary'
          onClick={(event) => {
            console.log(event);
            addVaccineRecord(contract, userVaccineRecord).then(() => {
              setOpen(true);
              setUserVaccineRecord({
                walletAddress: '',
                vaccineType: '',
                location: '',
              });
            });
          }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

module.exports = VaccineCreator;
