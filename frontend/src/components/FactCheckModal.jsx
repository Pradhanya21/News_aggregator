/*=============================================================================
 | Purpose:  THIS FUNCTION DEFINES A MODAL COMPONENT FOR DISPLAYING FACT-CHECK
 |           RESULTS TO THE USER. THE COMPONENT FETCHES FACT-CHECKING DATA
 |           USING THE useFactCheck HOOK BASED ON A GIVEN STORY PROP. IT PARSES
 |           THE RESULTING DATA AND PRESENTS IT IN A STRUCTURED FORMAT WITHIN
 |           THE MODAL, INCLUDING CLAIMS, SOURCES, ANALYSIS, AND BIAS.
 |
 | Input / Parameters:  THE FUNCTION TAKES A 'props' OBJECT AS INPUT, WITH AN
 |                      'open' PROPERTY INDICATING THE MODAL'S VISIBILITY AND
 |                      AN 'onClose' FUNCTION FOR HANDLING MODAL CLOSE EVENTS.
 |                      THE 'props.story' PROPERTY IS USED TO FETCH FACT-CHECKING
 |                      DATA.
 |   
 | Output / Returns:  THE FUNCTION RETURNS A MODAL COMPONENT THAT DISPLAYS
 |                    FACT-CHECKING RESULTS TO THE USER. THE MODAL WILL SHOW
 |                    A LOADING INDICATOR IF FACT-CHECKING DATA IS BEING
 |                    FETCHED, AND ONCE LOADED, IT WILL DISPLAY THE CLAIMS,
 |                    SOURCES, ANALYSIS, AND BIAS RELATED TO THE STORY.
 |
 *===========================================================================*/

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import useFactCheck from "../hooks/useFactCheck";

const FactCheckModal = (props) => {
  const { loading, result, error } = useFactCheck(props.story);
  const [displayResult, setDisplayResult] = useState([]);
  const [claims, setClaims] = useState([]);
  const [source, setSource] = useState();
  const [analysis, setAnalysis] = useState([]);
  const [bias, setBias] = useState();

  const stringParse = (geminiRes) => {
    if (geminiRes.startsWith("```")) {
      const cleanString = geminiRes.replace(/^```|```$/g, "");
      if (/^(json|JSON)/i.test(cleanString)) {
        try {
          const parsedStr = cleanString.replace(/^(json|JSON)\s*/, "");
          console.log(parsedStr);
          const jsonparsed = JSON.parse(parsedStr);
          // console.log(geminiRes);
          console.log(jsonparsed);
          setDisplayResult(geminiRes);
          setClaims(jsonparsed.claims);
          setSource(jsonparsed.credible_sources);
          setAnalysis(jsonparsed.analysis);
          setBias(jsonparsed.potential_biases);
        } catch (error) {
          console.log("error parsing JSON");
        }
      }
    } else {
      setDisplayResult(geminiRes);
    }
  };

  // function renderArrayWithSpaces(array) {
  //   return array.map((item, index, arr) => (
  //     <>
  //       {item}
  //       {index < arr.length - 1 && (
  //         <span style={{ marginRight: "10px" }}> </span>
  //       )}
  //     </>
  //   ));
  // }

  useEffect(() => {
    if (result) {
      stringParse(result);
    }
  }, [result]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          color: "text.primary",
        }}
      >
        {loading ? (
          <CircularProgress /> // Display loading indicator
        ) : (
          <>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 2 }}
              color="primary"
            >
              Fact Check Result
            </Typography>
            <div id="modal-modal-description" sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Claims
              </Typography>
              <Typography variant="body1">{claims}</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Sources
              </Typography>
              <Typography variant="body1">{source}</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Analysis
              </Typography>
              <Typography variant="body1">{analysis}</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Bias
              </Typography>
              <Typography variant="body1">{bias}</Typography>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default FactCheckModal;
