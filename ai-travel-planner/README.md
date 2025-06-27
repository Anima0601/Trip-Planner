# AI Travel Planner

## 🌟 Overview

Welcome to the **[AI Travel Planner]**, an innovative web application designed to simplify and enhance your travel planning experience. Leveraging the power of Google's Generative AI and Unsplash, this tool helps you discover new destinations, build personalized itineraries, and visualize points of interest with stunning images.

---

## ✨ Features

* **AI-Powered Itinerary Generation:** Generate detailed travel plans based on your preferences, including destination, travel dates, and interests.
* **Destination Discovery:** Explore recommended places and activities for your chosen location.
* **Visual Enhancements:** See beautiful, relevant images for suggested hotels, landmarks, and attractions powered by the Unsplash API.
* **Personalized Suggestions:** Get tailored recommendations for accommodations and points of interest.
* **Trip History:** (Optional: If you implemented this) View and manage your previously generated trip plans.
* **Responsive Design:** (Optional: If applicable) Enjoy a seamless experience on various devices.

---

## 🛠 Technologies Used

This project is built using a modern full-stack architecture:

* **Frontend:** `[Your Frontend Framework/Library, e.g., React, Vue.js, Angular, or Vanilla HTML/CSS/JS]`
* **Backend (Cloud Functions):**
    * Node.js
    * Express.js
    * Firebase Cloud Functions (2nd Generation)
* **Cloud Platform:** Google Firebase (Firestore, Cloud Functions, Hosting, Secret Manager)
* **APIs:**
    * **Google Generative AI API:** For intelligent trip planning and recommendations.
    * **Unsplash API:** For fetching high-quality images of places and attractions.
    * `[Any other APIs you used, e.g., Google Maps API if applicable]`
* **Tools & Libraries:**
    * Axios (for HTTP requests)
    * CORS (for cross-origin resource sharing)
    * Firebase CLI
    * npm (Node Package Manager)
    * Git

---

## 🚀 Live Demo

https://gen-lang-client-0123876060.web.app/

---

## ⚙️ Setup Instructions (Local Development)

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended) and npm installed.
* Git installed.
* A Google account with a Firebase project set up.
* Access to the Google Cloud Console for API Key and Secret Manager setup.

### 1. Clone the Repository

```bash
git clone https://github.com/Anima0601/Trip-Planner.git
cd ai-travel-planner
2. Install Frontend Dependencies
Navigate into your frontend directory and install the necessary packages.

Bash

npm install
3. Install Backend (Firebase Functions) Dependencies
Navigate into your functions directory and install the necessary packages.

Bash

cd ../functions '
npm install
4. Firebase Project Configuration
Before running the functions, you need to link your local environment to your Firebase project and configure API keys.

a. Link to Firebase Project:
Make sure you're logged into the Firebase CLI and connected to your project.

Bash

# In your project root (e.g., ai-travel-planner)
firebase login
firebase use --add [YOUR_FIREBASE_PROJECT_ID]
b. Configure API Keys & Secrets:

Google Generative AI API Key:

Obtain your API key from the Google Cloud Console Credentials page.

If used on the Frontend: Create a .env file in your frontend root ([ai-travel-planner]/.env) and add:

VITE_GOOGLE_API_KEY=[YOUR_GENERATIVE_AI_API_KEY]
(Adjust VITE_ prefix if your frontend framework uses a different one, e.g., REACT_APP_ for Create React App).

If used in Firebase Functions:
Set it as a Firebase Secret.

Bash

# In your project root (ai-travel-planner)
firebase functions:secrets:set GENERATIVE_AI_KEY "YOUR_ACTUAL_GENERATIVE_AI_KEY"
(Then ensure your function's code accesses process.env.GENERATIVE_AI_KEY and the function is configured to use this secret).

Unsplash API Key:

Obtain your Access Key from the Unsplash Developers website.

Set it as a Firebase Secret:

Bash

# In your project root (ai-travel-planner)
firebase functions:secrets:set UNSPLASH_KEY "YOUR_ACTUAL_UNSPLASH_ACCESS_KEY"
Verify it's in Google Cloud Secret Manager (Crucial Step):

Go to Google Cloud Secret Manager.

Confirm UNSPLASH_KEY is listed. If not, click "CREATE SECRET" and manually add it with the name UNSPLASH_KEY and your key as the value.

5. Deploy Firebase Functions
Deploy your backend functions to Firebase Cloud Functions.

Bash

# In your project root (ai-travel-planner)
cd functions
firebase deploy --only functions
After deployment, note the Function URL (api(...)) provided in the terminal output You will need this for your frontend.

Update Frontend API Calls: In your frontend code, ensure that API calls targeting your Firebase Function (/api/get-place-image-data) are pointing to the correct deployed URL.

6. Run the Frontend Development Server
Finally, start your frontend application locally.

Bash

# From your frontend folder (e.g., client)
npm start # Or 'npm run dev', 'yarn start', etc. Check your frontend's package.json scripts.
Your application should now be running locally, usually accessible at http://localhost:[PORT_NUMBER].

📈 Usage
Navigate to the application in your web browser.

Enter your desired destination, travel dates, and interests.

Click "Generate Plan" (or similar) to receive your personalized itinerary.

Explore the suggested hotels and attractions, now enhanced with images!

🛣️ Future Enhancements (Optional)
User authentication and saved trips database.

Interactive maps for itineraries.

Budget tracking.

Integration with flight/hotel booking APIs.

More granular customization of travel preferences.

📞 Contact
[Anima] - [animasingh78@gmail.com]

Project Link: https://github.com/Anima0601/Trip-Planner

