import {Router} from "express";
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { createRestaurant, getRestaurant, getRestaurantById, getRestaurantOrders, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import { upload } from "../middlewares/multer";


const router = Router();
router.route("/").post(isAuthenticated, upload.single("image"), createRestaurant);
router.route("/").get(getRestaurant);
router.route("/").put(isAuthenticated, upload.single("image"), updateRestaurant);

router.route("/search/:query").get(searchRestaurant);
router.route("/order").get(isAuthenticated, getRestaurantOrders);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/:id").get(getRestaurantById);

export default router;



