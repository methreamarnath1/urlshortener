const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("the server is connected to db");
    })

    .catch((e) => {
      console.error("DBconnection is failed ", e);
    });
}

module.exports = connectToDB;

 
