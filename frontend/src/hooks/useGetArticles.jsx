/*=============================================================================
 | Purpose:  THIS CUSTOM HOOK IS DESIGNED TO FETCH AND MANAGE ARTICLES BASED
 |           ON THE PROVIDED SEARCH PARAMETERS. IT ENSURES THAT THE ARTICLES 
 |           ARE FETCHED BASED ON VARIOUS FILTERS SUCH AS QUERY, COUNTRY, 
 |           SOURCE GROUP, CATEGORY, TOPIC, DATE RANGE, SORTING, AND MORE.
 |           THE HOOK HANDLES LOADING STATES, ERROR HANDLING, AND UPDATES
 |           THE NUMBER OF RESULTS AND ARTICLES ACCORDINGLY.  
 |           API DOC: https://docs.goperigon.com/reference/all-news
 |
 | Input / Parameters:  THE HOOK REQUIRES THE FOLLOWING INPUTS:
 |           - searchParams: AN OBJECT CONTAINING VARIOUS SEARCH PARAMETERS 
 |                           SUCH AS QUERY (q), COUNTRY, SOURCE GROUP, 
 |                           CATEGORY, TOPIC, DATE RANGE, SORTING CRITERIA, 
 |                           AND MORE.
 |           - articles: A STATE VARIABLE TO STORE THE FETCHED ARTICLES.
 |           - setArticles: A FUNCTION TO UPDATE THE ARTICLES STATE.
 |           - numResults: A STATE VARIABLE TO STORE THE TOTAL NUMBER OF 
 |                         RESULTS.
 |           - setNumResults: A FUNCTION TO UPDATE THE numResults STATE.
 |           - isLoading: A STATE VARIABLE TO MANAGE THE LOADING STATE.
 |           - setIsLoading: A FUNCTION TO UPDATE THE isLoading STATE.
 |           - error: A STATE VARIABLE TO STORE ANY ERRORS ENCOUNTERED.
 |           - setError: A FUNCTION TO UPDATE THE ERROR STATE.
 |   
 | Output / Returns:  THE HOOK RETURNS AN OBJECT CONTAINING:
 |           - articles: THE FETCHED ARTICLES BASED ON THE SEARCH PARAMETERS.
 |           - numResults: THE TOTAL NUMBER OF RESULTS FETCHED.
 |           - isLoading: A BOOLEAN INDICATING WHETHER THE DATA IS CURRENTLY 
 |                        BEING FETCHED.
 |           - error: ANY ERROR MESSAGES ENCOUNTERED DURING THE FETCHING 
 |                    PROCESS.
 |
 *===========================================================================*/

import React, { useEffect } from "react";

const useGetArticles = (
  searchParams,
  articles,
  setArticles,
  numResults,
  setNumResults,
  isLoading,
  setIsLoading,
  error,
  setError
) => {
  useEffect(() => {
    const {
      q,
      country,
      sourceGroup,
      category,
      topic,
      from,
      to,
      sortBy,
      showReprints,
      paywall,
      excludeLabel,
      ...rest
    } = searchParams;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(import.meta.env.VITE_PERIGON_ARTICLES_URL);
        if (q) {
          url.searchParams.append("q", q);
        } else {
          url.searchParams.append("q", "Latest News");
        }
        if (country) {
          url.searchParams.append("country", country);
        }
        if (sourceGroup) {
          url.searchParams.append("sourceGroup", sourceGroup);
        } else {
          url.searchParams.append("sourceGroup", "top100");
        }
        if (category) {
          const categories = searchParams.category.split(", ");
          categories.forEach((categoryItem) => {
            url.searchParams.append("category", categoryItem.trim());
          });
        }
        if (topic) {
          const topics = searchParams.topic.split(", ");
          topics.forEach((topicItem) => {
            url.searchParams.append("category", topicItem.trim());
          });
        }
        if (from) {
          url.searchParams.append("from", from);
        } else {
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          const isoDate = twoWeeksAgo.toISOString();
          url.searchParams.append("from", isoDate);
        }
        if (to) {
          url.searchParams.append("to", to);
        }
        if (sortBy) {
          url.searchParams.append("sortBy", sortBy);
        }

        if (showReprints) {
          url.searchParams.append("showReprints", showReprints);
        }
        if (paywall) {
          url.searchParams.append("paywall", paywall);
        }
        if (excludeLabel) {
          const excludedLabels = searchParams.excludeLabel.split(", ");
          excludedLabels.forEach((labelItem) => {
            url.searchParams.append("excludedLabel", labelItem.trim());
          });
        }

        //parameters that will always be present
        url.searchParams.append("searchTranslation", "false");
        url.searchParams.append("page", "0");
        url.searchParams.append("size", "40");
        url.searchParams.append("showNumResults", "false");

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
          setArticles(data.articles);
        } else {
          setError("Failed to load articles");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, setArticles, setNumResults, setIsLoading, setError]);

  return { articles, numResults, isLoading, error };
};

export default useGetArticles;
