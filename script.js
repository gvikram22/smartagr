const API_KEY = "";
// Use a model available in your Gemini API account.
const MODEL = "";

const analyzeBtn = document.getElementById("analyzeBtn");

const irrigationResult =
    document.getElementById("irrigationResult");

const aiResult =
    document.getElementById("aiResult");


// ===============================
// ANALYZE FARM
// ===============================

analyzeBtn.addEventListener("click", analyzeFarm);


async function analyzeFarm() {

    const moisture =
        Number(document.getElementById("moisture").value);

    const temperature =
        Number(document.getElementById("temperature").value);

    const humidity =
        Number(document.getElementById("humidity").value);

    const rain =
        Number(document.getElementById("rain").value);

    const crop =
        document.getElementById("crop").value;

    const growthStage =
        document.getElementById("growthStage").value;

    const soilType =
        document.getElementById("soilType").value;


    // Update dashboard

    document.getElementById("moistureValue")
        .textContent = moisture + "%";

    document.getElementById("temperatureValue")
        .textContent = temperature + "°C";

    document.getElementById("humidityValue")
        .textContent = humidity + "%";

    document.getElementById("rainValue")
        .textContent = rain + "%";


    // ===============================
    // IRRIGATION LOGIC
    // ===============================

    let irrigationMessage;


    if (moisture < 30 && rain < 40) {

        irrigationMessage =
`⚠️ IRRIGATION REQUIRED

Soil moisture is low.

Recommended Action:
Start irrigation soon.

Current Soil Moisture:
${moisture}%

Rain Probability:
${rain}%`;

    }

    else if (moisture < 45 && rain < 30) {

        irrigationMessage =
`💧 LIGHT IRRIGATION RECOMMENDED

The soil is becoming dry.

Consider moderate irrigation and
continue monitoring the soil moisture.`;

    }

    else if (rain >= 60) {

        irrigationMessage =
`🌧️ IRRIGATION NOT RECOMMENDED

Rain probability is high.

Consider waiting for rainfall
before irrigating.`;

    }

    else {

        irrigationMessage =
`✅ IRRIGATION NOT CURRENTLY REQUIRED

Current soil moisture appears adequate.

Continue monitoring the field.`;

    }


    irrigationResult.textContent =
        irrigationMessage;


    // ===============================
    // AI RECOMMENDATION
    // ===============================

    await getAIRecommendation(
        moisture,
        temperature,
        humidity,
        rain,
        crop,
        growthStage,
        soilType
    );

}



// ========================================
// AI RECOMMENDATION FUNCTION
// ========================================

async function getAIRecommendation(
    moisture,
    temperature,
    humidity,
    rain,
    crop,
    growthStage,
    soilType
) {

    // Check API key

    if (API_KEY === "YOUR_GEMINI_API_KEY") {

        aiResult.textContent =
`⚠️ Gemini API key is not configured.

Add your Gemini API key in script.js:

const API_KEY = "YOUR_API_KEY";`;

        return;
    }


    // Loading message

    aiResult.textContent =
        "🤖 AI is analyzing the farm conditions...";


    // ===============================
    // AI PROMPT
    // ===============================

    const prompt = `

You are an AI agriculture assistant.

Analyze the following farm conditions.

Crop:
${crop}

Growth Stage:
${growthStage}

Soil Type:
${soilType}

Soil Moisture:
${moisture}%

Temperature:
${temperature}°C

Humidity:
${humidity}%

Rain Probability:
${rain}%


Provide the following:

1. Irrigation recommendation
2. Reason for the recommendation
3. Crop condition observation
4. Weather consideration
5. One practical farming tip

Keep the response concise and easy to understand.

Do not invent sensor readings.

`;


    try {

        // ===============================
        // GEMINI API REQUEST
        // ===============================

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "x-goog-api-key":
                        API_KEY

                },

                body: JSON.stringify({

                    contents: [

                        {

                            parts: [

                                {
                                    text: prompt
                                }

                            ]

                        }

                    ]

                })

            }
        );


        // Convert response to JSON

        const data =
            await response.json();


        // Check API error

        if (!response.ok) {

            throw new Error(
                data.error?.message ||
                "Gemini API request failed"
            );

        }


        // Get AI response

        const result =
            data.candidates?.[0]
                ?.content?.parts?.[0]
                ?.text;


        if (!result) {

            throw new Error(
                "No AI response received."
            );

        }


        // Display AI response

        aiResult.textContent =
            result;

    }


    catch (error) {

        console.error(
            "AI Error:",
            error
        );

        aiResult.textContent =
            "❌ AI Error: " + error.message;

    }

}