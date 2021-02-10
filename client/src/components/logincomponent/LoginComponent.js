import React from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from "jwt-decode";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import setAuthToken from '../../utils/setAuthToken';

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

const styles = theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {
        email: {
          error: false,
          message: ''
        },
        password: {
          error: false,
          message: ''
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: {
          email: {
            error: nextProps.errors.email ? true : false,
            message: nextProps.errors.email
          },
          password: {
            error: nextProps.errors.password ? true : false,
            message: nextProps.errors.password
          }
        }
      });
    }
  }

  handleLogin = (e) => {
    e.preventDefault();
    const credentials = {
      email: document.querySelector('#email-login').value,
      password: document.querySelector('#password-login').value,
    };
    console.log(credentials);

    axios
      .post("/api/v1/users/login", credentials)
      .then(res => {
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);

        console.log(credentials.email, credentials.password);
        console.log(token);
        const decoded = jwt_decode(token);
        this.props.dispatch({
          type: 'LOGIN',
          payload: decoded
        });

        this.props.history.push("/profile");
      })
      .catch(err => {
        this.props.dispatch({
          type: 'GET_ERRORS',
          payload: err.response.data
        })
      }
      );
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <CssBaseline />
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xs" className={classes.container}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOpenIcon />
              </Avatar>
              <Typography component="h1" variant="h5">Sign in to CS:GO Demo Analysis</Typography>
              <form className={classes.form} onSubmit={this.handleLogin}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email-login"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={this.state.errors.email.error}
                  helperText={this.state.errors.email.message}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password-login"
                  autoComplete="current-password"
                  error={this.state.errors.password.error}
                  helperText={this.state.errors.password.message}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  className={classes.submit}
                >Sign In</Button>
                <Grid container justify="center">
                  <Link href="/register" variant="body2">Don't have an account? Sign Up</Link>
                </Grid>
              </form>
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
  errors: state.errors
});
export default connect(mapStateToProps)(withRouter(withStyles(styles)(Login)));