import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import tapOrClick from "react-tap-or-click";
import history from "../../../core/misc/history";
import { ApolloConsumer } from "@apollo/react-components";

function UserCard(props) {
  if (!props.isAuthenticated) {
    return (
      <div
        {...tapOrClick(() => {
          props.handleClickOpen();
          if (props.mobileOpen) {
            props.handleDrawerToggle();
          }
        })}
      >
        <CardHeader
          avatar={<Avatar aria-label="avatar">A</Avatar>}
          action={
            <IconButton aria-label="login">
              <ExitToAppIcon />
            </IconButton>
          }
          title="Anónimo"
          subheader="Iniciar sesión"
        />
      </div>
    );
  } else {
    return (
      <CardHeader
        avatar={
          props.currentUser.image !== undefined ? (
            <Avatar
              aria-label="avatar"
              src={
                "data:" +
                props.currentUser.image.mimetype +
                ";base64," +
                props.currentUser.image.data
              }
            />
          ) : (
            <Avatar aria-label="avatar">
              {props.currentUser.name.charAt(0)}
            </Avatar>
          )
        }
        title={
          props.currentUser.name.length > 15
            ? props.currentUser.name.substring(0, 15) + "..."
            : props.currentUser.name
        }
        subheader={
          props.currentUser.email.length > 15
            ? props.currentUser.email.substring(0, 15) + "..."
            : props.currentUser.email
        }
        action={
          <ApolloConsumer>
            {(client) => (
              <div
                {...tapOrClick(() => {
                  if (props.mobileOpen) {
                    props.handleDrawerToggle();
                  }
                  history.replace("/");
                  client.resetStore();
                  localStorage.removeItem("apollo-cache-persist");
                  localStorage.removeItem("auth");
                })}
              >
                <IconButton aria-label="login">
                  {/* TODO: cambiar icono */}
                  <ExitToAppIcon />
                </IconButton>
              </div>
            )}
          </ApolloConsumer>
        }
      />
    );
  }
}
export default UserCard;