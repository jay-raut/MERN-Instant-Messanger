import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

export default function LoadingUsersDialog() {
    return (
        <Stack spacing={1} sx={{ width: '100%', padding: 1 }}>
            <Skeleton animation="wave" variant="rectangular" height={100} />
            <Skeleton animation="wave" variant="rectangular" height={100} />
            <Skeleton animation="wave" variant="rectangular" height={100} />
            <Skeleton animation="wave" variant="rectangular" height={100} />
        </Stack>
    );
}
