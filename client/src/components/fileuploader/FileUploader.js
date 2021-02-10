import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import clsx from 'clsx';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

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

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  fileUpload: {
    padding: theme.spacing(3),
  },
  input: {
    display: 'none'
  },
  uploadFileButton: {
    display: 'none',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  spinner: {
    display: 'none',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    margin: theme.spacing(1)
  },
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
  },
  paper2: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
}));

const FileUpload = ({ dispatch }) => {
  const classes = useStyles();
  let history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  const handleFileUpload = (e) => {
    e.preventDefault();
    document.querySelector('#errormsg').style.display = 'none';
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    let formData = new FormData();
    formData.append('file', document.querySelector('#fileupload').files[0]);
    const decoded = jwt_decode(localStorage.getItem('jwtToken'));
    formData.append('userid', decoded.id);

    axios.post('/api/v1/matches', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      setSuccess(true);
      setLoading(false);
      dispatch({
        type: 'UPLOAD',
        payload: response.data,
      });
      history.push('/profile');
    }).catch((err) => {
      setSuccess(false);
      setLoading(false);
      if (err.response.status === 400) {
        if (err.response.data.playernotfound) {
          document.querySelector('#errormsg').style.display = 'inline';
        }
      }
    });
  }

  return (
    <main className={classes.content}>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        <form onSubmit={handleFileUpload}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <CloudUploadIcon />
              </Avatar>
              <Typography component="h1" variant="h5">Upload Your Replay</Typography>
              <Typography component="p" variant="p" align="center">Upload your CS:GO replay file to be processed. Your file must be a .dem file.</Typography>

              <Grid justify='center' className={classes.fileUpload}>
                <input
                  disabled={loading}
                  onChange={function (e) {
                    if (e.target.files[0]) {
                      document.querySelector('#errormsg').style.display = 'none';
                      document.querySelector('#filename').innerText = 'Chosen Replay: ' + e.target.files[0].name;
                      document.querySelector('#boxFileDetails').style.display = 'flex';
                    } else {
                      document.querySelector('#errormsg').style.display = 'inline';
                    }
                  }}
                  accept='.dem'
                  className={classes.input}
                  id="fileupload"
                  type="file"
                />
                <label htmlFor="fileupload">
                  <Button disabled={loading} id="choosereplay" variant="outlined" color="primary" component="span">Choose Replay</Button>
                </label>
              </Grid>

            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper id="boxFileDetails" className={classes.paper2} style={{ display: 'none' }} >
              <Typography id='filename' align="center" color="textSecondary" component="p"></Typography>

              <Button
                id="uploadfilebutton"
                variant="outlined"
                color="primary"
                className={buttonClassname}
                disabled={loading}
                type="submit"
              >Upload</Button>

              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}

              <Grid justify="center">
                <Typography color="error" style={{ display: 'none' }} id="errormsg">Parser error, please try again. Check the correctness of the uploaded file.</Typography>
              </Grid>
            </Paper>
          </Grid>
        </form>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </main >
  );
}

export default connect()(FileUpload);