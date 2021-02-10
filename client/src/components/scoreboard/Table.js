import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux';

//funkcja filter dla obiektow
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
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
});
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);
const ResultsTable = (props) => {
  let rows;
  if (props.data) {
    rows = Object.filter(props.data, row => row.teamGame === props.team);
    rows = sortProperties(rows, 'kills', true, true);
    //console.log(rows);
  }

  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="left" style={{ width: '80px' }}>Player name</StyledTableCell>
            <StyledTableCell align="center">Kills</StyledTableCell>
            <StyledTableCell align="center">Deaths</StyledTableCell>
            <StyledTableCell align="center">Assists</StyledTableCell>
            <StyledTableCell align="center">Balance</StyledTableCell>
            <StyledTableCell align="center">K/D</StyledTableCell>
            <StyledTableCell align="center">Headshot %</StyledTableCell>
            <StyledTableCell align="center">Average damages</StyledTableCell>
            <StyledTableCell align="center">Average kills</StyledTableCell>
            <StyledTableCell align="center">Accuracy %</StyledTableCell>
            <StyledTableCell align="right" style={{ width: '80px' }}>Clan Name</StyledTableCell>

          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows ? (rows.map(row => (
            <StyledTableRow key={row[1].name} >
              <StyledTableCell align="left" style={{ width: '80px' }}>{row[1].name}</StyledTableCell>
              <StyledTableCell align="center">{row[1].kills}</StyledTableCell>
              <StyledTableCell align="center">{row[1].deaths}</StyledTableCell>
              <StyledTableCell align="center">{row[1].assists}</StyledTableCell>
              <StyledTableCell align="center">{row[1].kills - row[1].deaths}</StyledTableCell>
              <StyledTableCell align="center">{Math.round((row[1].kills / row[1].deaths) * 10) / 10}</StyledTableCell>
              <StyledTableCell align="center">{Math.round((row[1].averageHeadshot) * 100)}%</StyledTableCell>
              <StyledTableCell align="center">{Math.round((row[1].averageDamages) * 1) / 1}</StyledTableCell>
              <StyledTableCell align="center">{Math.round((row[1].averageKills) * 10) / 10}</StyledTableCell>
              <StyledTableCell align="center">{Math.round((row[1].overallAccuracy) * 1) / 1}%</StyledTableCell>

              <StyledTableCell align="right" style={{ width: '80px' }}>{row[1].clanName}</StyledTableCell>
            </StyledTableRow>
          ))) : (<StyledTableCell></StyledTableCell>)}
        </TableBody>
      </Table >
    </TableContainer >
  );
}

function mapStateToProps(state) {
  if (state) {
    return {
      data: state.results.players
    }
  }
  return {};
}

export default connect(mapStateToProps)(ResultsTable);