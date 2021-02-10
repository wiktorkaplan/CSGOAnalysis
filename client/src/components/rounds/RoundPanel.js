import React from 'react';
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
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { connect } from 'react-redux';

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => (res[key] = obj[key], res), {});

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
  let { row, rou, roundNumber } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  let rounds2;
  let rounds = [];
  if (rou) {
    rounds2 = sortProperties(rou, 'kills', true, true);
    for (var key2 in rounds2) {
      if (rounds2[key2][1].kills > -1) rounds.push(rounds2[key2]);
    }
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
          {roundNumber}
        </StyledTableCell>
        <StyledTableCell align="center">{row.ctScore} : {row.ttScore}</StyledTableCell>
        <StyledTableCell align="center" >{row.reason}</StyledTableCell>
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
                    <TableCell align="left">Player name</TableCell>
                    <TableCell align="center">Kills</TableCell>
                    <TableCell align="center">Assists</TableCell>
                    <TableCell align="center">Headshot kills</TableCell>
                    <TableCell align="center">Amount spent</TableCell>
                    <TableCell align="center">Equipment value</TableCell>
                    <TableCell align="center">Money saved</TableCell>
                    <TableCell align="right">Clan name</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {rounds ? (rounds.map(gun => (
                    <StyledTableRow key={gun[0].toString()}>
                      <StyledTableCell align="left" component="th" scope="row">{gun[0].toString()}</StyledTableCell>
                      <StyledTableCell align="center">{gun[1].kills}</StyledTableCell>
                      <StyledTableCell align="center">{gun[1].assists}</StyledTableCell>
                      <StyledTableCell align="center">{gun[1].headshotKills}</StyledTableCell>
                      <StyledTableCell align="center">{gun[1].amountSpent}</StyledTableCell>
                      <StyledTableCell align="center">{gun[1].equipmentValue}</StyledTableCell>
                      <StyledTableCell align="center">{gun[1].moneySaved}</StyledTableCell>
                      <StyledTableCell align="right">{gun[1].clanName}</StyledTableCell>
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

const ResultsTable = (props) => {
  let rows = [];
  if (props.data) {
    for (let key in props.data) {
      if (props.data.hasOwnProperty(key)) {
        rows.push([key, props.data[key]]);
      }
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell />
            <StyledTableCell align="center">Round number</StyledTableCell>
            <StyledTableCell align="center">Score</StyledTableCell>
            <StyledTableCell align="center">Reason</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows ? (rows.map(row => (
            <Row key={row[0].toString()} row={row[1]} rou={row[1]} roundNumber={row[0].toString()} />
          ))) : <StyledTableCell></StyledTableCell>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function mapStateToProps(state) {
  if (state) {
    return {
      data: state.results.rounds
    }
  }
  return {};
}

export default connect(mapStateToProps)(ResultsTable);