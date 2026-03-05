const { isAuth, isAdmin } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/multer");
const { getPlaces, postPlaces, deletePlace, getPlacesById, putPlaces } = require("../controllers/places");

const placesRouter = require("express").Router();

placesRouter.get("/", getPlaces);
placesRouter.get("/:id", getPlacesById)
placesRouter.post("/", isAuth,  upload.single("img"), postPlaces);
placesRouter.put("/:id", isAuth, upload.single("img"), putPlaces);
placesRouter.delete("/:id", isAuth, isAdmin, deletePlace);


module.exports = placesRouter;