import React from "react";
// @material-ui/core components
import Input from '@material-ui/core/Input';
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import PropTypes from 'prop-types';
import {requestDEL, requestGET, requestPOST} from "../../requests";
import Dialog from "@material-ui/core/Dialog";
import {OutlinedInput} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
// import withStyles from "@material-ui/core/styles/withStyles";
import Swal from 'sweetalert2'
import helpers from "../../utils.js"
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    },
    green: {
        color: "#259200",
    },
    red: {
        color: "#ac1a02"
    },
    stocksearchform : {
        margin: "20px",
        marginBottom: "0px"
    }
};

class ManagePlayers extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            columnNames : [],
            values: [],
            projectionColumns : {},
            route: "/players/"
        }
    }

    getManageUsersRoute = (route) => {
        // request.GET(`/tables/${}/columns`)
        requestGET(route, )
            .then((res) => {
                console.log(res);
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        projectionColumns: Object.keys(data[0]).reduce((obj, key) => { obj[key] = true; return obj; }, {}),
                        route: route,
                        columnNames: Object.keys(data[0]),
                        values: data.map((x) => Object.values(x))
                    })
                }
            })
    }

    getManageUsersRouteProjection = (route) => {
        let tempCols = Object.entries(this.state.projectionColumns).filter((pair) => pair[1]);
        tempCols = tempCols.map((x) => x[0]);
        requestGET(this.state.route, {projections: tempCols})
            .then((res) => {
                console.log(res);
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        columnNames: Object.keys(data[0]),
                        values: data.map((x) => Object.values(x))
                    })
                }
            })
    }

    componentDidMount() {
        this.getManageUsersRoute(this.state.route);
    }

    handleColumnChange = (event) => {
        let tempPC = this.state.projectionColumns;
        tempPC[event.target.value] = !tempPC[event.target.value];
        this.setState({
            projectionColumns: tempPC
        });
        this.getManageUsersRouteProjection();
    };

    render() {
        const {classes} = this.props;

        this.tableColumns = (
            <React.Fragment>
                {Object.keys(this.state.projectionColumns).map((prop, key) => {
                    return (
                        <FormControlLabel
                            value={prop}
                            control={
                                <Checkbox
                                    defaultChecked
                                    onChange={(e) => {this.handleColumnChange(e)}}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label={prop}
                            labelPlacement="start"
                        />

                    );

                })}
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Manage Players</h4>
                                <p className={classes.cardCategoryWhite}>
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Button variant="contained" color="primary" style={{margin: "2px"}}
                                        onClick={() => {
                                            this.setState({route: "/players/"});
                                            this.getManageUsersRoute("/players/");
                                        }}
                                >
                                    View all Player Ownership</Button>
                                <Button variant="contained" color="secondary" style={{margin: "2px"}}
                                        onClick={() => {
                                            this.setState({route: "/players/overview"})
                                            this.getManageUsersRoute("/players/overview");
                                        }}
                                >
                                    View all Player Net Worth</Button>
                                {this.tableColumns}
                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={this.state.columnNames}
                                    tableData={this.state.values}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </React.Fragment>
        );
    }
}

ManagePlayers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManagePlayers);
