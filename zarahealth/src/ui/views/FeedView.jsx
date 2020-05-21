import React, { useState, useEffect } from "react";
import {
  List,
  Box,
  Typography,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import Post from "../components/Feed/Post";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
//import InfiniteScroll from "react-infinite-scroller";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
}));

const FEED_QUERY = gql`
  query RetrieveFeeds($page: Int!, $limit: Int!) {
    retrieveFeeds(page: $page, limit: $limit) {
      id
      title
      author
      body
      date
    }
  }
`;

function FeedView() {
  const classes = useStyles();

  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  console.log(isFetching);

  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      page: 1,
      limit: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const fetchPage = (page) => {
      if (!isFetching) {
        console.log("PAGE: " + page);
        setIsFetching(true);
        fetchMore({
          variables: { page: page },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.retrieveFeeds.length === 0) {
              setHasMoreData(false);
              return prev;
            }
            return Object.assign({}, prev, {
              retrieveFeeds: [
                ...prev.retrieveFeeds,
                ...fetchMoreResult.retrieveFeeds,
              ],
            });
          },
        }).then((_) => setIsFetching(false));
      }
    };

    const isScrolling = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (data && hasMoreData) {
        fetchPage(Math.floor(data.retrieveFeeds.length / 7) + 1);
      }
    };
    window.addEventListener("scroll", isScrolling);
    return () => window.removeEventListener("scroll", isScrolling);
  }, [data, fetchMore, isFetching, hasMoreData]);

  if (error) {
    return <h1>{JSON.stringify(error)}</h1>;
  }

  if (
    loading &&
    (data === undefined || (data !== undefined && data.length === 0))
  ) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <CircularProgress color="secondary" />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box m={1}>
      <Typography color="white" style={{ paddingTop: 0, paddingLeft: 0 }}>
        <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
          Feed
        </Box>
      </Typography>
      <div className={classes.root}>
        <List>
          {data.retrieveFeeds.map((post, index) => {
            return (
              <Box m={1}>
                <Post post={post} />
              </Box>
            );
          })}
          {hasMoreData && (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: "20vh" }}
            >
              <Grid item xs={3}>
                {isFetching && <CircularProgress color="secondary" />}
              </Grid>
            </Grid>
          )}
        </List>
      </div>
    </Box>
  );
}

export default FeedView;

// {/* <InfiniteScroll
//   pageStart={2}
//   loadMore={fetchPage}
//   hasMore={hasMoreData}
//   loader={
//     <Grid
//       container
//       spacing={0}
//       direction="column"
//       alignItems="center"
//       justify="center"
//       style={{ minHeight: "20vh" }}
//     >
//       <Grid item xs={3}>
//         <CircularProgress color="secondary" />
//       </Grid>
//     </Grid>
//   }
// ></InfiniteScroll> */}