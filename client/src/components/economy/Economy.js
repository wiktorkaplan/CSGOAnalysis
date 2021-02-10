import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
// import RoundPanel from './RoundPanel';
import EconomyResult from './EconomyResult';
import EquipmentComp from './EquipmentComp';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
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
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(2),
    }
}))

const Economy = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Container fixed className={classes.root}>
            <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Teams economy summary</Typography>
                    <Typography className={classes.secondaryHeading}>Find out your expenditure breakdown in this match</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Container>
                        <Paper className={classes.paper}>
                            <EconomyResult data={props.data}></EconomyResult>
                        </Paper>
                    </Container>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Equipment value comparison</Typography>
                    <Typography className={classes.secondaryHeading}>Find out your expenditure breakdown in this match</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Container>
                        <Paper className={classes.paper}>
                            <EquipmentComp data={props.data}></EquipmentComp>
                        </Paper>
                        {/* <Paper className={classes.paper}>
                            <EconomyPie data={props.data}></EconomyPie>
                        </Paper> */}
                    </Container>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Counter-Terrorists Economy</Typography>
                    <Typography className={classes.secondaryHeading}>Find out your expenditure breakdown and round types in this match</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Container>
                        <Paper className={classes.paper}>
                            <EconomyResult data={props.data}></EconomyResult>
                        </Paper>
                    </Container>
                </ExpansionPanelDetails>
            </ExpansionPanel> */}
        </Container >)
}

function mapStateToProps(state) {
    if (state.results.economy) {
        return {
            data: state.results.economy,
        }
    }
    return {};
}

export default connect(mapStateToProps)(Economy);



// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { connect } from 'react-redux';
// import Container from '@material-ui/core/Container';
// import Typography from "@material-ui/core/Typography";
// import EconomyResultCT from './EconomyResultCT';
// import EconomyResultT from './EconomyResultT';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// const useStyles = makeStyles(theme => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         textAlign: 'center'
//     },
//     heading: {
//         fontSize: theme.typography.pxToRem(15),
//         flexBasis: '33.33%',
//         flexShrink: 0,
//     },
//     secondaryHeading: {
//         fontSize: theme.typography.pxToRem(15),
//         color: theme.palette.text.secondary,
//     },
// }))

// const Economy = (props) => {
//     const classes = useStyles();
//     const [expanded, setExpanded] = React.useState('panel1');

//     const handleChange = (panel) => (event, newExpanded) => {
//         setExpanded(newExpanded ? panel : false);
//     };

//     return (
//         <Container fixed className={classes.root}>
//             <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
//                 <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
//                     <Typography className={classes.heading}>Economy team CT</Typography>
//                     <Typography className={classes.secondaryHeading}>Find out your team's round wins and losses this game</Typography>
//                 </ExpansionPanelSummary>
//                 <ExpansionPanelDetails>
//                     <EconomyResultCT data={props}></EconomyResultCT>
//                 </ExpansionPanelDetails>
//             </ExpansionPanel>

//             <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
//                 <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
//                     <Typography className={classes.heading}>Economy team T</Typography>
//                     <Typography className={classes.secondaryHeading}>Check the match by following the statistics round by round</Typography>
//                 </ExpansionPanelSummary>
//                 <ExpansionPanelDetails>
//                     <EconomyResultT data={props}></EconomyResultT>
//                 </ExpansionPanelDetails>
//             </ExpansionPanel>
//         </Container >)
// }

// function mapStateToProps(state) {
//     if (state.results.economy) {
//         return {
//             data: state.results.economy.ct
//         }
//     }
//     return {};
// }

// export default connect(mapStateToProps)(Economy);