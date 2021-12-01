const express = require("express");
const taskRouter = express.Router();
const authentication = require("./../middleWhere/authentication");



const { getAllTasks, getAllDeletedTasks , getTask , createTask , updateTask ,deleteTask } = require("./../controllers/task");

taskRouter.get("/",  authentication , getAllTasks); //not deleted (id for user)
taskRouter.get("/deltedTasks", authentication,  getAllDeletedTasks); // deleted
taskRouter.get("/one", authentication,  getTask); // by id
taskRouter.post("/create", authentication ,  createTask);
taskRouter.put("/update", authentication ,  updateTask);
taskRouter.delete("/delete", authentication , deleteTask); // by id

module.exports = taskRouter;
