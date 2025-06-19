import {Router} from "express";
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { createRestaurant, getRestaurant, getRestaurantById, getRestaurantOrders, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import { upload } from "../middlewares/multer";


const router = Router();
router.route("/").post(isAuthenticated, upload.single("image"), createRestaurant);
router.route("/").get(getRestaurant);
router.route("/").put(isAuthenticated, upload.single("image"), updateRestaurant);

// Updated search route to use "all" for retrieving all restaurants and make the search text parameter optional
router.route("/search-restaurants").get(searchRestaurant);
router.route("/search-restaurants/:searchText").get(searchRestaurant);

router.route("/order").get(isAuthenticated, getRestaurantOrders);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/:id").get(getRestaurantById);

export default router;



