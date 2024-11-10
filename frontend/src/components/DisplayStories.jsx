/*=============================================================================
 | Purpose:  THIS FUNCTION DEFINES A COMPONENT TO DISPLAY A LIST OF STORIES
 |           RETRIEVED FROM AN EXTERNAL SOURCE. IT UTILIZES THE useGetStories
 |           HOOK TO FETCH STORIES BASED ON THE PROVIDED SEARCH PARAMETERS.
 |           THE COMPONENT RENDERS EACH STORY AS A CARD WITH DETAILS SUCH AS
 |           STORY NAME, SUMMARY, UPDATED DATE, SENTIMENT, AND KEY POINTS.
 |           USERS CAN EXPAND INDIVIDUAL CARDS TO VIEW KEY POINTS ASSOCIATED
 |           WITH EACH STORY.
 |
 | Input / Parameters:  THE FUNCTION DOES NOT TAKE ANY EXPLICIT INPUT PROPS.
 |                      HOWEVER, IT USES THE 'useLocation' HOOK FROM
 |                      'react-router-dom' TO RECEIVE SEARCH PARAMETERS FROM
 |                      THE PARENT COMPONENTS. THESE SEARCH PARAMETERS ARE
 |                      THEN USED TO FETCH THE RELEVANT STORIES.
 |   
 | Output / Returns:  THE FUNCTION RETURNS A UI COMPONENT THAT DISPLAYS A
 |                    LIST OF STORIES IN A MASONRY LAYOUT. EACH STORY IS
 |                    REPRESENTED BY A CARD CONTAINING ITS DETAILS, INCLUDING
 |                    NAME, SUMMARY, DATE, SENTIMENT, AND KEY POINTS. USERS
 |                    CAN EXPAND THESE CARDS TO VIEW THE KEY POINTS.
 |
 *===========================================================================*/

import React, { useEffect, useState } from "react";
import useGetStories from "/src/hooks/useGetStories";
import FormatDate from "/src/utils/FormatDate";
import "/src/components/Display.css";
import { useLocation } from "react-router-dom";

// importing icons from MUI Icons
import BlurOnOutlinedIcon from "@mui/icons-material/BlurOnOutlined";

//importing card related components from MUI
import { styled } from "@mui/material/styles";
import Masonry from "@mui/lab/Masonry";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalculateSentiment from "../utils/CalculateSentiment";

//Expand card logic
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const DisplayStories = () => {
  //receive searchParams from sibling component SideBar utilizing useNavigate and useLocation from react-router-dom
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({});

  //variables to receive results back from useGetStories
  const [stories, setStories] = useState([]);
  const [numResults, setNumResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //variable to control the state of the card
  const [expandedMap, setExpandedMap] = useState({});

  //receive searchParams from sibling component SearchBar utilizing useNavigate and useLocation from react-router-dom
  useEffect(() => {
    setSearchParams(location.state?.searchParams || {});
  }, [location.state?.searchParams]);

  //runs as the page opens for the first time
  useGetStories(
    searchParams,
    stories,
    setStories,
    numResults,
    setNumResults,
    isLoading,
    setIsLoading,
    error,
    setError
  );

  //function to set the expanded <> collapsible when clicked
  const handleExpandClick = (articleId) => {
    setExpandedMap((prevExpandedMap) => ({
      ...prevExpandedMap,
      [articleId]: !prevExpandedMap[articleId],
    }));
  };

  // Render your component based on the state values
  if (isLoading) {
    return <div className="loader centered"></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3 className="text-center">Top Stories</h3>
      <p className="text-center">Found {numResults} Stories</p>

      <Masonry columns={3} spacing={2}>
        {stories.map((story) => (
          <Card
            sx={{ maxWidth: 350, margin: 0.8, borderRadius: 5 }}
            key={story.id}
          >
            <CardHeader
              title={story.name}
              subheader={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>
                    <FormatDate updatedAt={story.createdAt} />
                  </span>
                  <span style={{ marginLeft: "1rem" }}>
                    <CalculateSentiment sentimentArr={story.sentiment} />
                  </span>
                </div>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {story.summary}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <CardContent>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">
                    <span>
                      {story.totalCount ? <BlurOnOutlinedIcon /> : null}{" "}
                      {story.totalCount} unique articles/reprints within the
                      story cluster.
                    </span>
                  </Typography>
                </div>
              </CardContent>
              <ExpandMore
                expand={expandedMap[story.id] || false}
                onClick={() => handleExpandClick(story.id)}
                aria-expanded={expandedMap[story.id] || false}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse
              in={expandedMap[story.id] || false}
              timeout="auto"
              unmountOnExit
            >
              <CardContent>
                <Typography paragraph className="text-center">
                  Key Points:
                </Typography>
                <Typography paragraph>
                  {story.keyPoints.map((keyPoint, index) => (
                    <div key={index}>
                      &#8226; {keyPoint.point}
                      <br />
                    </div>
                  ))}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Masonry>
    </div>
  );
};

export default DisplayStories;
