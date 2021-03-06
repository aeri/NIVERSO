import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {
  Container,
  CircularProgress,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";

import { handleUserAuthentication } from "../../../core/services/tokenService";

import gql from "graphql-tag";
import { ApolloConsumer } from "@apollo/react-components";
import { Mutation } from "@apollo/react-components";
import history from "../../../core/misc/history";

const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      username: $username
      name: $name
      email: $email
      password: $password
    ) {
      username
      name
      email
      csvDownloadEnabled
      isAdmin
      image {
        _id
        filename
        mimetype
        encoding
      }
      preferredAirStation {
        id
        title
        address
        thresholds {
          contaminant
          value
        }
      }
      preferredWaterStation {
        id
        title
        address
      }
      pollenThresholds {
        id
        value
      }
      status
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
  },
}));

export function SignUpForm() {
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const [candidateUsername, setCandidateUsername] = React.useState("");
  const [candidatePassword, setCandidatePassword] = React.useState("");

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Mutation mutation={CREATE_USER}>
          {(createUser, { data, loading, error }) => {
            if (loading) {
              return <CircularProgress />;
            }

            if (error) {
              return (
                <Typography component="div">
                  <Box
                    fontWeight="fontWeightMedium"
                    m={4}
                    fontSize={18}
                    color="black"
                  >
                    No se ha podido crear la cuenta, nombre de usuario o email ya en uso
                  </Box>
                </Typography>
              );
            }

            if (data !== undefined) {
              return (
                <ApolloConsumer>
                  {(client) => {
                    //client.clearStore();
                    //localStorage.removeItem("apollo-cache-persist");
                    handleUserAuthentication(
                      candidateUsername,
                      candidatePassword
                    ).then(() => {
                      client.writeData({
                        data: { currentUser: data.createUser },
                      });
                      history.replace("/");
                    });
                    return null;
                  }}
                </ApolloConsumer>
              );
            }

            return (
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit((data) => {
                  createUser({ variables: data });
                  setCandidateUsername(data.username);
                  setCandidatePassword(data.password);
                })}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      variant="outlined"
                      required
                      fullWidth
                      id="name"
                      label="Nombre y apellidos"
                      name="name"
                      autoComplete="name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      variant="outlined"
                      required
                      fullWidth
                      id="username"
                      label="Nombre de usuario"
                      name="username"
                      autoComplete="username"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      as={TextField}
                      control={control}
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Contraseña"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Crear cuenta
                </Button>
              </form>
            );
          }}
        </Mutation>
      </div>
    </Container>
  );
}
