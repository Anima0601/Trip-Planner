import React from 'react';
import { useLocation } from 'react-router-dom';

function TripResult() {
  const location = useLocation();
  const tripData = location.state?.tripData;

  if (!tripData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Trip Data Available</h2>
          <p className="text-gray-600">It looks like no trip plan was generated. Please go back and create a trip first!</p>
          <button
            onClick={() => window.history.back()} // Simple back button for convenience
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8">
      {/* Main Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-8 leading-tight">
        Your Trip to <span className="text-blue-500">{tripData.planDetails?.location}</span>
      </h1>
      <p className="text-lg text-center text-gray-600 mb-10">
        <span className="font-semibold">{tripData.planDetails?.duration}</span> for a <span className="font-semibold">{tripData.planDetails?.traveller_type}</span> trip
      </p>

      {/* Hotel Options Section */}
      {tripData.hotelOptions && tripData.hotelOptions.length > 0 && (
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 border-b-2 border-blue-300 pb-3">Hotel Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripData.hotelOptions.map((hotel, index) => (
              <div key={index} className="bg-white border border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                {hotel.hotelImageURL && hotel.hotelImageURL !== 'N/A' ? (
                  <img
                    src={hotel.hotelImageURL}
                    alt={hotel.hotelName}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm border border-gray-100"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Hotel+Image+N/A'; // Larger placeholder for hotels
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500 text-sm">
                    No hotel image available.
                  </div>
                )}
                <h3 className="text-xl font-bold text-blue-700 mb-1">{hotel.hotelName}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.hotelAddress}</p>
                <p className="text-base text-gray-800 mb-1">
                  <span className="font-semibold">Price:</span> ₹{hotel.price.min} - ₹{hotel.price.max} per night
                </p>
                <p className="text-base text-gray-800 mb-3">
                  <span className="font-semibold">Rating:</span> {hotel.rating} / 5
                </p>
                <p className="text-sm text-gray-700 flex-grow">{hotel.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary Section */}
      {tripData?.itinerary && Array.isArray(tripData.itinerary) && tripData.itinerary.length > 0 && (
        <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-3">Detailed Itinerary</h2>
          {tripData.itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Day {dayIndex + 1}: {day.theme}
              </h3>
              {day.dailyPlan && Array.isArray(day.dailyPlan) && day.dailyPlan.length > 0 ? (
                <ul className="space-y-6">
                  {day.dailyPlan.map((activity, activityIndex) => (
                    <li key={activityIndex} className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      {activity.placeImageURL && activity.placeImageURL !== 'N/A' ? (
                        <img
                          src={activity.placeImageURL}
                          alt={activity.placeName}
                          className="w-full md:w-48 h-32 md:h-24 object-cover rounded-lg mb-3 md:mb-0 md:mr-4 flex-shrink-0 shadow-sm border border-gray-100"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Place+Image+N/A';
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full md:w-48 h-32 md:h-24 bg-gray-200 rounded-lg mb-3 md:mb-0 md:mr-4 flex-shrink-0 flex items-center justify-center text-gray-500 text-sm">
                          No image available.
                        </div>
                      )}
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-blue-600 mb-1">{activity.placeName}</h4>
                        <p className="text-sm text-gray-700 mb-1">{activity.placeDetails}</p>
                        <p className="text-xs text-gray-500 mb-2 italic">Best time to visit: {activity.bestTimeToVisit}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                            {/* --- CORRECTED LINES BELOW --- */}
                            {activity.ticketPricing && (
                                <span><span className="font-semibold">Ticket:</span> {activity.ticketPricing}</span>
                            )}
                            {activity.rating && (
                                <span><span className="font-semibold">Rating:</span> {activity.rating} / 5</span>
                            )}
                            {activity.timeToSpend && (
                                <span><span className="font-semibold">Time:</span> {activity.timeToSpend}</span>
                            )}
                            {/* --- END CORRECTED LINES --- */}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center py-4">No specific plan available for this day.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notes Section */}
      {tripData?.notes && Object.keys(tripData.notes).length > 0 && (
        <div className="p-6 bg-yellow-50 rounded-lg shadow-inner border border-yellow-200">
          <h2 className="text-3xl font-bold text-yellow-800 mb-6 border-b-2 border-yellow-300 pb-3">Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {tripData.notes.transport && <li><span className="font-semibold">Transport:</span> {tripData.notes.transport}</li>}
            {tripData.notes.food && <li><span className="font-semibold">Food:</span> {tripData.notes.food}</li>}
            {tripData.notes.budget_tips && <li><span className="font-semibold">Budget Tips:</span> {tripData.notes.budget_tips}</li>}
            {tripData.notes.best_season && <li><span className="font-semibold">Best Season:</span> {tripData.notes.best_season}</li>}
            {/* Map any other generic notes from the object */}
            {Object.keys(tripData.notes)
              .filter(key => !['transport', 'food', 'budget_tips', 'best_season'].includes(key))
              .map((key, index) => (
                <li key={index} className="capitalize"><span className="font-semibold">{key.replace(/_/g, ' ')}:</span> {tripData.notes[key]}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Message if no data for sections */}
      {(!tripData.hotelOptions || tripData.hotelOptions.length === 0) &&
       (!tripData.itinerary || tripData.itinerary.length === 0) &&
       (!tripData.notes || Object.keys(tripData.notes).length === 0) && (
        <div className="text-center text-gray-600 mt-10 p-6 bg-gray-100 rounded-lg">
          <p className="text-lg font-semibold">No detailed trip information available. The AI might have generated an empty plan for these sections.</p>
        </div>
      )}

    </div>
  );
}

export default TripResult;