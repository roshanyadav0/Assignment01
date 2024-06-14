// DataCard.js

import React from 'react';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    content: {
        textAlign: 'center',
    },
});

const DataCard = ({ title, children }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    {title}
                </Typography>
                <div className={classes.content}>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
};

export default DataCard;
