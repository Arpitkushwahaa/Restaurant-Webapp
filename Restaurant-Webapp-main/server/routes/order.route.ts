import express from "express"
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { createCheckoutSession, deleteOrder, getUserOrders, verifyPayment } from "../controller/order.controller";

const router = express.Router();

router.route("/").get(isAuthenticated, getUserOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/payment/verify").post(isAuthenticated, verifyPayment);
router.route("/:id").delete(isAuthenticated, deleteOrder);

export default router;