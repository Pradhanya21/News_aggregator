/*=============================================================================
 | Purpose:  CONVERTS THE ISO 8601 FORMATTED DATE / TIME (RECEIVED BY PERIGON
 |           API) INTO A MORE USER FRIENDLY FORMAT BY COMPARING AGAINST CURRENT
 |           DATE OR JUST SHOWING THE DATE IN EN-GB FORMAT IF MORE THAN 10 DAYS
 |           AGO
 |
 | Input / Parameters:  RECEIVES ISO 8601 FORMATTED DATE AND TIME
 |                      (E.G. 2021-08-22T20:05:55+00:00) 
 |   
 | Output / Returns:  DEPENDING ON THE TIME DIFFERENCE TO CURRENT DATE DISPLAYS
 |                    LIKE THE EXAMPLE: "less than an hour ago", "1h ago", 
 |                    "Xh ago", "X days ago" or "22 Aug 2021 9:05PM".
 |
 *===========================================================================*/

import React from "react";

const FormatDate = ({ updatedAt }) => {
  // Calculate the time difference
  const updatedAtDate = new Date(updatedAt);
  const currentDate = new Date();
  const timeDifference = currentDate - updatedAtDate;

  // Convert time difference to hours
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  // Format the updatedAt string
  let updatedAtString = "";
  if (hoursDifference < 1) {
    updatedAtString = "less than an hour ago";
  } else if (hoursDifference === 1) {
    updatedAtString = "1h ago";
  } else if (hoursDifference > 1 && hoursDifference < 24) {
    updatedAtString = `${hoursDifference}h ago`;
  } else if (hoursDifference > 24 && hoursDifference < 240) {
    const daysDifference = Math.floor(hoursDifference / 24);
    updatedAtString = `${daysDifference} days ago`;
  } else {
    // Format the date in "23 Mar 2024 4:31PM" format like
    const dateFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const timeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = updatedAtDate.toLocaleDateString(
      "en-GB",
      dateFormatOptions
    );
    const formattedTime = updatedAtDate.toLocaleTimeString(
      "en-GB",
      timeFormatOptions
    );

    updatedAtString = `${formattedDate} ${formattedTime}`;
  }
  return <span>{updatedAtString}</span>;
};

export default FormatDate;
