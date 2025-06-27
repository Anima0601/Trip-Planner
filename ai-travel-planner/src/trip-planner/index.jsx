
import React, { useEffect, useState, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AI_PROMPT, selectBudgetList, selectTravelList } from "@/constants/options";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { generateTripPlan } from "../../GeminiChat";
import axios from "axios";
import { useAuth } from '../context/AuthContext'; 

function Createtrip() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth(); 
  
  const [formData, setFormData] = useState({
    location: "",
    days: "",
    budget: "",
    group: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef(null);
  const skipNextFocus = useRef(false);

  const LOCATIONIQ_ACCESS_TOKEN = import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN;
  const debounceTimeoutRef = useRef(null);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "location" && value.length > 2) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchLocationIQSuggestions(value);
      }, 300);
    } else if (name === "location" && value.length <= 2) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchLocationIQSuggestions = async (query) => {
    if (!LOCATIONIQ_ACCESS_TOKEN) {
      console.error("LocationIQ Access Token is not set!");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_ACCESS_TOKEN}&q=${encodeURIComponent(query)}&format=json&dedupe=1&limit=5`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching LocationIQ suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (placeName) => {
    handleInputChange("location", placeName);
    setSuggestions([]);
    setShowSuggestions(false);
    skipNextFocus.current = true;
  };

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) { 
        setErrorMessage("Please sign in to create a trip.");
        navigate('/login');
      }
    }

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [navigate, currentUser, authLoading]); 
  const handleInputFocus = () => {
    if (skipNextFocus.current) {
      skipNextFocus.current = false;
      return;
    }
    setShowSuggestions(true);
  };

  const onGenerateTrip = async () => {
    setErrorMessage("");
    setLoading(true);

    const currentUser = auth.currentUser; // This check is fine as a fallback
    if (!currentUser) {
        setErrorMessage("Please sign in to save your trip history.");
        setLoading(false);
        navigate('/login'); 
        return;
    }
    const userUid = currentUser.uid

    const days = parseInt(formData.days);

    if (isNaN(days) || days <= 0) {
      setErrorMessage("Please enter a valid number of days.");
      setLoading(false);
      return;
    }

    if (!formData.location || !formData.budget || !formData.group) {
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

    try {
      const geminiResponse = await generateTripPlan(prompt);

      if (geminiResponse) {
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

        try {
            // Create a reference to the user's searchHistory sub-collection
            const searchHistoryRef = collection(db, 'users', userUid, 'searchHistory');
            await addDoc(searchHistoryRef, {
              searchQuery: formData.location,
              days: formData.days,
              budget: formData.budget,
              group: formData.group,
              generatedAt: serverTimestamp(), 
              tripData: finalTripData 
            });
            console.log("Trip history saved to Firestore for user:", userUid);
        } catch (firestoreError) {
            console.error("Error saving trip history to Firestore:", firestoreError);
            setErrorMessage("Trip generated, but failed to save history. Please try again.");
            
        }

        navigate('/trip-result', { state: { tripData: finalTripData } });

      } else {
        setErrorMessage("Failed to get a valid response from the AI. Please try again.");
      }
    } catch (error) {
      console.error("Error during trip generation/image fetch:", error);
      setErrorMessage("An unexpected error occurred while generating the trip plan or fetching images. Please check your network connection and try again.");
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
        <div>
          <h2 className="font-bold font-serif">
            What is the destination of your choice?
          </h2>
          <div className="relative" ref={containerRef}>
            <Input
              type="text"
              placeholder="Enter destination (e.g., Paris, France)"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              onFocus={handleInputFocus} 
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleSuggestionClick(suggestion.display_name)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-bold font-serif">Enter no. of days for the trip:</h2>
          <Input
            type="number"
            placeholder="Enter number of days..."
            value={formData.days}
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

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

        {errorMessage && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

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