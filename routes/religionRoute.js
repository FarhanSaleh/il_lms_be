const express = require("express");
const { createReligionHandler, getReligionByIdHandler, getAllReligionsHandler, updateReligionHandler, deleteReligionHandler } = require("../controllers/religionHandler");
const router = express.Router();

router.post("/religion", createReligionHandler);
router.get("/religion/:id", getReligionByIdHandler);
router.get("/religion", getAllReligionsHandler);
router.put("/religion/:id", updateReligionHandler);
router.delete("/religion/:id", deleteReligionHandler);

module.exports = router;