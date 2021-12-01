const express = require("express");
const roleRouter = express.Router();

const { createRole, getAllRoles } = require("./../controllers/role");

roleRouter.post("/create", createRole);
roleRouter.get("/", getAllRoles);

module.exports = roleRouter;
