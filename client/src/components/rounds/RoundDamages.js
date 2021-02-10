import React from 'react';
import {
    ScatterChart, Scatter, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
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

    const series = [];
    let data = [];
    Object.entries(props.data).forEach(player => {
        let playerName = player[0]; //player name
        let rdata = player[1]; // rounds
        data = [];
        Object.entries(rdata).forEach(rounds => {
            let roundNumber = rounds[0];
            let totalDamage = rounds[1].totalDamages;
            data.push({
                category: roundNumber.toString(),
                value: totalDamage
            })
        })
        series.push({
            name: playerName.toString(),
            data: data
        });
    });
    console.log(series);
    const colors = ['red', 'green', 'blue', 'black', 'purple', 'black'];
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
                <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} label={{ value: 'Round Number', angle: 0, position: 'bottom' }}></XAxis>
                <YAxis dataKey="value" label={{ value: 'Damage', angle: -90, position: 'insideLeft' }}></YAxis>
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                {series.map((s, index) => (
                    <Line dataKey="value" data={s.data} name={s.name} key={s.name} stroke={colors[index % colors.length]} />
                ))}
            </LineChart>
        </Container>

    );
}

export default RoundResultChart;