/*=============================================================================
 | Purpose:  CUSTOM HOOK TO FETCH STORIES DATA FROM PERIGON API USING PARAMETERS  
 |           PASSED AS PROPS TO TAILOR THE API CALL. IT ENSURES THAT THE STORIES
 |           ARE FETCHED ONLY WHEN THE SEARCH QUERY CHANGES. ALSO MANAGE LOADING
 |           STATES, ERROR HANDLING AND NUM OF RESULTS ACCORDINGLY
 |           API DOC: https://docs.goperigon.com/reference/stories-1
 |
 | Input / Parameters:  The hook requires the following inputs:
 |           - searchParams: An object containing search parameters, notably 
 |                           the query (q).
 |           - stories: A state variable to store the fetched stories.
 |           - setStories: A function to update the stories state.
 |           - numResults: A state variable to store the total number of 
 |                         results.
 |           - setNumResults: A function to update the numResults state.
 |           - isLoading: A state variable to manage the loading state.
 |           - setIsLoading: A function to update the isLoading state.
 |           - error: A state variable to store any errors encountered.
 |           - setError: A function to update the error state.
 | Output / Returns:  The hook returns an object containing:
 |           - stories: The fetched stories based on the search parameters.
 |           - numResults: The total number of results fetched.
 |           - isLoading: A boolean indicating whether the data is currently 
 |                        being fetched.
 |           - error: Any error messages encountered during the fetching 
 |                    process.
 |
 *===========================================================================*/

import React, { useEffect, useRef } from "react";

const useGetStories = (
  searchParams,
  stories,
  setStories,
  numResults,
  setNumResults,
  isLoading,
  setIsLoading,
  error,
  setError
) => {
  const lastQRef = useRef(null);
  useEffect(() => {
    const { q } = searchParams;

    // Check if q is the same as the last value
    if (lastQRef.current === q) {
      return; // Do nothing if q is the same as the last value
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(import.meta.env.VITE_PERIGON_STORIES_URL);

        if (q) {
          url.searchParams.append("q", q);
        } else {
          url.searchParams.append("q", "Markets from this week");
        }

        //set standard from date to 2 weeks before today
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const isoDate = twoWeeksAgo.toISOString();
        url.searchParams.append("from", isoDate);

        //parameters that will always be present
        url.searchParams.append("nameExists", "true");
        url.searchParams.append("minClusterSize", "5");
        url.searchParams.append("page", "0");
        url.searchParams.append("size", "20");
        url.searchParams.append("sortBy", "createdAt");
        url.searchParams.append("showNumResults", "false");
        url.searchParams.append("showDuplicates", "false");

        //uncomment to check the final URL to be sent
        // console.log(url.toString());

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-api-key": import.meta.env.VITE_PERIGON_API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNumResults(data.numResults);
          setStories(data.results);
        } else {
          setError("Failed to load stories");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    lastQRef.current = searchParams.q; // Update the lastQRef with the current q value
  }, [[searchParams, setStories, setNumResults, setIsLoading, setError]]);

  return { stories, numResults, isLoading, error };
};

export default useGetStories;
