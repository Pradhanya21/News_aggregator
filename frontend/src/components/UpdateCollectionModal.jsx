/*=============================================================================
 | Purpose:  THIS COMPONENT IS RESPONSIBLE FOR RENDERING A MODAL THAT ALLOWS
 |           USERS TO UPDATE AN EXISTING COLLECTION. IT UTILIZES REACT,
 |           MUI (MATERIAL-UI), AND CONTEXT TO INTERACT WITH THE USER INTERFACE,
 |           FETCH DATA, AND MANAGE STATE RELATED TO THE COLLECTION UPDATE.
 |
 | Input / Parameters:  THE COMPONENT EXPECTS THE FOLLOWING INPUT PROPS:
 |           - updatedCollection: A STRING REPRESENTING THE UPDATED COLLECTION 
 |                                NAME OR CONTENT.
 |           - modalData: AN OBJECT CONTAINING DATA ABOUT THE COLLECTION TO BE 
 |                         UPDATED, INCLUDING ITS ID (modalData._id) AND NAME 
 |                         (modalData.q).
 |           - setShowUpdateCollectionModal: A FUNCTION TO CONTROL THE MODAL'S 
 |                                           VISIBILITY.
 |           - handleCloseUpdateModal: A FUNCTION TO CLOSE THE MODAL.
 |           - getCollectionByUserID: A FUNCTION TO REFRESH THE USER'S 
 |                                     COLLECTION DATA AFTER AN UPDATE.
 |           - setUpdatedCollection: A FUNCTION TO UPDATE THE updatedCollection 
 |                                   STATE WITH THE USER'S INPUT.
 |           - accessToken: A TOKEN USED FOR AUTHENTICATION.
 |   
 | Output / Returns:  THE COMPONENT DOES NOT RETURN ANY VALUE DIRECTLY, BUT 
 |                    IT PROVIDES A MODAL INTERFACE THAT ENABLES USERS TO 
 |                    UPDATE THEIR COLLECTIONS. ON SUCCESSFUL COLLECTION UPDATE, 
 |                    THE MODAL IS CLOSED, AND THE USER'S COLLECTION DATA IS 
 |                    REFRESHED.
 |
 *===========================================================================*/

import React, { useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { blueGrey } from "@mui/material/colors";

//Material UI theme to change/customize the button color
const theme = createTheme({
  palette: {
    primary: blueGrey,
  },
});

const UpdateCollectionModal = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  // update an existing collection from the specific logged-in user
  const updateCollection = async (id) => {
    const res = await fetchData(
      "/api/" + id,
      "PATCH",
      { q: props.updatedCollection },
      userCtx.accessToken
    );

    if (res.ok) {
      props.setShowUpdateCollectionModal(false);
      props.getCollectionByUserID();
      props.setUpdatedCollection([]);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  const handleCloseUpdateModal = () => {
    props.setShowUpdateCollectionModal(false);
  };
  // test to be deleted once app is completed
  console.log(props.updatedCollection);

  return (
    <>
      <Modal
        open={open}
        onClose={props.handleCloseUpdateModal}
        aria-labelledby="update-collection-modal"
        aria-describedby="update-collection-modal"
      >
        <Grid
          container
          component="main"
          sx={{
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleCloseUpdateModal}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
              <Box
                component="form"
                noValidate
                // onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Grid>
                  <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h1"
                  >
                    Update Collection
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={props.modalData._id}
                    label={`${props.modalData.q}`}
                    value={props.updatedCollection}
                    onChange={(event) => {
                      props.setUpdatedCollection(event.target.value);
                    }}
                  />
                </Grid>
                <ThemeProvider theme={theme}>
                  <Button
                    value={props.modalData._id}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={(event) => {
                      updateCollection(event.target.value);
                    }}
                  >
                    Submit
                  </Button>
                </ThemeProvider>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default UpdateCollectionModal;
