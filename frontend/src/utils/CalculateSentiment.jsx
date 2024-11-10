/*=============================================================================
 | Purpose:  COMPARE THE PROPERTIES WITHIN THE SENTIMENT ARRAY RECEIVED TO 
 |           EVALUATE THE PREVAILING SENTIMENT (POSITIVE, NEGATIVE OR NEUTRAL)
 |           AND RETURNS THE APPROPRIATE ICON AND TEXT
 |
 | Input / Parameters:  RECEIVES SENTIMENT ARRAY WITH THE VALUES FOR POSITIVE,
 |                      NEGATIVE AND NEUTRAL
 |   
 | Output / Returns:  COMPARES TO FIND THE SENTIMENT WITH THE HIGHEST VALUE AND
 |                    RETURN THE APPROPRIATE ICON AND TEXT: "Mostle Positive", 
 |                    "Mostly Negative" or "Neutral" 
 |
 *===========================================================================*/

import React from "react";

// importing icons from MUI Icons
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

const CalculateSentiment = ({ sentimentArr }) => {
  //to catch instances where article has no sentiment property
  if (!sentimentArr) {
    return;
  }
  // Destructure individual properties of the sentiment array received
  const { positive, negative, neutral } = sentimentArr;

  //variables so we can set the sentiment and icon after comparison
  let sentiment = "";
  let icon = null;

  //comparing which is the highest and updating icon and sentiment accordingly
  if (positive > negative && positive > neutral) {
    icon = <SentimentSatisfiedAltIcon />;
    sentiment = "Mostly Positive";
  } else if (negative > positive && negative > neutral) {
    icon = <SentimentVeryDissatisfiedIcon />;
    sentiment = "Mostly Negative";
  } else if (neutral > negative && neutral > positive) {
    icon = <SentimentNeutralIcon />;
    sentiment = "Neutral";
  }

  //returning icon and sentiment
  return (
    <div>
      {/* Rendering the icon only if it's available */}
      {icon && <span>{icon}</span>}
      <span>{sentiment}</span>
    </div>
  );
};

export default CalculateSentiment;
