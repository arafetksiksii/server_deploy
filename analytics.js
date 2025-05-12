// analytics.js
const express = require("express")
const { BetaAnalyticsDataClient } = require("@google-analytics/data")
require("dotenv").config()

const router = express.Router()

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,  // Use the environment variable here
})

const PROPERTY_ID = process.env.GA4_PROPERTY_ID

router.get("/views", async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [{ name: "screenPageViews" }],
      dimensions: [{ name: "pagePath" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "EXACT",
            value: "/dashboard", // Change this to your actual route if needed
          },
        },
      },
    })

    const views = response.rows?.[0]?.metricValues?.[0]?.value || "0"
    res.json({ views: parseInt(views) })
  } catch (error) {
    console.error("Error fetching GA data:", error)
    res.status(500).json({ error: "Failed to fetch views" })
  }
})

module.exports = router
