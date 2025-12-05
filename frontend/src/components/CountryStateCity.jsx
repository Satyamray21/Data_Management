import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Grid } from "@mui/material";
import { Country, State, City } from "country-state-city";

const CountryStateCity = ({ onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Load all countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      setSelectedState(null);
      setSelectedCity(null);
      setCities([]);
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCities(
        City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      );
      setSelectedCity(null);
    }
  }, [selectedState, selectedCountry]);

  // Send final selection to parent
  useEffect(() => {
    if (onChange) {
      onChange({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      });
    }
  }, [selectedCountry, selectedState, selectedCity, onChange]);

  return (
    <Grid container spacing={2}>
      {/* Country */}
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={countries}
          getOptionLabel={(option) => option.name}
          value={selectedCountry}
          onChange={(e, newValue) => setSelectedCountry(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Country" fullWidth />
          )}
        />
      </Grid>

      {/* State */}
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={states}
          getOptionLabel={(option) => option.name}
          value={selectedState}
          onChange={(e, newValue) => setSelectedState(newValue)}
          disabled={!selectedCountry}
          renderInput={(params) => (
            <TextField {...params} label="State" fullWidth />
          )}
        />
      </Grid>

      {/* City */}
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={cities}
          getOptionLabel={(option) => option.name}
          value={selectedCity}
          onChange={(e, newValue) => setSelectedCity(newValue)}
          disabled={!selectedState}
          renderInput={(params) => (
            <TextField {...params} label="City" fullWidth />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default CountryStateCity;
