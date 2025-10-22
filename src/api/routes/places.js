const { getPlaces, postPlaces } = require("../controllers/places");

const placesRouter = require("express").Router();

placesRouter.get("/", getPlaces);
placesRouter.post("/", postPlaces);

module.exports = placesRouter;