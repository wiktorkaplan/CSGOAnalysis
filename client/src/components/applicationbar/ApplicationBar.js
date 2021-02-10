import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import setAuthToken from '../../utils/setAuthToken';

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    title: {
        flexGrow: 1,
    },
    menuButton: {
        //marginRight: 36,
        margin: theme.spacing(1),
    },

});

class ButtonAppBar extends React.Component {
    logout = (e) => {
        localStorage.removeItem("jwtToken");
        setAuthToken(false);
        this.props.dispatch({
            type: 'LOGIN',
            payload: {}
        });
        this.props.history.push('/login');
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" flexGrow={1} className={classes.title}>
                        CS:GO Demo Analysis
                    </Typography>

                    {this.props.auth.isAuthenticated
                        ? <Button color="default" variant="contained" className={classes.menuButton} startIcon={<CloudUploadIcon />} component={Link} to='/upload'>
                            Upload
                        </Button>
                        : <div></div>
                    }
                    {this.props.auth.isAuthenticated
                        ? <Button color="inherit" className={classes.menuButton} component={Link} to='/profile'>My matches</Button>
                        : <Button color="inherit" className={classes.menuButton} component={Link} to='/'>Home</Button>
                    }

                    {this.props.auth.isAuthenticated
                        ? <Button color="inherit" className={classes.menuButton} onClick={this.logout}>Logout</Button>
                        : <Button color="inherit" className={classes.menuButton} component={Link} to='/login'>Login</Button>
                    }

                    {!this.props.auth.isAuthenticated
                        ? <Button color="inherit" className={classes.menuButton} component={Link} to='/register'>Register</Button>
                        : <div></div>
                    }
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(ButtonAppBar)));