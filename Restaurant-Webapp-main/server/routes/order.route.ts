import express from "express"
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { createCheckoutSession, getUserOrders, verifyPayment } from "../controller/order.controller";

const router = express.Router();

router.route("/").get(isAuthenticated, getUserOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/payment/verify").post(isAuthenticated, verifyPayment);

export default router;