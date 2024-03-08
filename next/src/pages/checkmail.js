import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard() {
  return (
    <div style={{ display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
             }}>
        <Card sx={{ maxWidth: 700,
         boxShadow: '9px 9px 30px rgba(0, 0, 0, 0.9)',
         }}>
          <CardMedia
            sx={{ height: 400 }}
            image="follow-up-emails-cover-900x470.jpg"
            title="green iguana"
          />
          <CardContent>
            <Typography variant="body2" color="brown"  sx={{ fontSize: '1.5rem', fontFamily: 'Georgia' }}>
              Проверьте вашу почту и перейдите по ссылке.
            </Typography>
          </CardContent>

        </Card>
    </div>
  );
}
