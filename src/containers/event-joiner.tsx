import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Button,
  Box,
  CardActionArea,
  CardActions,
  Container,
  Collapse,
  Alert,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import { userProfileState } from '../utils/recoil-helper';
import ScrollDialog from '../components/event-joiner-dialog';
import ReactDOM from 'react-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function EventJoiner(props: any) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const numVaccinationsChecker = () => {
    if (userProfile.numVaccinations === 0) {
      console.log('no vaccinations');
      setOpen(true);
    } else {
      console.log('vaccinations');
      setDialogOpen(true);
    }
  };

  const alertFormat = () => {
    if (success) {
      return (
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
          You have successfully joined the event!
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
                setOpen(false);
              }}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }>
          You have no vaccinations yet.
        </Alert>
      );
    }
  };

  return (
    <>
      <Container maxWidth='lg' id='profile'>
        <div id='alert'>
          <Collapse in={open}>{alertFormat()}</Collapse>
        </div>
        <Box sx={{ my: 3 }}>
          <Typography color='textPrimary' variant='h4'>
            Event Register
          </Typography>
        </Box>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component='img'
              height='140'
              image='./assets/images/event/c3afa2019.jpeg'
              alt='green iguana'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                C3AFA HK
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                「C3AFA HK Cosplay大激鬥」就快截止！　馬上報名競逐WCS香港代表席位 「C3AFA HK
                Cosplay大激鬥」下星期五就截止報名啦！
                如果想爭取機會代表香港同超過40個國家嘅頂尖隊伍喺日本名古屋切磋交流，和參與WCS精心安排嘅跨文化旅程。好簡單唧，即刻下載報名表，喺12月6日前報名參加啦！記得把握最後機會呀！
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary' onClick={numVaccinationsChecker}>
              Join
            </Button>
          </CardActions>
        </Card>
      </Container>
      <div id='dialog'>
        <ScrollDialog
          dialogOpen={dialogOpen}
          contract={props.contract}
          onClick={(event: any) => {
            setDialogOpen(event.dialogOpen);
            if (event.success) {
              setSuccess(event.success);
              setOpen(true);
            }
          }}
        />
      </div>
    </>
  );
}

module.exports = EventJoiner;
