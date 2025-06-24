import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AI_PROMPT, selectBudgetList, selectTravelList } from "@/constants/options";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { generateTripPlan } from "../../GeminiChat";
import axios from "axios";

function Createtrip() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const onGenerateTrip = async () => { // Corrected: Removed the duplicate 'onGenerateTrip = async () => {' here
    setErrorMessage("");
    setLoading(true);

    const days = parseInt(formData.days);

    if (isNaN(days) || days <= 0) {
      setErrorMessage("Please enter a valid number of days.");
      setLoading(false);
      return;
    }

    if (!formData.budget || !formData.location || !formData.group) {
      setErrorMessage("Please enter all the details.");
      setLoading(false);
      return;
    }

    if (days > 7) {
      setErrorMessage("Trips longer than 7 days are currently not supported.");
      setLoading(false);
      return;
    }

    const prompt = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{days}', formData.days)
      .replace('{group}', formData.group)
      .replace('{budget}', formData.budget);

    console.log(prompt);

    try {
      const geminiResponse = await generateTripPlan(prompt);

      if (geminiResponse) {
        console.log("Gemini Response (initial):", geminiResponse);

        const updatedHotelOptions = [];
        if (geminiResponse.hotelOptions && Array.isArray(geminiResponse.hotelOptions)) {
          for (const hotel of geminiResponse.hotelOptions) {
            try {
              const imageUrlResponse = await axios.post('http://localhost:3001/api/get-place-image-data', {
                searchQuery: 'hotel interior, hotel room, hotel lobby, hotel exterior, hotel building, hotel suite, resort'
              });
              updatedHotelOptions.push({
                ...hotel,
                hotelImageURL: imageUrlResponse.data.imageUrl || hotel.hotelImageURL
              });
            } catch (imageError) {
              console.warn(`Could not fetch image for hotel "${hotel.hotelName}":`, imageError.message);
              updatedHotelOptions.push(hotel);
            }
          }
        }

        const updatedItinerary = [];
        if (geminiResponse.itinerary && Array.isArray(geminiResponse.itinerary)) {
          for (const dayPlan of geminiResponse.itinerary) {
            const updatedDailyPlan = [];
            if (dayPlan.dailyPlan && Array.isArray(dayPlan.dailyPlan)) {
              for (const activity of dayPlan.dailyPlan) {
                try {
                  const imageUrlResponse = await axios.post('http://localhost:3001/api/get-place-image-data', {
                    searchQuery: `${activity.placeName} ${formData.location} landmark iconic view tourist attraction`
                  });
                  updatedDailyPlan.push({
                    ...activity,
                    placeImageURL: imageUrlResponse.data.imageUrl || activity.placeImageURL
                  });
                } catch (imageError) {
                  console.warn(`Could not fetch image for place "${activity.placeName}":`, imageError.message);
                  updatedDailyPlan.push(activity);
                }
              }
            }
            updatedItinerary.push({ ...dayPlan, dailyPlan: updatedDailyPlan });
          }
        }

        const finalTripData = {
          ...geminiResponse,
          hotelOptions: updatedHotelOptions,
          itinerary: updatedItinerary,
          planDetails: {
            location: formData.location,
            duration: formData.days,
            traveller_type: formData.group
          }
        };

        console.log("Final Trip Data with images:", finalTripData);
        navigate('/trip-result', { state: { tripData: finalTripData } });

      } else {
        setErrorMessage("Failed to get a valid response from the AI. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred while generating the trip plan or fetching images. Please check your network connection and try again.");
      console.error("Error during trip generation/image fetch:", error);
    } finally {
      setLoading(false);
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
          <Input
            type="text"
            placeholder="Enter destination manually..."
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
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
                className={`p-4 border rounded-lg hover:shadow cursor-pointer ${formData.budget === item.title ? "border-blue-500 shadow-md" : "border-gray-200"
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
                className={`p-4 border rounded-lg hover:shadow cursor-pointer ${formData.group === item.title ? "border-blue-500 shadow-md" : "border-gray-200"
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

        {/* Show Alert Box if any validation fails or API error occurs */}
        {errorMessage && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Generate Button with Loading Indicator */}
        <Button className="mt-10" onClick={onGenerateTrip} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Createtrip;