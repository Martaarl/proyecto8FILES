const { upload } = require("../../middlewares/multer");
const { getPlaces, postPlaces, deletePlace, getPlacesById } = require("../controllers/places");

const placesRouter = require("express").Router();

placesRouter.get("/", getPlaces);
placesRouter.get("/:id", getPlacesById)
placesRouter.post("/", upload.single("img"), postPlaces);
placesRouter.delete("/:id", deletePlace);


module.exports = placesRouter;