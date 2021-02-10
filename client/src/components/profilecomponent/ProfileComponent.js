import React from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import ListIcon from '@material-ui/icons/List';

import ReplayCard from './ReplayCard';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        CS:GO Demo Analysis
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    minWidth: 500
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

class ProfileComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      replays: [],
      myName: String
    }
  }

  componentDidMount() {
    axios.get("/api/v1/matches")
      .then(result => {
        const res = result.data.sort((a, b) => b.date - a.date);
        this.setState({ replays: res });
      })
      .catch(e => console.log(e))
  }

  handleDelete(e) {
    const replayid = e.currentTarget.getAttribute('replayid');
    axios.delete('/api/v1/matches/' + replayid
    ).then(result => {
      const res = result.data.sort((a, b) => b.datetime - a.datetime);
      this.setState({ replays: res });
      console.log('deleted');
    }).catch(e => {
      console.log(e);
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.content}>
        <CssBaseline />

        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <ListIcon />
              </Avatar>
              <Typography component="h1" variant="h5">Your saved matches</Typography>
              <Container className={classes.container}>
                {
                  this.state.replays.length > 0 ? (this.state.replays.map(replay => (
                    <ReplayCard data={replay} handleDelete={this.handleDelete.bind(this)}></ReplayCard>))) : (
                      <Typography variant="p" align="center" color="textSecondary" component="p">
                        No replays found, upload a replay <a href="/upload">here</a></Typography>)
                }
              </Container>
            </Paper>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(withRouter(withStyles(styles)(ProfileComponent)));
