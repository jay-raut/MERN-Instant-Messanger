import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Stack, Typography } from '@mui/material';

export default function LoadingUsers() {
    return (
        <Stack spacing={2} sx={{ width: '100%', padding: 2 }}>
            <Skeleton animation="wave" variant="rectangular" height={100} />
            <Skeleton animation="wave" variant="rectangular" height={100} />
            <Skeleton animation="wave" variant="rectangular" height={100} />
            <Skeleton animation="wave" variant="rectangular" height={100} />
        </Stack>
    );
}
