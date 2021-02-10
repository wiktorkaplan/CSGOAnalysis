import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from './Table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    alignItems: "center",
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center'
  },
  type: {
    paddingTop: theme.spacing(1),
  },
}));

export default function Scoreboard() {
  const classes = useStyles();
  return (
    <div>
      <Container maxWidth="lg">
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5" className={classes.type}></Typography>
            <Table team="ct"></Table>

            <Typography variant="h5" className={classes.type}></Typography>
            <Table team="t"></Table>
          </Paper>
        </Grid>
      </Container>
    </div >
  );
}