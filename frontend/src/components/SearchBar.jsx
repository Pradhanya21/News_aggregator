/*=============================================================================
 | Purpose:  THIS FUNCTION DEFINES A SEARCH BAR COMPONENT FOR THE APPLICATION.
 |           THE SEARCH BAR ALLOWS USERS TO INPUT SEARCH TERMS AND APPLY VARIOUS
 |           FILTERS SUCH AS COUNTRY, SOURCE, CATEGORY, TOPIC, DATE RANGE, AND
 |           SORTING OPTIONS TO REFINE THEIR SEARCH. IT ALSO PROVIDES ADVANCED
 |           SEARCH OPTIONS THAT CAN BE EXPANDED TO INCLUDE ADDITIONAL FILTERS.
 |
 | Input / Parameters:  THE FUNCTION DOES NOT TAKE EXTERNAL PROPS AS INPUT.
 |                      HOWEVER, IT MANAGES STATE FOR:
 |                      - SEARCH INPUT VALUE
 |                      - SELECTED COUNTRY AND SOURCE FROM DROPDOWN
 |                      - SELECTED CATEGORIES AND TOPICS FROM CHECKBOXES
 |                      - SELECTED DATE RANGE
 |                      - SORT BY OPTION (DATE OR RELEVANCE)
 |                      - REFINEMENT CHECKBOXES FOR SHOWING REPRINTS, PAYWALL, 
 |                        AND EXCLUDING LABELS.
 |
 | Output / Returns:  THE FUNCTION RETURNS A SEARCH BAR COMPONENT THAT CAN BE
 |                    RENDERED IN THE MAIN PAGE. WHEN THE SEARCH BUTTON IS 
 |                    CLICKED, IT NAVIGATES TO THE MAIN PAGE AND PASSES THE 
 |                    SEARCH PARAMETERS AS STATE, WHICH WILL THEN BE USED TO
 |                    FETCH AND DISPLAY RELEVANT ARTICLES.
 |
 *===========================================================================*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  InputAdornment,
  TextField,
  Checkbox,
  Select,
  FormGroup,
  Box,
  Grid,
  Button,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";

//Card configuration and Expansion
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

//for the sortBy radio button
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
//for the from to date pickers
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb"; //for format DD/MM/YYYY
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//array for Countries dropdown - list of countries based on Perigon's API documentation
const countries = [
  { label: "United States", countryCode: "us" },
  { label: "Canada", countryCode: "ca" },
  { label: "Great Britain", countryCode: "gb" },
  { label: "Germany", countryCode: "de" },
  { label: "Italy", countryCode: "it" },
  { label: "India", countryCode: "in" },
  { label: "France", countryCode: "fr" },
  { label: "Netherlands", countryCode: "nl" },
  { label: "Sweden", countryCode: "se" },
  { label: "Denmark", countryCode: "dk" },
  { label: "Finland", countryCode: "fi" },
  { label: "Hungary", countryCode: "hu" },
  { label: "Norway", countryCode: "no" },
  { label: "Poland", countryCode: "pl" },
  { label: "Portugal", countryCode: "pt" },
  { label: "Russia", countryCode: "ru" },
  { label: "Ukraine", countryCode: "ua" },
  { label: "Switzerland", countryCode: "ch" },
  { label: "Brazil", countryCode: "br" },
  { label: "New Zealand", countryCode: "nz" },
  { label: "Mexico", countryCode: "mx" },
  { label: "Australia", countryCode: "au" },
];
//array for Sources dropdown - list of sources based on Perigon's API documentation
const sources = [
  { label: "Top 10 Sources", sourceCode: "top10" },
  { label: "Top 100 Sources", sourceCode: "top100" },
  { label: "Top 25 Sources in crypto", sourceCode: "top25crypto" },
  { label: "Top 25 Sources in finance", sourceCode: "top25finance" },
  { label: "Top 50 Sources in tech", sourceCode: "top50tech" },
];
//array for Categories dropdown - list of categories based on Perigon's API documentation
const categories = [
  { label: "Politics", categoryCode: "Politics" },
  { label: "Tech", categoryCode: "Tech" },
  { label: "Sports", categoryCode: "Sports" },
  { label: "Business", categoryCode: "Business" },
  { label: "Finance", categoryCode: "Finance" },
  { label: "Entertainment", categoryCode: "Entertainment" },
  { label: "Health", categoryCode: "Health" },
  { label: "Weather", categoryCode: "Weather" },
  { label: "Lifestyle", categoryCode: "Lifestyle" },
  { label: "Auto", categoryCode: "Auto" },
  { label: "Science", categoryCode: "Science" },
  { label: "Travel", categoryCode: "Travel" },
  { label: "Environment", categoryCode: "Environment" },
  { label: "World", categoryCode: "World" },
  { label: "General", categoryCode: "General" },
];
//array for Topics dropdown - list of topics based on Perigon's API documentation
const topics = [
  { label: "Markets", topicCode: "Markets" },
  { label: "Crime", topicCode: "Crime" },
  { label: "Cryptocurrency", topicCode: "Cryptocurrency" },
  { label: "Social Issues", topicCode: "Social Issues" },
  { label: "College Sports", topicCode: "College Sports" },
  { label: "Sports Figures", topicCode: "Sports Figures" },
  { label: "Business Leaders", topicCode: "Business Leaders" },
  { label: "Green Energy", topicCode: "Green Energy" },
  { label: "Oil & Gas", topicCode: "Oil & Gas" },
  { label: "Consumer Alerts", topicCode: "Consumer Alerts" },
  { label: "Fact-Checks", topicCode: "Fact-Checks" },
  { label: "IPO", topicCode: "IPO" },
  { label: "Data", topicCode: "Data" },
  { label: "Security Breach", topicCode: "Security Breach" },
];

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

const SearchBar = () => {
  const navigate = useNavigate();
  //search bar - Perigon API Param 'q'
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [searchValue, setSearchValue] = useState("");

  //country dropdown - Perigon API Param 'country'
  const [selectedCountry, setSelectedCountry] = useState(null);

  //sources dropdown - Perigon API Param 'sourceGroup'
  const [selectedSource, setSelectedSource] = useState(null);

  //categories dropdown - Perigon API Param 'category' (can be multiple e.g. category=Politics&category=Weather)
  const [selectedCategories, setSelectedCategories] = useState([]);

  //topics dropdown - Perigon API Param 'topic' (can be multiple e.g.topic=Markets&topic=Basketball)
  const [selectedTopics, setSelectedTopics] = useState([]);

  //from / to date field - Perigon API Param 'from' and 'to'
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  //Sort by radio button - Perigon API Param 'sortBy' (date or relevance)
  const [selectedSortBy, setSelectedSortBy] = useState("date");

  //Refine Results checkboxes - Perigon API Param 'showReprints', 'paywall' and 'excludeLabel' for all others (e.g. excludeLabel=Non-news&excludeLabel=Opinion)
  const [showReprints, setShowReprints] = useState(false);
  const [paywall, setPaywall] = useState(true);
  const [excludeLabel, setExcludeLabel] = useState([
    "Non-news",
    "Opinion",
    "Paid News",
    "Roundup",
    "Press Release",
  ]);

  //Control card expansion for Advanced Search Options
  const [expanded, setExpanded] = useState(false);

  //handle search input change
  const handleSearchChange = () => {
    setSearchValue(event.target.value);
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  //handle search input clear X field
  const handleClearClick = () => {
    setSearchValue(""); // Clear the input value
    setShowClearIcon("none"); // Hide the clear icon
  };

  //handle country dropdown change
  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
  };

  //handle source dropdown change
  const handleSourceChange = (event, newValue) => {
    setSelectedSource(newValue);
  };

  //handle categories dropdown
  const handleCategoriesCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((category) => category !== value);
      }
      return [...prevSelected, value];
    });
  };

  //handle topics dropdown
  const handleTopicsCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((topic) => topic !== value);
      }
      return [...prevSelected, value];
    });
  };

  //handle sortBy radio button
  const handleSortByChange = (event) => {
    setSelectedSortBy(event.target.value);
  };

  //handle excludeLabel array updates (refine results checkboxes)
  const handleExcludeLabelChange = (label, isChecked) => {
    if (isChecked) {
      setExcludeLabel((prevLabels) => [...prevLabels, label]); //add to array if checkbox is checked
    } else {
      setExcludeLabel((prevLabels) => prevLabels.filter((l) => l !== label)); //remove from array if checkbox is unchecked
    }
  };

  //handle Advanced Search Expand click
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSearchClick = () => {
    const searchParams = {
      q: searchValue,
      country: selectedCountry ? selectedCountry.countryCode : null,
      sourceGroup: selectedSource ? selectedSource.sourceCode : null,
      category: selectedCategories.join(", "),
      topic: selectedTopics.join(", "),
      from: selectedFromDate,
      to: selectedToDate,
      sortBy: selectedSortBy,
      showReprints: showReprints.toString(),
      paywall: paywall.toString(),
      excludeLabel: excludeLabel.join(", "),
    };
    //pass the search paraments state to the Main page, where DisplayArticles is being rendered and will capture it
    navigate("/Main", { state: { searchParams } });
  };

  return (
    <Card style={{ backgroundColor: "whitesmoke" }} elevation={0}>
      <CardHeader
        titleTypographyProps={{
          fontSize: 36,
          fontWeight: 700,
          color: "#0db38e",
        }}
        subheaderTypographyProps={{
          fontSize: 18,
          fontWeight: 700,
        }}
        title="BE INFORMED AND INSPIRED"
        subheader="FROM NEWS SOURCES TAILORED FOR YOU"
      />
      <InputLabel style={{ marginLeft: 14, fontSize: "14px" }}>
        Tip: Get fancy with the use of words like AND, OR, NOT. You may use
        "quotation marks" to search for an exact phrase for an improved search
        accuracy.
      </InputLabel>
      <Box display="flex" alignItems="center">
        {/*========== Search Input ==========*/}
        <TextField
          style={{ width: "100%", marginLeft: 14 }}
          size="large"
          id="search-input"
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                style={{ display: showClearIcon }}
                onClick={handleClearClick}
              >
                <ClearOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        {/*========== Submit Search Button ==========*/}
        <Button
          style={{ marginLeft: 5, height: "55px", backgroundColor: "black" }}
          size="large"
          variant="contained"
          onClick={handleSearchClick}
          endIcon={<TravelExploreOutlinedIcon />}
        >
          Search
        </Button>
      </Box>

      {/*========== To expand for Advanced Search ==========*/}
      <CardActions style={{ marginLeft: 8 }}>
        <small>Advanced Search</small>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreOutlinedIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {/*========== Date Range picker ==========*/}
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <Box display="flex" alignItems="center">
                <Box marginRight={2}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      required
                      label="From"
                      value={selectedFromDate}
                      onChange={(newValue) => {
                        setSelectedFromDate(newValue);
                      }}
                    />
                  </DemoContainer>
                </Box>
                {" - "}
                <Box marginLeft={2}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      style={{ paddingleft: 5 }}
                      label="To"
                      minDate={selectedFromDate}
                      value={null}
                      onChange={(newValue) => {
                        setSelectedToDate(newValue);
                      }}
                    />
                  </DemoContainer>
                </Box>
              </Box>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} md={6}>
            {/*========== Countries Dropdown ==========*/}
            <small>Filter by country</small>
            <Autocomplete
              value={selectedCountry}
              onChange={handleCountryChange}
              id="country-dropdown"
              options={countries}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Countries" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            {/* Source / Media Dropdown */}
            <small>Filter by Media / Source</small>
            <br />
            <Autocomplete
              value={selectedSource}
              onChange={handleSourceChange}
              id="sources-dropdown"
              options={sources}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Sources" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            {/*========== Categories Dropdown ==========*/}
            <small>Filter by categories that the article is about:</small>
            <br />
            <FormControl style={{ width: "50%", paddingLeft: 5 }}>
              <InputLabel id="categories-dropdown-label">Categories</InputLabel>
              <Select
                labelId="categories-dropdown-label"
                id="categories-dropdown"
                multiple
                value={selectedCategories}
                onChange={() => {}}
                renderValue={(selected) => selected.join(", ")}
              >
                <FormGroup>
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category.categoryCode}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(
                            category.categoryCode
                          )}
                          onChange={handleCategoriesCheckboxChange}
                          value={category.categoryCode}
                        />
                      }
                      label={category.label}
                    />
                  ))}
                </FormGroup>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={6}>
            {/*========== Topics Dropdown ==========*/}
            <small>
              Filter by topics that are some kind of entity that the article is
              about:
            </small>
            <br />
            <FormControl style={{ width: "50%" }}>
              <InputLabel id="topics-dropdown-label">Topics</InputLabel>
              <Select
                labelId="topics-dropdown-label"
                id="category-dropdown"
                multiple
                value={selectedTopics}
                onChange={() => {}}
                renderValue={(selected) => selected.join(", ")}
              >
                <FormGroup>
                  {topics.map((topic) => (
                    <FormControlLabel
                      key={topic.topicCode}
                      control={
                        <Checkbox
                          checked={selectedTopics.includes(topic.topicCode)}
                          onChange={handleTopicsCheckboxChange}
                          value={topic.topicCode}
                        />
                      }
                      label={topic.label}
                    />
                  ))}
                </FormGroup>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3} md={3}>
            {/*========== Sort by radio button ==========*/}
            <FormControl>
              <FormLabel id="sort-by-radio-buttons-group">Sort By</FormLabel>
              <RadioGroup
                aria-labelledby="sort-by-radio-buttons-group"
                name="sort-by-radio-buttons-group"
                value={selectedSortBy}
                onChange={handleSortByChange}
              >
                <FormControlLabel
                  value="date"
                  control={<Radio />}
                  label="Time"
                />
                <FormControlLabel
                  value="relevance"
                  control={<Radio />}
                  label="Relevance"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={9} md={9}>
            {/*========== Refine Results checkboxes ==========*/}
            <FormGroup id="refine-results-checkboxes">
              <FormLabel id="refine-results-checkboxes">
                Refine Results
              </FormLabel>
              <Grid container spacing={0}>
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        // checked={showReprints}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShowReprints(false);
                          } else if (!e.target.checked) {
                            setShowReprints(true);
                          }
                        }}
                      />
                    }
                    label="No Reprints"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        // checked={paywall}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPaywall(false);
                          } else if (!e.target.checked) {
                            setPaywall(true);
                          }
                        }}
                      />
                    }
                    label="No Paywalled Sources"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        onChange={(e) =>
                          handleExcludeLabelChange("Non-news", e.target.checked)
                        }
                      />
                    }
                    label="No Non-news"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        onChange={(e) =>
                          handleExcludeLabelChange("Opinion", e.target.checked)
                        }
                      />
                    }
                    label="No Opinions"
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        onChange={(e) =>
                          handleExcludeLabelChange(
                            "Paid News",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="No Paid News"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        onChange={(e) =>
                          handleExcludeLabelChange("Roundup", e.target.checked)
                        }
                      />
                    }
                    label="No Roundups"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        onChange={(e) =>
                          handleExcludeLabelChange(
                            "Press Release",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="No Press Releases"
                  />
                </Grid>
              </Grid>
            </FormGroup>
          </Grid>
        </Grid>
      </Collapse>
      <br />
    </Card>
  );
};

export default SearchBar;
