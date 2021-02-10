import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { connect } from 'react-redux';

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});

//funkcja sortująca dla obiektow
function sortProperties2(obj, sortedBy, isNumericSort, reverse) {
    sortedBy = sortedBy || 1; // by default first key
    isNumericSort = isNumericSort || false; // by default text sort
    reverse = reverse || false; // by default no reverse

    var reversed = (reverse) ? -1 : 1;

    var sortable2 = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable2.push([key, obj[key]]);
        }
    }
    var sortable = [];
    for (var key2 in sortable2) {
        if (sortable2[key2][1].kills > 0) sortable.push(sortable2[key2]);
    }
    if (isNumericSort)
        sortable.sort(function (a, b) {
            return reversed * (a[1][sortedBy] - b[1][sortedBy]);
        });
    else
        sortable.sort(function (a, b) {
            var x = a[1][sortedBy].toLowerCase(),
                y = b[1][sortedBy].toLowerCase();
            return x < y ? reversed * -1 : x > y ? reversed : 0;
        });

    return sortable;
}
//funkcja sortująca dla obiektow
function sortProperties(obj, sortedBy, isNumericSort, reverse) {
    sortedBy = sortedBy || 1; // by default first key
    isNumericSort = isNumericSort || false; // by default text sort
    reverse = reverse || false; // by default no reverse

    var reversed = (reverse) ? -1 : 1;

    var sortable = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
        }
    }
    if (isNumericSort)
        sortable.sort(function (a, b) {
            return reversed * (a[1][sortedBy] - b[1][sortedBy]);
        });
    else
        sortable.sort(function (a, b) {
            var x = a[1][sortedBy].toLowerCase(),
                y = b[1][sortedBy].toLowerCase();
            return x < y ? reversed * -1 : x > y ? reversed : 0;
        });
    return sortable;
}
const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    table: {
        minWidth: 350,
    },
});
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.info.dark,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);
const Row = (props) => {
    let { row, guns } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    if (guns) {
        guns = sortProperties2(guns, 'kills', true, true);
    }

    return (
        <React.Fragment>

            <StyledTableRow className={classes.root}>
                <StyledTableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">{row.clanName}</StyledTableCell>
                <StyledTableCell align="center" >{guns[0][0].toString()}</StyledTableCell>
            </StyledTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {/* <Typography variant="h6" gutterBottom component="div">
                                
              </Typography> */}
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Weapon name</TableCell>
                                        <TableCell align="center">Kills</TableCell>
                                        <TableCell align="center">Headshots</TableCell>
                                        <TableCell align="center">Headshots %</TableCell>
                                        <TableCell align="center">Shots</TableCell>
                                        <TableCell align="center">Damage</TableCell>
                                        <TableCell align="center">Accuracy</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {guns ? (guns.map(gun => (

                                        <StyledTableRow key={gun[0].toString()}>
                                            <StyledTableCell align="left" component="th" scope="row">{gun[0].toString()}</StyledTableCell>
                                            <StyledTableCell align="center">{gun[1].kills}</StyledTableCell>
                                            <StyledTableCell align="center">{gun[1].headshots}</StyledTableCell>
                                            <StyledTableCell align="center">{Math.round((gun[1].headshots / gun[1].kills) * 100) / 1}%</StyledTableCell>
                                            <StyledTableCell align="right">{gun[1].numberFired}</StyledTableCell>
                                            <StyledTableCell align="center">{gun[1].damage}</StyledTableCell>
                                            <StyledTableCell align="center">{Math.round((gun[1].accuracy) * 1) / 1}%</StyledTableCell>
                                        </StyledTableRow>
                                    ))) : <StyledTableCell></StyledTableCell>}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}

// Row.propTypes = {
//     row: PropTypes.shape({
//         calories: PropTypes.number.isRequired,
//         carbs: PropTypes.number.isRequired,
//         fat: PropTypes.number.isRequired,
//         history: PropTypes.arrayOf(
//             PropTypes.shape({
//                 amount: PropTypes.number.isRequired,
//                 customerId: PropTypes.string.isRequired,
//                 date: PropTypes.string.isRequired,
//             }),
//         ).isRequired,
//         name: PropTypes.string.isRequired,
//         price: PropTypes.number.isRequired,
//         protein: PropTypes.number.isRequired,
//     }).isRequired,
// };

const ResultsTable = (props) => {
    let rows;
    if (props.data) {
        rows = Object.filter(props.data, row => row.teamGame === props.team);
        rows = sortProperties(rows, 'kills', true, true);
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell />
                        <StyledTableCell align="center">Player name</StyledTableCell>
                        <StyledTableCell align="center">Team name</StyledTableCell>
                        <StyledTableCell align="center">The weapon with the most kills</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {rows ? (rows.map(row => (
                        <Row key={row[1].name} row={row[1]} guns={row[1]} />
                    ))) : <StyledTableCell></StyledTableCell>}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function mapStateToProps(state) {
    if (state) {
        return {
            data: state.results.weapons
        }
    }
    return {};
}

export default connect(mapStateToProps)(ResultsTable);