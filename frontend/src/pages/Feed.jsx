import React from "react";
import DisplayStories from "../components/DisplayStories";
import SmartCollection from "../components/SmartCollection";

const Feed = () => {
  return (
    <div>
      <SmartCollection></SmartCollection>
      <br />
      <DisplayStories></DisplayStories>
    </div>
  );
};

export default Feed;
