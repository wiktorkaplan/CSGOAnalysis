import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';
import Container from '@material-ui/core/Container';

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const RoundResultChart = (props) => {
  const classes = useStyles();
  const data = [];
  let teamCT = 0;
  let teamT = 0;
  console.log(props.data);

  Object.entries(props.data).forEach(round => {
    let roundNumber = round[0];
    let rdata = round[1];
    if (roundNumber < 16) {
      teamT = rdata.ctScore;
      teamCT = rdata.ttScore;
    }
    else {
      teamCT = rdata.ctScore;
      teamT = rdata.ttScore;
    }
    data.push({
      name: roundNumber.toString(),
      ctScore: teamCT,
      tScore: teamT
    });
  });

  return (
    <Container className={classes.container}>
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: 'Round Number', angle: 0, position: 'bottom' }}></XAxis>
        <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }}></YAxis>
        <Tooltip />
        <ReferenceLine y={16} label="Victory" stroke="green" strokeDasharray="3 3" isFront />
        <Line type="monotone" dataKey="ctScore" stroke="blue" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="tScore" stroke="red" />
      </LineChart>
    </Container>

  );
}

export default RoundResultChart;