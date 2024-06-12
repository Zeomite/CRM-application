const Campaign = require('../models/campaign');
const CommunicationLog = require('../models/communicationLog');
const Customer = require('../models/customer');
const { publishMessage ,  consumeMessages} = require('../services/pubSubService');
const campaign = require('../models/campaign');

function buildQueryFromRules(queryString) {
  const rules = queryString.split("●").map(rule => rule.trim());
  const query = { $or: [] };

  rules.forEach(rule => {
      const subQuery = { $and: [] };

      const clauses = rule.split(/\s+(AND|OR)\s+/i).map(clause => clause.trim());

      clauses.forEach(clause => {
          let condition;

          if (/not visited in last/i.test(clause)) {
              const months = clause.match(/\d+/)[0];
              condition = { lastVisit: { $lt: new Date(new Date().setMonth(new Date().getMonth() - months)) } };
          } else if (/total spends\s*>\s*INR\s*(\d+)/i.test(clause)) {
              const amount = clause.match(/total spends\s*>\s*INR\s*(\d+)/i)[1];
              condition = { totalSpends: { $gt: parseInt(amount, 10) } };
          } else if (/max number of visits are\s*(\d+)/i.test(clause)) {
              const visits = clause.match(/max number of visits are\s*(\d+)/i)[1];
              condition = { maxVisits: parseInt(visits, 10) };
          } else if (/status\s*==\s*'(\w+)'/i.test(clause)) {
              const status = clause.match(/status\s*==\s*'(\w+)'/i)[1];
              condition = { status: status };
          } else {
              throw new Error(`Unrecognized rule: ${clause}`);
          }

          subQuery.$and.push(condition);
      });

      // Check if the rule is negated
      if (/^Customers not /i.test(rule)) {
          query.$or.push({ $not: subQuery });
      } else {
          query.$or.push(subQuery);
      }
  });

  return query;
}

exports.createCampaign = async (req, res) => {
    const { campaignerId, audience, name } = req.body;
    try {
        const existingUser = await Customer.findById(campaignerId);
        if (!existingUser || existingUser.isCampaigner!=true) {
        return res.status(400).json({
          message: "Invalid User id",
        });
        }
        const campaign = new Campaign({ campaignerId, audience, name});
        await campaign.save();
        return res.status(201).json(campaign);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    const { campaignId, message } = req.body;
    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
        return res.status(400).json({
          message: "Invalid Campaign",
        });
        }
        let query = buildQueryFromRules(campaign.audience);
        let audience = await Customer.find(query);
        audience.forEach(consumer => {
          let log = new CommunicationLog({campaignId: campaignId, customerId: consumer._id, message:message }) 
          log.save()
      });
        await publishMessage('message',JSON.stringify({ campaignId, message }));
        
        return res.status(201).json({Success:"Message Sent Successfuly"});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const recieveMessage = async(log)=>{
    let logs = await CommunicationLog.find({$and: [{campaignerId: log.campaignId}, {message: log.message}]});
    logs.forEach(log => {
        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        log.status= status;
        log.save()
    });

}

consumeMessages('message',recieveMessage);