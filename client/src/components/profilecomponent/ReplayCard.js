import React from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
  content: {
    display: 'flex'
  }
});

const ReplayCard = (props) => {
  const handleDelete = props.handleDelete;
  const classes = useStyles();
  const data = props.data;
  const history = useHistory();
  const dispatch = useDispatch();
  let colorCT;
  let colorT;
  if (data.ctScore > data.tScore) {
    colorCT = 'green';
    colorT = 'red';
  } else if (data.ctScore < data.tScore) {
    colorCT = 'red';
    colorT = 'green';
  } else {
    colorCT = 'black';
    colorT = 'black';
  }




  const handleClick = (e) => {
    const replayid = e.currentTarget.getAttribute('replayid');
    axios.get("/api/v1/matches/" + replayid)
      .then(result => {
        dispatch({
          type: 'UPLOAD',
          payload: result.data,
        });
        history.push('/results');
      })
      .catch(e => console.log(e))
  }

  const getTime = (unix_timestamp) => {
    var date = new Date(unix_timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
  return (
    <Card variant="outlined">
      <CardContent className={classes.content}>
        <Container align="center" >
          <Typography variant="p" color="textSecondary">Counter-Terrorists</Typography>
          <Typography variant="h5">{data.ctClanName}</Typography>
          <Typography variant="h4" style={{ color: colorCT }}>{data.ctScore}</Typography>
        </Container>
        <Container align="center">
          <Typography variant="p" color="textSecondary">Terrorists</Typography>
          <Typography variant="h5">{data.tClanName}</Typography>
          <Typography variant="h4" style={{ color: colorT }}>{data.tScore}</Typography>
        </Container>
        <Container align="center">
          <Typography>{getTime(data.date)}</Typography>
          <Typography>Map: {data.map}</Typography>
          <Typography>Game length: {data.gameLength}</Typography>
          <Button variant="outlined" replayid={data.id} color="primary" onClick={handleClick}>View Analysis</Button>
        </Container>
        <IconButton aria-label="settings" style={{ padding: 0, height: '30px' }}>
          <DeleteIcon replayid={data.id} onClick={handleDelete} />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default ReplayCard;