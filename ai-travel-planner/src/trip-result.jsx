
import React from 'react';
import { useLocation } from 'react-router-dom';

function TripResult() {
  const location = useLocation();
  const tripData = location.state?.tripData;

  if (!tripData) {
    return <div className="m-3 mx-10 p-4">No trip data available. Please generate a trip first.</div>;
  }

  return (
    <div className="m-3 mx-10 p-4">
      <h2 className="font-bold font-serif text-xl mb-4">{tripData.planDetails?.location} - {tripData.planDetails?.duration} for {tripData.planDetails?.traveller_type}</h2>


      {tripData.hotelOptions && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Hotel Options:</h3>
          {tripData.hotelOptions.map((hotel, index) => (
            <div key={index} className="border rounded-md p-4 mb-2">
              <h4>{hotel.hotelName}</h4>
              <p className="text-sm text-gray-600">{hotel.hotelAddress}</p>
              <p className="text-sm">Price: {hotel.price}</p>
              <p className="text-sm">Rating: {hotel.rating}</p>
              <p className="text-sm">{hotel.description}</p>
              {hotel.hotelImageURL && <img src={hotel.hotelImageURL} alt={hotel.hotelName} className="max-w-full h-auto mt-2" />}
            </div>
          ))}
        </div>
      )}

{tripData?.itinerary && Array.isArray(tripData.itinerary) && (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Itinerary:</h3>
    {tripData.itinerary.map((day) => {
      console.log("Individual Day Object:", day); // Add this line
      return (
        <div key={day.day} className="border rounded-md p-4 mb-4">
          <h4 className="font-semibold">{day.theme}</h4>
          {day.dailyPlan && Array.isArray(day.dailyPlan) ? (
            <ul>
              {day.dailyPlan.map((activity, index) => (
                <li key={index} className="mb-2">
                  <strong>{activity.placeName}:</strong> {activity.placeDetails} (Best time to visit: {activity.bestTimeToVisit})
                  {activity.placeImageUrl && <img src={activity.placeImageUrl} alt={activity.placeName} className="max-w-full h-auto mt-2" />}
                  {activity.ticketPricing && <p className="text-sm">Ticket: {activity.ticketPricing}</p>}
                  {activity.rating && <p className="text-sm">Rating: {activity.rating}</p>}
                  {activity.timeToSpend && <p className="text-sm">Time to spend: {activity.timeToSpend}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No plan available for Day {day.day}.</p>
          )}
        </div>
      );
    })}
  </div>
)}
     {tripData?.notes && (
  <div>
    <h3 className="font-semibold mb-2">Notes:</h3>
    <p className="text-sm">{tripData.notes.transport}</p>
    <p className="text-sm">{tripData.notes.food}</p>
    <p className="text-sm">{tripData.notes.budget_tips}</p>
    <p className="text-sm">{tripData.notes.best_season}</p>
    {Object.keys(tripData.notes).map((key, index) => (
      <p key={index} className="text-sm">{key}: {tripData.notes[key]}</p>
    ))}
  </div>
)}
    </div>
  );
}

export default TripResult;