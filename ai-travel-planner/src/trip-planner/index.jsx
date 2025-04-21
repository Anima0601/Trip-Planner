import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AI_PROMPT, selectBudgetList, selectTravelList } from "@/constants/options";
import { AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { generateTripPlan } from "../../geminiChat";


function Createtrip() {
  const [place, setPlace] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    days: "",
    budget: "",
    group: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const onGenerateTrip = async () => {
    const days = parseInt(formData.days);

    if (isNaN(days) || days <= 0) {
      setErrorMessage("Please enter a valid number of days.");
      return;
    }

    if (!formData.budget || !formData.location || !formData.group) {
      setErrorMessage("Please enter all the details.");
      return;
    }

    if (days > 7) {
      setErrorMessage("Trips longer than 7 days are currently not supported.");
      return;
    }

    const prompt = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{days}', formData.days)
      .replace('{group}', formData.group)
      .replace('{budget}', formData.budget)
      .replace('{days}', formData.days);

   console.log(prompt);
   try {
    const response = await generateTripPlan(prompt);
    if (response) {
      console.log("Gemini Response:", response);
      try {
        const parsedResponse = JSON.parse(response);
        navigate('/trip-result', { state: { tripData: parsedResponse } });
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        setErrorMessage("Failed to process the trip plan.");
      }
    } else {
      setErrorMessage("Failed to get a response from the AI.");
    }
  } catch (error) {
    setErrorMessage("An unexpected error occurred while communicating with the AI.");
    console.error("Error calling generateTripPlan:", error);
  }
  };

  return (
    <div className="m-3 mx-10 p-4">
      <h2 className="font-bold font-serif text-[30px]">
        Tell us your Travel Preference
      </h2>
      <p className="font-thin">
        Just provide some basic details and get your trip plan ready in seconds
      </p>

      <div className="mx-10 my-10 gap-6">
        {/* Destination Input */}
        <div>
          <h2 className="font-bold font-serif">
            What is the destination of your choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v.label);
              },
            }}
            apiOptions={{ language: "en" }}
          />
        </div>

        {/* Days Input */}
        <div className="mt-6">
          <h2 className="font-bold font-serif">Enter no. of days for the trip:</h2>
          <Input
            type="number"
            placeholder="Enter number of days..."
            value={formData.days}
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

        {/* Budget Options */}
        <div className="mt-6">
          <h2 className="font-bold font-serif">What is the Budget of the trip?</h2>
          <div className="grid grid-cols-3 gap-10 mt-5">
            {selectBudgetList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow cursor-pointer ${
                  formData.budget === item.title ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
                onClick={() => handleInputChange("budget", item.title)}
              >
                <h2>{item.icon}</h2>
                <h2 className="font-bold">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Group Options */}
        <div className="mt-6">
          <h2 className="font-bold font-serif">
            Who do you plan on travelling with on your next trip?
          </h2>
          <div className="grid grid-cols-4 gap-10 mt-5">
            {selectTravelList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow cursor-pointer ${
                  formData.group === item.title ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
                onClick={() => handleInputChange("group", item.title)}
              >
                <h2>{item.icon}</h2>
                <h2 className="font-bold">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Show Alert Box if any validation fails */}
        {errorMessage && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Generate Button */}
        <Button className="mt-10" onClick={onGenerateTrip}>
          Generate Trip
        </Button>
      </div>
    </div>
  );
}

export default Createtrip;


