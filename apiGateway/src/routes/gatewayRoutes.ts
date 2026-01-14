import { Router } from "express";
import axios from "axios";

const router = Router();

const forward = async (req: any, res: any, targetUrl: string) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.originalUrl.replace("/api/v1", "")}`,
      headers: {
        authorization: req.headers.authorization || ""
      },
      data: req.body,
      params: req.query
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Gateway error"
    });
  }
};

// Hotel Search
router.use("/hotels", (req, res) =>
  forward(req, res, process.env.HOTEL_SEARCH_URL!)
);

// Hotel Admin
router.use("/admin", (req, res) =>
  forward(req, res, process.env.HOTEL_ADMIN_URL!)
);

// Booking
router.use("/bookings", (req, res) =>
  forward(req, res, process.env.BOOKING_URL!)
);

// Notifications
router.use("/notifications", (req, res) =>
  forward(req, res, process.env.NOTIFICATION_URL!)
);

// ML Price Prediction
router.use("/ml", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.ML_PRICE_URL}${req.originalUrl.replace("/api/v1/ml", "")}`,
      data: req.body
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: "Gateway error"
    });
  }
});

  // AUTH
  router.use("/auth", (req, res) =>
    forward(req, res, process.env.AUTH_SERVICE_URL!)
  );


export default router;
