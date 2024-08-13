import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

import LoadingButton from '@mui/lab/LoadingButton';


import { useRouter } from 'src/routes/hooks';

import { CardMedia } from '@mui/material';
import Iconify from 'src/components/iconify';


import { useGoogleLogin } from '@react-oauth/google';

import {  message } from 'antd';
// ----------------------------------------------------------------------

export default function LoginView() {
  const [ user, setUser ] = useState([]);
  const router = useRouter();

  const handleClick = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });


  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Login success',
    });
  };

  useEffect(
    () => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    router.push('/dashboard');
                    success();
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
  );

  return (
    <Box
    sx={{
      height: 1,
      backgroundImage: `url('/assets/background/overlay_4.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
    >
      {contextHolder}

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
            textAlign:'-webkit-center',
          }}
        >
          <Typography variant="h4">Sign In</Typography>

          <CardMedia
            component="img"
            image='./assets/login.svg'
            sx={{ width: '15rem', height: '15rem', zIndex: 5, padding:'2rem', textAlign:'center',}}
          />
          <div>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleClick}
            >
              Login with Google &nbsp; &nbsp; &nbsp;<Iconify icon="eva:google-fill" color="#DF3E30" />
            </LoadingButton>
          </div>
        </Card>
      </Stack>
    </Box>
  );
}
