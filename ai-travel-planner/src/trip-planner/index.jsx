import { Input } from "../components/ui/input";
import React, { useState } from 'react';
import { selectBudgetList, selectTravelList } from "@/constants/options";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

function Createtrip() {
  const [place,setPlace]=useState();
  const [formData,setFormData]=useState([]);

  const handleInputChange=(name,value)=>{
      setFormData({
        ...formData,
        [name]:value
      })
  }

  useEffect(()=>
  {
    console.log(formData);
  },{formData})
   

  return (
    <div className="m-3 mx-10 p-4">
      <h2 className="font-bold font-serif text-[30px]">
        Tell us your Travel Preference
      </h2>
      <p className="font-thin">
        Just provide some basic details and get your trip plan ready in seconds
      </p>
      <div className="mx-10 my-10 gap-6">
        <div>
          <h2 className="font-bold font-serif">
            What is the destination of your choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
            selectProps={{
             place,
             onChange:(v)=>{setPlace(v);handleInputChange('location',v)}
            }}
          />
        </div>
        <div className="mt-6">
          <h2 className="font-bold font-serif">
            Enter no. of days for the trip:
          </h2>
          <Input
            type="number"
            placeholder="Enter number of days..."
          />
        </div>

        <div className="mt-6">
        <h2 className="font-bold font-serif">
            What is the Budget of the trip ?
          </h2>
          <div>
          <div className="grid grid-cols-3 gap-10 mt-5">
            {selectBudgetList.map((item,index)=>
            <div key="index" className="p-4 border border-gray-200 rounded-lg hover:shadow">
              <h2>{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
             </div>
          )}
          </div>
          </div>

        </div>

        <div className="mt-6">
        <h2 className="font-bold font-serif">
            Who do you plan on travelling with on your next trip ?
          </h2>
          <div>
          <div className="grid grid-cols-4 gap-10 mt-5">
            {selectTravelList.map((item,index)=>
            <div key="index" className="p-4 border border-gray-200 rounded-lg hover:shadow">
              <h2>{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
             </div>
          )}
          </div>
          </div>

        </div>

        <Button className="mt-10">Generate Trip</Button>

      </div>
    </div>
  );
}

export default Createtrip;
