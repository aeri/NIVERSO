import React, {useEffect} from "react";
import {Box, CircularProgress, Typography, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {useQuery} from "@apollo/react-hooks";
import {ApolloConsumer, Mutation, Query} from "@apollo/react-components";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import zaraHealthTheme from "../../../theme";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import gql from "graphql-tag";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
            width: "100%",

        },
    },
    list: {
        width: 200,
        overflow: 'auto',
    },
}));
const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const ExpansionPanelActions = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(0),
        paddingBottom: 15,
        paddingRight: 20
    },
}))(MuiExpansionPanelActions);

const GET_CURRENT_USER_AND_STATIONS = gql`
 query currentUserSattions {
    currentUser @client {
      username
    }
    retrieveAllWaterStations {
      id
      title
    }
    
  }
`;

const GET_INFO_USER = gql`
 query retrieveUser(
    $username: String!,
  ) {
    retrieveUser(
      username: $username,
    ) {
      preferredWaterStation{
        id
      }
    }
  }
`;


const UPDATE_WATER_STATION = gql`
  mutation updateUserWaterStation(
    $idWaterStation: Int!
  ) {
    updateUserWaterStation(
      idWaterStation: $idWaterStation
    ) {
      username
    }
  }
`;


function WaterFavStation() {
    const classes = useStyles();
    const {loading, data, error} = useQuery(GET_CURRENT_USER_AND_STATIONS);
    const [preferredWaterStation, setPreferredWaterStation] = React.useState(-1);
    const [stations, setStations] = React.useState([]);
    const [username, setUsername] = React.useState('');


    useEffect(() => {
        if ((data !== undefined && data.currentUser !== null && data.retrieveAllWaterStations !== null)) {

            setStations(data.retrieveAllWaterStations)
            setUsername(data.currentUser.username)
        }

    }, [data, error, loading]);

    return (
        <div>
            <Query query={GET_INFO_USER} variables={{
                username: username,
            }}>
                {({data, loading, error}) => {
                    if (loading) {
                        return (
                            <div style={{
                                position: "absolute",
                                top: "15%",
                                left: "45%",
                                width: "100%",
                            }}>
                                <CircularProgress color="secondary"/>
                            </div>
                        );
                    }
                    if (error) {
                        return <h2 style={{color: "white"}}>Error: {JSON.stringify(error)}</h2>;
                    }
                    if ((data !== undefined && data.retrieveUser !== null)) {
                        if (preferredWaterStation === -1 && data.retrieveUser.preferredWaterStation !== null && data.retrieveUser.preferredWaterStation !== undefined) {
                            setPreferredWaterStation(data.retrieveUser.preferredWaterStation.id)
                        }
                        return (
                            <Mutation mutation={UPDATE_WATER_STATION}>
                                {(updateUserWaterStation, {data, loading}) => {
                                    if (loading) {
                                        return <div style={{
                                            position: "relative",
                                            top: "15%",
                                            left: "45%",
                                            width: "100%",
                                        }}>
                                            <CircularProgress color="secondary"/>
                                        </div>
                                    }

                                    if (data !== undefined) {
                                        return (
                                            <ApolloConsumer>
                                                {() => {
                                                    return (
                                                        <div>
                                                            <ExpansionPanelDetails>
                                                                <Grid container spacing={1} direction="column"
                                                                      justify="center"
                                                                      alignItems="center">
                                                                    <Grid container spacing={1} direction="row"
                                                                          justify="center"
                                                                          alignItems="center">
                                                                        <Grid item xs={12}>
                                                                            <div className={classes.paper}>
                                                                                <Paper elevation={3}>
                                                                                    <Grid container direction="column"
                                                                                          justify="flex-start"
                                                                                          style={{
                                                                                              paddingLeft: 20,
                                                                                              paddingTop: 10,
                                                                                              paddingBottom: 10
                                                                                          }}>
                                                                                        <Grid item xs={12}>
                                                                                            <Typography color="primary">
                                                                                                <Box
                                                                                                    fontWeight="fontWeightRegular"
                                                                                                    m={1} fontSize={23}>
                                                                                                    Datos actualizados
                                                                                                    correctamente
                                                                                                </Box>
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Paper>
                                                                            </div>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </ExpansionPanelDetails>
                                                            <ExpansionPanelActions>
                                                                <Button size="medium" color="secondary"
                                                                        onClick={() => window.location.reload()}>
                                                                    Aceptar
                                                                </Button>
                                                            </ExpansionPanelActions>
                                                        </div>
                                                    );
                                                }}
                                            </ApolloConsumer>
                                        );
                                    }

                                    const handleSubmit = (e) => {
                                        updateUserWaterStation({
                                            variables: {
                                                idWaterStation: preferredWaterStation
                                            }
                                        });
                                    }

                                    return (
                                        <form
                                            noValidate
                                            onSubmit={handleSubmit}
                                        >
                                            <ExpansionPanelDetails>
                                                <Grid container spacing={1} direction="column"
                                                      justify="center"
                                                      alignItems="center">
                                                    <Grid container spacing={1} direction="row"
                                                          justify="center"
                                                          alignItems="center">
                                                        <Grid item xs={12}>
                                                            <div className={classes.paper}>
                                                                <Paper elevation={3}>
                                                                    <Grid container direction="column"
                                                                          justify="flex-start"
                                                                          style={{paddingLeft: 20, paddingTop: 10}}>
                                                                        <Grid item xs={12}>
                                                                            <Typography color="primary">
                                                                                <Box fontWeight="fontWeightRegular"
                                                                                     m={1} fontSize={27}>
                                                                                    Estación preferida
                                                                                </Box>
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid container direction="column"
                                                                          justify="flex-start"
                                                                          style={{paddingLeft: 20}}>
                                                                        <Grid item xs={12}>
                                                                            <List dense style={{width: 300}}
                                                                                  component="div" role="list"
                                                                                  className={classes.list}>
                                                                                {stations.map((station) => {
                                                                                    return (
                                                                                        <ListItem role="listitem"
                                                                                                  style={{width: 300}}>
                                                                                            <ListItemIcon>
                                                                                                <Checkbox
                                                                                                    checked={station.id === preferredWaterStation}
                                                                                                    onChange={() => {
                                                                                                        setPreferredWaterStation(station.id)
                                                                                                    }}
                                                                                                    tabIndex={-1}
                                                                                                    disableRipple
                                                                                                />
                                                                                            </ListItemIcon>
                                                                                            <ListItemText
                                                                                                primary={station.title}/>
                                                                                        </ListItem>
                                                                                    );
                                                                                })}
                                                                                <ListItem/>
                                                                            </List>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Paper>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </ExpansionPanelDetails>
                                            <ExpansionPanelActions>
                                                <Button size="medium" style={{color: "white"}}
                                                        onClick={() => window.location.reload()}>Cancelar</Button>
                                                <Button size="medium" color="secondary" type="submit">
                                                    Guardar
                                                </Button>
                                            </ExpansionPanelActions>
                                        </form>
                                    );
                                }}
                            </Mutation>
                        );
                    }
                }
                }
            </Query>
        </div>
    );
}

export default WaterFavStation;

