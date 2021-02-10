import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
import RoundPanel from './RoundPanel';
import RoundResultChart from './RoundResultChart';
import RoundDamages from './RoundDamages';
import RoundRating from './RoundRating';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}))

const Rounds = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Container fixed className={classes.root}>
      <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Round Win/Loss Summary</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <RoundResultChart data={props.data}></RoundResultChart>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Players rating</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Container>
            <Typography align="left">Counter-Terrorists:</Typography>
            <RoundRating data={props.data2}></RoundRating>
            <Typography align="left" margin="100">Terrorists:</Typography>
            <RoundRating data={props.data3}></RoundRating>
          </Container>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel square expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <ExpansionPanelSummary aria-controls="panel4d-content" id="panel4d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Players damage</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Container>
            <Typography align="left" >Counter-Terrorists:</Typography>
            <RoundDamages data={props.data2}></RoundDamages>
            <Typography align="left" margin-top="100">Terrorists:</Typography>
            <RoundDamages data={props.data3}></RoundDamages>
          </Container>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel square expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <ExpansionPanelSummary aria-controls="panel5d-content" id="panel5d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Round analysis</Typography>
          <Typography className={classes.secondaryHeading}></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <RoundPanel data={props.data}></RoundPanel>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container >)
}

function mapStateToProps(state) {
  if (state.results.rounds || state.results.rating) {
    return {
      data: state.results.rounds,
      data2: state.results.rating.ct,
      data3: state.results.rating.t
    }
  }
  return {};
}

export default connect(mapStateToProps)(Rounds);