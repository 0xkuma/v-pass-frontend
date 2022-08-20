import { Card, CardContent, CardHeader, CardActions, Grid, Typography } from '@mui/material';
import { Container } from '@mui/system';

// for timestamp to 'yyyy-MM-dd' format
const formatDate = (date: number) => {
  const d = new Date(date * 1000);
  return d.toISOString().split('T')[0];
};

const hexToDec = (hex: number): number => {
  return parseInt(hex.toString(16), 16);
};

const VaccineCard = (props: any) => {
  console.log('props: ', props);
  return (
    <>
      <Card sx={{ minWidth: 275, borderRadius: 2, boxShadow: 1, mb: 1 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            Vaccine Type
          </Typography>
          <Typography sx={{ mb: 1 }} variant='h5' component='div'>
            {props.vYype}
          </Typography>
          <Typography sx={{ mb: 0.5 }} color='text.secondary'>
            Loaction
          </Typography>
          <Typography variant='body2'>{props.vLocation}</Typography>
        </CardContent>
        <CardActions>{formatDate(hexToDec(parseInt(props.vTime)))}</CardActions>
      </Card>
    </>
  );
};

export default VaccineCard;
