//Dependecies and Modules
const express = require("express");
const workoutController = require("../controllers/workouts.js");
const { verify } = require("../auth.js");

//Routing Component
const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);

router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);

router.patch(
  "/updateWorkout/:workoutId",
  verify,
  workoutController.updateWorkout
);

router.patch(
  "/completeWorkoutStatus/:workoutId",
  verify,
  workoutController.completeWorkoutStatus
);

router.delete(
  "/deleteWorkout/:workoutId",
  verify,
  workoutController.deleteWorkout
);

module.exports = router;
