const amqplib = require("amqplib");
require("dotenv").config();

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(
      process.env.RABBITMQ_URI,
      (err) => {
        if (err) {
          console.error("Connection error:", err.message);
          setTimeout(connectRabbitMQ, 1000); 
          return;
        }
      }
    );
    console.log("RabbitMQ connected");
    return connection;
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    process.exit(1);
  }
};

module.exports = connectRabbitMQ;
