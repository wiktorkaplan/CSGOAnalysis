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

const EconomyResultCt = (props) => {
    const classes = useStyles();
    const data = [];
    let equipmentValueCT = 0;
    let equipmentValueT = 0;
    console.log(props.data);

    Object.entries(props.data).forEach(round => {
        let roundNumber = round[0];
        let rdata = round[1];

        equipmentValueCT = rdata.equipmentValueCT;
        equipmentValueT = rdata.equipmentValueT;

        data.push({
            name: roundNumber.toString(),
            'Equipment Value CT': equipmentValueCT,
            'Equipment Value T': equipmentValueT
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
                <ReferenceLine y={20000} label="Full Buy" stroke="green" strokeDasharray="3 3" isFront />
                <ReferenceLine y={5000} label="Eco" stroke="green" strokeDasharray="3 3" isFront />
                <ReferenceLine x={16} label="Team Change" stroke="black" strokeDasharray="3 3" isFront />
                <Line type="linear" dataKey="Equipment Value CT" stroke="blue" activeDot={{ r: 8 }} />
                <Line type="linear" dataKey="Equipment Value T" stroke="red" />
            </LineChart>
        </Container>

    );
}

export default EconomyResultCt;



// import React from 'react';
// import {
//     LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
// } from 'recharts';
// import Container from '@material-ui/core/Container';

// import { makeStyles } from '@material-ui/core/styles';
// const useStyles = makeStyles(theme => ({
//     container: {
//         display: 'flex',
//         justifyContent: 'center'
//     }
// }));

// const EconomyResultCt = (props) => {
//     const classes = useStyles();
//     const data = [];
//     console.log(props.data);
//     console.log(props);
//     Object.entries(props.data).forEach(round => {
//         let roundNumber = round[0];

//         data.push({
//             name: roundNumber.toString(),
//             amoundSpent: round[1].amoundSpent,
//             moneySaved: round[1].moneySaved,
//         });
//     });

//     return (
//         <Container className={classes.container}>
//             <LineChart
//                 width={800}
//                 height={400}
//                 data={data}
//                 margin={{
//                     top: 5, right: 30, left: 20, bottom: 20,
//                 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" label={{ value: 'Round Number', angle: 0, position: 'bottom' }}></XAxis>
//                 <YAxis label={{ value: 'Dollars', angle: -90, position: 'insideLeft' }}></YAxis>
//                 <Tooltip />
//                 <ReferenceLine y={16} label="Victory" stroke="green" strokeDasharray="3 3" isFront />
//                 <Line type="monotone" dataKey="amoundSpent" stroke="blue" activeDot={{ r: 8 }} />
//                 <Line type="monotone" dataKey="moneySaved" stroke="green" />
//             </LineChart>
//         </Container>

//     );
// }

// export default EconomyResultCt;