const amqplib = require('amqplib');

const publishMessage = async (queue, message) => {
    const connection = await amqplib.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));
};

const consumeMessages = async (queue, processMessage) => {
    const connection = await amqplib.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);

    channel.consume(queue, async (msg) => {
        const message = JSON.parse(msg.content.toString());
        processMessage(message);
        channel.ack(msg);
    });
};

module.exports = { publishMessage, consumeMessages };
