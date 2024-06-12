const Customer = require('../models/customer');
const { publishMessage, consumeMessages } = require('../services/pubSubService');
const { isValidCustomer } = require('../utils/validation');

exports.createCustomer = async (req, res) => {
    try {
        ;
        const customer = {name: req.body.name, email: req.body.email, password: req.body.password}
        
        response = isValidCustomer(customer)
        if (response!=true){
            return res.status(400).json(response);
        }
        if (req.body.isCampaigner){
            customer.isCampaigner=req.body.isCampaigner
        }
        res.status(201).json({Success: customer});
        await publishMessage('customer',JSON.stringify(customer))
        return 0; 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCustomer = async(log)=>{
    try {
        let user= Customer.find({email: log.email})
        if (!user){
            const result = await Customer.create(log)
            console.log('Document added successfully:', result);
        }

        } catch (error) {
            console.error('Error adding document:', error);
        }
};
consumeMessages("customer",addCustomer)