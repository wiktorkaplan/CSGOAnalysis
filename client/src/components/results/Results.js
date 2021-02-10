import React from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Scoreboard from '../scoreboard/Scoreboard';
import { connect } from 'react-redux';
import Rounds from '../rounds/Rounds';
import Weapons from '../weapons/Weapons';
import Economy from '../economy/Economy';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import KeyboardBacks from '@material-ui/icons/KeyboardBackspaceOutlined';
import FormatList from '@material-ui/icons/FormatListNumberedOutlined';
import Filter1 from '@material-ui/icons/Filter1Outlined';
import Mouse from '@material-ui/icons/MouseOutlined';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';


function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <Link to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(12),
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    padding: theme.spacing(3),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menuButton: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Results = (props) => {
  let colorCT;
  let colorT;
  if (props.data.ctScore > props.data.tScore) {
    colorCT = 'green';
    colorT = 'red';
  } else if (props.data.ctScore < props.data.tScore) {
    colorCT = 'red';
    colorT = 'green';
  } else {
    colorCT = 'black';
    colorT = 'black';
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const getTime = (unix_timestamp) => {
    var date = new Date(unix_timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}>

        <Toolbar />

        <div className={classes.drawerContainer}>
          <List >
            <ListItemLink to="/profile" primary="Back to my matches" icon={<KeyboardBacks />} />
          </List>

          <Divider />

          <CardContent>
            <CardHeader
              action={
                <Typography variant="h4" style={{
                  color: colorCT,
                  marginTop: 10,
                  marginRight: 0,
                }}>{props.data.ctScore}</Typography>
              }
              title={<Typography variant="h5">{props.data.ctClanName}</Typography>}
              subheader={<Typography variant="p" color="textSecondary">Counter-Terrorists</Typography>}
            />
            <CardHeader
              action={
                <Typography variant="h4" style={{
                  color: colorT, marginTop: 10,
                  marginRight: 0
                }}>{props.data.tScore}</Typography>
              }
              title={<Typography variant="h5">{props.data.tClanName}</Typography>}
              subheader={<Typography variant="p" color="textSecondary">Terrorists</Typography>}
            />
            <Divider />
            <CardHeader
              title={<Typography variant="subtitle2" color="textSecondary">Date:</Typography>}
              subheader={<Typography variant="body1" >{getTime(props.data.date)}</Typography>}
            />
            <CardHeader
              title={<Typography variant="subtitle2" color="textSecondary" style={{ marginTop: -10 }}>Map:</Typography>}
              subheader={<Typography variant="body1" >{props.data.map}</Typography>}
            />
            <CardHeader
              title={<Typography variant="subtitle2" color="textSecondary" style={{ marginTop: -10 }} >Game length:</Typography>}
              subheader={<Typography variant="body1" style={{ marginBottom: -20 }}>{props.data.gameLength}</Typography>}
            />
          </CardContent>

          <Divider />

          <List>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              centered
              aria-label="Second many"
              indicatorColor="primary"
              textColor="primary"
              className={classes.tabs}
            >
              <Tab label="Scoreboard" icon={<FormatList />}{...a11yProps(0)} />
              <Tab label="Rounds" icon={<Filter1 />} {...a11yProps(1)} />
              <Tab label="Weapons" icon={<Mouse />} {...a11yProps(2)} />
              <Tab label="Economy" icon={<Mouse />} {...a11yProps(3)} />
              {/* <Tab label="Performance" icon={<Timeline />} {...a11yProps(4)} /> */}
            </Tabs>
          </List>
        </div>
      </Drawer>

      <main className={classes.content}>
        <Toolbar />
        <TabPanel value={value} index={0}><Scoreboard></Scoreboard></TabPanel>
        <TabPanel value={value} index={1}><Rounds></Rounds></TabPanel>
        <TabPanel value={value} index={2}><Weapons></Weapons></TabPanel>
        <TabPanel value={value} index={3}><Economy></Economy></TabPanel>
        {/* <TabPanel value={value} index={4}></TabPanel> */}
      </main>

    </div >
  )
}

function mapStateToProps(state) {
  if (Object.entries(state).length === 0) {
    return {};
  }
  return {
    data: state.results
  }
}

export default connect(mapStateToProps)(Results);