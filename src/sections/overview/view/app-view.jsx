import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Typography from '@mui/material/Typography';

import { Input, Button } from '@mui/material';

import { Progress, message } from 'antd';

import AppCalendar from '../app-calendar';
import {fetchData} from '../app-init-HA';
// ----------------------------------------------------------------------

export default function AppView() {
  const [initStatus, setInitStatus] = useState(0);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState([]);
  useEffect(() => {
    const _fetchData = async () => {
      const data = await fetchData();
      console.log(data, '-----------');
      if (data) {
        let cnt = 0;
        const result = data.map((item) => {
          cnt++;
          return item[3];
        });
        const days = getDaysBetweenMinAndMax(result);
        console.log(days, "+++++++++++++++", cnt)
        setCount(cnt);
        if (days > 12 || (days - cnt) > 1) {
          setInitStatus(2);
        } else if (cnt == 10) {
          setInitStatus(3);
        } else {
          setInitStatus(1);
        }
      }
    };
    _fetchData();
  }, [value]);
  const getDaysBetweenMinAndMax = (dates) => {
    // Convert date strings to Date objects
    const dateObjects = dates.map((date) => new Date(date));

    // Find minimum and maximum dates
    const minDate = new Date(Math.min(...dateObjects));
    const maxDate = new Date(Math.max(...dateObjects));

    // Calculate the difference in milliseconds
    const diffTime = Math.abs(maxDate - minDate);

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Welcome 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={3} lg={12}>
          <Card>
            <CardHeader
              title="Current Progress"
              subheader="Initial Heat Acclimatization state"
            />
            <Box sx={{ mx: 1 }} p={4}>
              {initStatus == 1 ? (
                <Progress percent={count * 10} />
              ) : initStatus == 2 ? (
                <Progress percent={count * 10} status="exception" />
              ) : initStatus == 3 ? (
                <Progress percent={100} />
              ) : (
                <Progress percent={0} />
              )}
            </Box>
          </Card>
        </Grid>

        <AppCalendar value={value} setValue={setValue}/>
      </Grid>
    </Container>
  );
}
