import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Link from '@material-ui/core/Link';

import ApplicationBar from '../../components/applicationbar/ApplicationBar';
import Box from '@material-ui/core/Box';



// import { mainListItems, secondaryListItems } from './listItems';
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

const drawerWidth = 440;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
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
  },
  fixedHeight: {
    height: 240,
  },
}));

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
export default function HomeView() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.root}>
        <ApplicationBar></ApplicationBar>
        <CssBaseline />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Slider */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt maximus erat, ac varius orci aliquet vitae. Duis id ex a turpis mollis lacinia ac nec augue. Pellentesque eleifend, sem sit amet porta consequat, mi nisi placerat risus, non molestie erat mi eu lacus. Fusce nunc nulla, vehicula a sollicitudin quis, interdum ut mauris. Fusce nec leo elementum, condimentum lacus in, volutpat urna. Proin vel risus lectus. Vestibulum maximus felis sit amet ullamcorper pharetra. Etiam nunc nisi, interdum in tempus a, blandit ut ipsum. Vestibulum dictum ultrices ornare. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam eu urna dui. Morbi euismod ligula vitae neque congue finibus. Nullam in fringilla orci, sed tristique enim. Nunc consectetur mauris at blandit scelerisque.</p>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <p>Fusce consectetur suscipit felis, in suscipit tortor venenatis ac. Quisque sollicitudin viverra metus quis auctor. Aliquam dictum urna congue nibh mattis, at egestas dolor commodo. Vivamus viverra suscipit bibendum. Duis venenatis felis vitae congue semper. Etiam eu risus eu dui aliquam viverra. Pellentesque ac pellentesque tellus, quis tempus risus. Aenean facilisis arcu ut augue auctor lobortis id pellentesque enim.</p>

                  <p>Cras vel luctus arcu, vitae varius lacus. Donec aliquet consectetur enim, nec scelerisque eros. Quisque quis enim vel sem blandit tincidunt. Sed posuere, dui eu condimentum auctor, sapien erat convallis lectus, eget dignissim nulla ligula ac dui. Pellentesque at ex non sapien suscipit aliquam sed sit amet tellus. Etiam a dolor semper turpis sodales pulvinar id a massa. Donec et turpis ac nunc imperdiet luctus. Cras vulputate venenatis odio tristique tincidunt. Praesent vulputate mi quis nisl efficitur convallis. Proin id orci lectus. Nunc felis erat, sodales eget diam nec, gravida hendrerit ante.</p>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <p>Proin porta quam sem. Maecenas tincidunt nisl non metus eleifend, a volutpat tellus rhoncus. Donec quis dolor fringilla, molestie velit quis, suscipit dui. In non mauris vitae nunc sodales accumsan. Maecenas eu ullamcorper leo. Quisque ut quam condimentum, venenatis enim in, mattis diam. Vivamus metus lacus, commodo sed augue vel, ullamcorper pulvinar neque. Aliquam id nulla ac elit posuere dictum vel in urna.</p>

                  <p>Aenean dapibus elit ac felis aliquam, sed blandit sem rutrum. Sed ut euismod ligula, nec volutpat nulla. Suspendisse interdum volutpat justo non convallis. Sed a arcu nisl. Sed ornare, velit quis dignissim tempor, sapien nisl ullamcorper tellus, vel efficitur nibh eros vitae libero. Maecenas commodo odio molestie, efficitur dui eu, elementum turpis. Proin aliquet tincidunt laoreet. Pellentesque sit amet elementum risus. Sed posuere ante mauris, et fringilla sapien lacinia sit amet. Vivamus non metus in justo vehicula rhoncus non sed odio. Nunc rutrum ipsum libero, vitae facilisis justo tempus sed. Curabitur ut cursus eros. Pellentesque iaculis massa at arcu congue, et cursus justo pulvinar. Morbi ligula dolor, semper vel maximus ut, tincidunt sit amet nunc. Donec scelerisque mi quis congue bibendum.</p>

                  <p>Quisque a tellus tincidunt, dignissim est et, sollicitudin dolor. Proin eget egestas risus. Quisque ultrices tortor augue, at consequat erat ullamcorper commodo. Sed pretium suscipit est, non rutrum tortor ullamcorper nec. Vestibulum erat nibh, tempus vel lobortis vitae, lacinia id velit. Phasellus eget interdum felis, ac suscipit nunc. Curabitur tincidunt mi efficitur ante rutrum tincidunt. Aenean ultrices et tellus sed venenatis. Donec porta nisl sed laoreet tincidunt. Phasellus et porttitor quam. Quisque posuere, velit sit amet luctus porta, nunc sapien sodales nunc, sit amet laoreet mauris est sit amet justo. Sed vehicula metus in quam euismod, placerat luctus ligula volutpat. Curabitur eu semper magna. Ut dignissim, eros eget elementum tincidunt, risus nibh mollis tortor, non imperdiet ex lorem eget erat. Sed ut maximus urna, eleifend blandit augue.</p>

                  <p>Nam vitae enim tempus, pellentesque felis ut, pharetra nisl. Ut in dictum velit. Sed porta rutrum diam, eu mollis magna pharetra et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam ac vulputate metus, rutrum venenatis dolor. Duis at dapibus nibh, non euismod felis. Nullam in interdum risus, non placerat mi. Curabitur pulvinar sit amet urna sit amet porta. Sed ac nibh quis dolor gravida semper vitae eu nunc. Maecenas a porta ex. Curabitur efficitur luctus odio, vel facilisis nisi.</p>
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </React.Fragment >
  );
}