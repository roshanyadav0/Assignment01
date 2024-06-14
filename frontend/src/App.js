// src/App.js

import React from 'react';
import Dashboard from './components/Dashboard';
import { Container, Typography } from '@material-ui/core';

function App() {
    return (
        <Container>
            <Typography variant="h3" align="center" style={{ margin: '20px 0' }}>
                Data Dashboard
            </Typography>
            <Dashboard />
        </Container>
    );
}

export default App;
