import React from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{value}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        </g>
    );
};


export default class RoundTypeChart extends React.Component {

    constructor(props) {
        super(props);

        let ecoroundsCT = [];
        let forcebuyroundsCT = [];
        let fullbuyroundsCT = [];
        let ecoroundsT = [];
        let forcebuyroundsT = [];
        let fullbuyroundsT = [];

        Object.entries(props.data).forEach(round => {
            let roundNumber = round[0];
            let rdata = round[1];
            if (rdata.equipmentValueCT <= 1000) ecoroundsCT.push(roundNumber);
            else if (rdata.equipmentValueCT <= 20000) forcebuyroundsCT.push(roundNumber);
            else fullbuyroundsCT.push(roundNumber);

            if (rdata.equipmentValueT <= 1000) ecoroundsT.push(roundNumber);
            else if (rdata.equipmentValueT <= 20000) forcebuyroundsT.push(roundNumber);
            else fullbuyroundsT.push(roundNumber);
        });

        const data = [
            { name: 'Full Buy', value: fullbuyroundsCT.length },
            { name: 'Force Buy', value: forcebuyroundsCT.length },
            { name: 'Eco', value: ecoroundsCT.length },
        ];
        const data2 = [
            { name: 'Full Buy', value: fullbuyroundsCT.length },
            { name: 'Force Buy', value: forcebuyroundsCT.length },
            { name: 'Eco', value: ecoroundsCT.length },
        ];

        this.state = {
            data: {
                rounds: [{
                    type: 'Force Buy',
                    rounds: forcebuyroundsCT
                }, {
                    type: 'Full Buy',
                    rounds: fullbuyroundsCT
                }, {
                    type: 'Eco',
                    rounds: ecoroundsCT
                }],
                piechartdata: data
            },
            activeIndex: 0,
        };

        this.state2 = {
            data: {
                rounds: [{
                    type: 'Force Buy',
                    rounds: forcebuyroundsCT
                }, {
                    type: 'Full Buy',
                    rounds: fullbuyroundsCT
                }, {
                    type: 'Eco',
                    rounds: ecoroundsCT
                }],
                piechartdata: data2
            },
            activeIndex: 0,
        };
    }

    componentDidMount() {
        let piechart = [...document.querySelectorAll('.recharts-surface')].find((e) => e.viewBox.baseVal.height === 350 && e.viewBox.baseVal.width === 500);
        piechart.viewBox.baseVal.x = -40;
        piechart.viewBox.baseVal.y = 90;
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };
    onPieEnter2 = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };

    render() {
        return (
            <Container>
                <Container style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: "40px" }}>
                    <Typography align="center" variant="subtitle2">Round Type Distribution Pie Chart</Typography>
                    <Container style={{ display: 'flex', justifyContent: 'center' }}>
                        <PieChart width={500} height={350}>
                            <Pie
                                activeIndex={this.state.activeIndex}
                                activeShape={renderActiveShape}
                                data={this.state.data.piechartdata}
                                cx={200}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={this.onPieEnter}
                            />
                        </PieChart>
                    </Container>
                    <Typography align="center" variant="subtitle2">Round Type Distribution Pie Chart</Typography>
                    <Container style={{ display: 'flex', justifyContent: 'center' }}>
                        <PieChart width={500} height={350}>
                            <Pie
                                activeIndex={this.state2.activeIndex}
                                activeShape={renderActiveShape}
                                data={this.state2.data.piechartdata}
                                cx={200}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={this.onPieEnter2}
                            />
                        </PieChart>
                    </Container>
                </Container>
            </Container>

        );
    }
}
