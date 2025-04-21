export const selectTravelList=[
    {
        id:'1',
        title:'Me',
        desc:'Solo Travel',
        icon:'✈️',
        people:'1'
    },
    {
        id:'2',
        title:'Couple',
        desc:'Two Travellers',
        icon:'🧳',
        people:'2'
    },
    {
        id:'3',
        title:'Family',
        desc:'Group Travel',
        icon:'🧭',
        people:'3 to 5'
    },
    {
        id:'4',
        title:'Friends',
        desc:'Group Travel',
        icon:'🚕',
        people:'5 to 10'
    },
]

export const selectBudgetList=[
    {
        id:1,
        title:'Cheap',
        desc:'Conscious of cost',
        icon:'💵'
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💲'
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸'
    }
]


export const AI_PROMPT = `Generate a JSON travel plan for {location} for {days} days for a {group} with a {budget} budget.

Include a 'hotelOptions' array with the following details for each option: hotelName, hotelAddress, price (approximate range), hotelImageURL, geocoordinates (latitude and longitude), rating (e.g., '4.2/5'), and a brief description.

Include an 'itinerary' array where each element represents a day. Each day object should have a 'day' number and a 'dailyPlan' array. Each element in 'dailyPlan' should represent a place to visit and include:
- placeName
- placeDetails (a concise description)
- placeImageURL
- geocoordinates (latitude and longitude)
- ticketPricing (approximate cost or 'Free'/'N/A')
- rating (e.g., '4.7/5' or 'N/A')
- timeToSpend (estimated duration in hours or 'N/A')
- travelTimeFromPrevious (estimated travel time from the last visited place in minutes or 'N/A')
- bestTimeToVisit (e.g., 'Morning', 'Afternoon', 'Evening', or 'All day')

Please ensure all requested fields are included in the JSON response. If specific information is unavailable, use 'N/A' as the value. Aim for a well-structured and readable JSON output.`