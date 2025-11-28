const Workout = require("../models/Workout.js");
const { errorHandler } = require("../auth.js");

// Add Workout
module.exports.addWorkout = (req, res) => {
  let newWorkout = new Workout({
    name: req.body.name,
    duration: req.body.duration,
    userId: req.user.id,
  });

  Workout.findOne({ name: req.body.name, userId: req.user.id })
    .then((existingWorkout) => {
      if (existingWorkout) {
        return res.status(409).send({ message: "This workout already exists" });
      } else {
        // Saves the created object to our database
        return newWorkout
          .save()
          .then((result) => res.status(201).send(result))
          .catch((error) => errorHandler(error, req, res));
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Get all Workouts
module.exports.getMyWorkouts = (req, res) => {
  return Workout.find({})
    .then((result) => {
      if (result.length > 0) {
        res.status(200).send({ workouts: result });
      } else {
        return res.status(404).send({ message: "No workouts found" });
      }
    })

    .catch((error) => errorHandler(error, req, res));
};

// Update Workout
module.exports.updateWorkout = (req, res) => {
  let updatedWorkout = {
    name: req.body.name,
    duration: req.body.duration,
  };

  return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
    .then((workout) => {
      if (workout) {
        res.status(200).send({
          message: "Workout updated successfully",
          updatedWorkout: workout,
        });
      } else {
        res.status(404).send({ message: "Workout not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Update Workout Status from default "Pending"
module.exports.completeWorkoutStatus = async (req, res) => {
  let completedWorkout = {
    status: req.body.status,
  };

  return Workout.findByIdAndUpdate(req.params.workoutId, completedWorkout)
    .then((workout) => {
      if (workout) {
        res.status(200).send({
          message: "Workout updated successfully",
          updatedWorkout: workout,
        });
      } else {
        res.status(404).send({ message: "Workout not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Delete Workout
module.exports.deleteWorkout = (req, res) => {
  return Workout.findByIdAndDelete(req.params.workoutId)
    .then((workout) => {
      if (workout) {
        return res.status(200).send({
          message: "Workout deleted successfully",
        });
      } else {
        return res.status(404).send({ message: "Workout not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
