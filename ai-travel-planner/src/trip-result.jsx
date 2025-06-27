import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

function TripResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tripData, setTripData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [loadingRecentSearches, setLoadingRecentSearches] = useState(true);

  useEffect(() => {
    if (location.state && location.state.tripData) {
      setTripData(location.state.tripData);
      console.log("Trip Data received in TripResult:", location.state.tripData);
    } else {
      setErrorMessage("No trip data found. Please generate a trip first.");
    }

    const fetchRecentSearches = async () => {
      setLoadingRecentSearches(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No user logged in. Cannot fetch recent searches.");
        setLoadingRecentSearches(false);
        return;
      }

      try {
        const searchHistoryRef = collection(db, 'users', currentUser.uid, 'searchHistory');
        const q = query(searchHistoryRef, orderBy('generatedAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const searches = [];
        querySnapshot.forEach((doc) => {
          searches.push({ id: doc.id, ...doc.data() });
        });
        setRecentSearches(searches);
        console.log("Recent searches fetched:", searches);
      } catch (error) {
        console.error("Error fetching recent searches:", error);
      } finally {
        setLoadingRecentSearches(false);
      }
    };

    fetchRecentSearches();
  }, [location.state, navigate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Recent Searches</h2>
        {loadingRecentSearches ? (
          <p className="text-gray-600">Loading recent searches...</p>
        ) : recentSearches.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSearches.map((search) => (
              <li key={search.id} className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="font-semibold text-lg text-gray-800">{search.searchQuery}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Days:</span> {search.days},
                  <span className="font-medium ml-2">Group:</span> {search.group}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Generated: {search.generatedAt ? new Date(search.generatedAt.toDate()).toLocaleString() : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No recent searches found. Generate a trip to see your history!</p>
        )}
      </div>

      {tripData ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
            Trip to {tripData.planDetails?.location || 'Unknown Location'}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            A {tripData.planDetails?.duration}-day trip for {tripData.planDetails?.traveller_type}
          </p>

          {tripData.hotelOptions && tripData.hotelOptions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Hotel Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tripData.hotelOptions.map((hotel, index) => (
                  <div key={index} className="border p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col">
                    {hotel.hotelImageURL && (
                      <img
                        src={hotel.hotelImageURL}
                        alt={hotel.hotelName}
                        className="w-full h-48 object-cover rounded-md mb-3"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-hotel.jpg" }}
                      />
                    )}
                    <h3 className="font-bold text-xl mb-1 text-gray-900">{hotel.hotelName}</h3>
                    <p className="text-gray-700">Rating: {hotel.rating} / 5</p>
                    <p className="text-gray-700">Price Range:  {typeof hotel.price === 'object' && hotel.price !== null
                      ? `₹${hotel.price.min} - ₹${hotel.price.max}`
                      : hotel.price}</p>
                    <p className="text-sm text-gray-600 mt-2 flex-grow">{hotel.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tripData.itinerary && tripData.itinerary.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Daily Itinerary</h2>
              <div className="space-y-8">
                {tripData.itinerary.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-gray-900">Day {day.day}: {day.dayTitle}</h3>
                    {day.dailyPlan && day.dailyPlan.length > 0 ? (
                      <ul className="space-y-4">
                        {day.dailyPlan.map((activity, activityIndex) => (
                          <li key={activityIndex} className="flex items-start gap-4 p-3 border rounded-md bg-white">
                            {activity.placeImageURL && (
                              <img
                                src={activity.placeImageURL}
                                alt={activity.placeName}
                                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-activity.jpg" }}
                              />
                            )}
                            <div>
                              <p className="font-semibold text-lg text-gray-900">{activity.placeName}</p>
                              <p className="text-gray-700 text-sm">{activity.placeDetails}</p> 
                              <p className="text-gray-500 text-xs mt-1">Time to Spend: {activity.timeToSpend}</p>
                              <p className="text-gray-500 text-xs">Travel from Previous: {activity.travelTimeFromPrevious}</p>
                              <p className="text-gray-500 text-xs">Ticket Price: {activity.ticketPricing}</p>
                              <p className="text-gray-500 text-xs">Rating: {activity.rating}</p>
                              <p className="text-gray-500 text-xs">Best Time to Visit: {activity.bestTimeToVisit}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No activities planned for this day.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        !errorMessage && <p className="text-gray-600 text-center text-lg mt-10">Loading trip details...</p>
      )}
    </div>
  );
}

export default TripResult;