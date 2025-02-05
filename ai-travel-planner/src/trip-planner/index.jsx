import { Input } from "../components/ui/input";
import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

function Createtrip() {
  const [days, setDays] = useState(''); 
  const handlePlaceSelect = (place) => {
    console.log(place);
  };

  const handleDaysChange = (event) => {
    const value = event.target.value;
    setDays(value);
    console.log(value);
  };

   

  return (
    <div className="m-3 mx-10 p-4">
      <h2 className="font-bold font-serif text-[30px]">
        Tell us your Travel Preference
      </h2>
      <p className="font-thin">
        Just provide some basic details and get your trip plan ready in seconds
      </p>
      <div className="my-10 gap-6">
        <div>
          <h2 className="font-bold font-serif">
            What is the destination of your choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
            selectProps={{
              onChange: handlePlaceSelect,
              placeholder: 'Search for a destination...',
            }}
          />
        </div>
        <div className="mt-6">
          <h2 className="font-bold font-serif">
            Enter no. of days for the trip:
          </h2>
          <Input
            type="number"
            value={days}
            onChange={handleDaysChange}
            placeholder="Enter number of days..."
          />
        </div>
      </div>
    </div>
  );
}

export default Createtrip;
