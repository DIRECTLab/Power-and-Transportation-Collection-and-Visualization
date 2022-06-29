const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const { Op } = require('sequelize');
const moment = require('moment');


// Get just the current transaction (if one)
router.get('/:chargerId/transaction/current', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { Transaction } = res.locals.models;

  const transaction = await Transaction.findOne({
    where: {
      ChargerId: chargerId,
      current: true,
    }
  });

  if (!transaction)
    return res.json(shared.makeResponse({info: 'No current transaction'}));

  return res.json(shared.makeResponse(transaction));
}));

router.get('/transaction', shared.asyncWrapper(async (req, res) => {
  const { Transaction, Charger } = res.locals.models;

  // Mark transacations from a day ago as not current, in case the stop transaction was missed
  await Transaction.update({ current: false }, {
    where: {
      timestampStart: {
        [Op.lte]: moment().subtract(1, 'days').toDate(),
      },
    },
  });

  let transactions;
  if (req.query.limit){
    transactions = await Transaction.findAll({
      limit: req.query.limit,
      order: [ ['updatedAt', 'DESC'] ],
      include: [Charger],
    });
  }
  else{
    transactions = await Transaction.findAll({
      order: [ ['updatedAt', 'DESC'] ],
      include: [Charger],
    });
  }

  return res.json(shared.makeResponse(transactions));
}))

// Get transactions by charger
router.get('/:chargerId/transaction', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { Transaction } = res.locals.models;

  const transactions = await Transaction.findAll({
    where: {
      ChargerId: chargerId,
    }
  });

  return res.json(shared.makeResponse(transactions));
}));

// New transaction
router.post('/:chargerId/transaction', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { Transaction, Charger } = res.locals.models;

  const { connectorId, meterStart, timestampStart } = req.body;

  let errors = [];
  if (!connectorId)
    errors.push("Missing connectorId");
  if (!meterStart)
    errors.push("Missing meter start value (meterStart)");
  if (!timestampStart)
    errors.push("Missing start timestamp (timestamp)");
  
  const charger = await Charger.findByPk(chargerId);
  if (!charger)
    errors.push("No charger with the given id exists");

  if (errors.length)
    throw new InvalidRequestError(errors.join(';'))

  const transaction = await Transaction.create({...req.body, current: true, ChargerId: chargerId });
  return res.json(shared.makeResponse(transaction));

}));

// Update a transaction
router.patch('/:chargerId/transaction', shared.asyncWrapper(async (req, res) => {
  const { Transaction } = res.locals.models;

  if (req.body.meterStop){
    const transaction = await Transaction.findByPk(req.body.transactionId)
    const powerConsumed = req.body.meterStop - transaction.meterStart;
    await Transaction.update({ ...req.body, powerConsumed: powerConsumed, current: false }, { where: { id: req.body.transactionId } });
  }
  else{
    await Transaction.update(req.body, { where: { id: req.body.transactionId } });
  }

  return res.json(shared.makeResponse("Success"));

}))


// Gets the unhandled one time commands for a charger
router.get('/:chargerId/commands/current', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { OneTimeCommand } = res.locals.models;

  const commands = await OneTimeCommand.findAll({
    where: {
      ChargerId: chargerId,
      handled: false,
    }
  });

  return res.json(shared.makeResponse(commands));
}));

// Add a new command to a charger
router.post('/:chargerId/commands', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { Charger, OneTimeCommand } = res.locals.models;

  const allowedCommands = ["SoftReset", "HardReset", "ClearChargingProfile"];

  if (! await Charger.findByPk(chargerId))
    throw new InvalidRequestError("No charger found")
  
  if (!req.body.command)
    throw new InvalidRequestError("Missing required command")
  
  if (!allowedCommands.includes(req.body.command))
    throw new InvalidRequestError(`Command (${req.body.command}) is not a valid command`);

  if (req.body.command === "ClearChargingProfile"){
    const { ChargingProfile } = res.locals.models;
    ChargingProfile.update({ cleared: true }, {
      where: {
        ChargerId: chargerId
      }
    })
  }
  
  const command = await OneTimeCommand.create({...req.body, ChargerId: chargerId});

  return res.json(shared.makeResponse(command));
}));

// update a one time command (marking complete)
router.patch('/:chargerId/commands', shared.asyncWrapper(async (req, res) => {

  const { OneTimeCommand } = res.locals.models;

  if (!req.body.id)
    throw new InvalidRequestError("Missing command id")

  console.log(req.body.id)
  await OneTimeCommand.update({ ...req.body, handled: true }, {
    where: {
      id: req.body.id,
    }
  });
  return res.json(shared.makeResponse("Success"))
}));


// Get the meter values for a charger
router.get('/:chargerId/meterValues', shared.asyncWrapper(async (req, res) => {


  const { MeterValue, SampledValue, Transaction, Charger } = res.locals.models;

  if (! await Charger.findByPk(req.params.chargerId))
    throw new InvalidRequestError("Invalid charger id")
  
  const values = await Transaction.findAll({
    where: {
      ChargerId: req.params.chargerId,
    },
    attributes: [],
    include: [{
      model: MeterValue,
      include: [SampledValue]
    }]
  });
  return res.json(shared.makeResponse(values));
}));


// Post the meter values for a charger
router.post('/:chargerId/meterValues', shared.asyncWrapper(async (req, res) => {

  const { MeterValue, SampledValue, Transaction, Charger } = res.locals.models;

  if (! await Charger.findByPk(req.params.chargerId))
    throw new InvalidRequestError("Charger does not exist");
  
  if (! await Transaction.findByPk(req.body.transactionId))
    throw new InvalidRequestError("Transaction does not exist");
  
  if (!req.body.timestamp)
    throw new InvalidRequestError("Missing a timestamp");
  
  if (!req.body.sampled_value)
    throw new InvalidRequestError("Missing sampled values");
  
  const meterValue = await MeterValue.create({ TransactionId: req.body.transactionId, timestamp: req.body.timestamp });
  const sampled_values = JSON.parse(req.body.sampled_value.replaceAll("'", '"'));
  for (let sampleValue of sampled_values){
    await SampledValue.create({...sampleValue, MeterValueId: meterValue.id });
  }

  return res.json(shared.makeResponse(meterValue));

}));


// Get the current charge profile for a given charger
router.get('/:chargerId/profile/current', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { ChargingProfile } = res.locals.models;

  const profile = await ChargingProfile.findOne({
    where: {
      ChargerId: chargerId,
    },
    order: [ ['createdAt', 'DESC'] ]
  });

  if (profile?.cleared){
    return res.json(shared.makeResponse(null));
  }

  return res.json(shared.makeResponse(profile));
}));

// Post a new charge profile for a given charger
router.post('/:chargerId/profile', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { Charger, ChargingProfile } = res.locals.models;

  const requiredParams = ["chargingProfileId", "stackLevel", "chargingProfilePurpose", "chargingProfileKind", "chargingSchedule", "connectorId" ]

  const missing = []

  requiredParams.forEach(param => {
    if (req.body[param] === null) missing.push(`Missing required parameter: ${param}`);
  });

  if (missing.length)
    return res.json(shared.makeResponse({}, missing));

  const allowedPurposes = ["ChargePointMaxProfile", "TxDefaultProfile", "TxProfile"];
  const allowedKinds = ["Absolute", "Recurring", "Relative"];

  if (!allowedPurposes.includes(req.body.chargingProfilePurpose))
    return res.json(shared.makeResponse({}, `Purpose (${req.body.chargingProfilePurpose}) is not a valid purpose`));
  
  if (!allowedKinds.includes(req.body.chargingProfileKind))
    return res.json(shared.makeResponse({}, `Kind (${req.body.chargingProfileKind}) is not a valid kind`));

  if (!Charger.findByPk(chargerId))
    return res.json(shared.makeResponse({}, "No charger was found"));
  
  const profile = await ChargingProfile.create({...req.body, ChargerId: chargerId});

  return res.json(shared.makeResponse(profile));

}))

// Gets all profiles for a charger
router.get('/:chargerId/profile', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { ChargingProfile } = res.locals.models;

  const profiles = await ChargingProfile.findAll({
    where: {
      ChargerId: chargerId,
    },
    order: [ ['createdAt', 'DESC'] ]
  });


  return res.json(shared.makeResponse(profiles));
}));


// Updates handle on profiles for a charger
router.patch('/:chargerId/profile', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { ChargingProfile } = res.locals.models;

  const profiles = await ChargingProfile.update(
    {  
      handled: true 
    },
    {
      where: {
        ChargerId: chargerId,
        id: req.body.id,
      }
    }
  );


  return res.json(shared.makeResponse(profiles));
}));


router.patch('/:chargerId/profile/clear', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { ChargingProfile } = res.locals.models;

  const profiles = await ChargingProfile.update(
    {  
      cleared: true,
      handled: true 
    },
    {
      where: {
        ChargerId: chargerId,
        id: req.body.id,
      }
    }
  );


  return res.json(shared.makeResponse(profiles));
}));

// Gets status by charger
router.get('/:chargerId/status', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;

  const { ChargerStatus } = res.locals.models;

  if (req.query.recent){
    const status = await ChargerStatus.findOne({
      where: {
        ChargerId: chargerId,
      },
      order: [['statusTime', 'DESC']]
    })
    return res.json(shared.makeResponse(status));
  }

  const status = await ChargerStatus.findAll({
    where: {
      ChargerId: chargerId,
    },
    order: [['statusTime', 'DESC']]
  });

  return res.json(shared.makeResponse(status));
}));

// Posts a status by charger
router.post('/:chargerId/status', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.params.chargerId;
  const { Charger, ChargerStatus } = res.locals.models;

  let charger = await Charger.findByPk(chargerId);

  if (!charger) {
    charger = await Charger.create({id: chargerId, chargerName: chargerId});
  }

  try {
    const status = await ChargerStatus.create({...req.body, ChargerId: chargerId});
    return res.json(status)
  } catch (err) {
    throw new InvalidRequestError(err)
  }
}));


// Get a given charger
router.get('/:chargerId', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;
  const charger = await Charger.findByPk(req.params.chargerId);
  return res.json(shared.makeResponse(charger));
}));

// Update a charger
router.patch('/:chargerId', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;
  await Charger.update(req.body, {
    where: {
      id: req.params.chargerId,
    }
  });
  return res.json(shared.makeResponse("Success"));
}));

// Delete a charger (this should have authentication, really shouldn't be happening, more for testing)
router.delete('/:chargerId', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;
  await Charger.destroy({
    where: {
      id: req.params.chargerId,
    },
  });
  return res.json(shared.makeResponse("Success"));
}))

// Get all chargers
router.get('/', shared.asyncWrapper(async (req, res) => {

  const { Charger } = res.locals.models;

  const chargers = await Charger.findAll();

  return res.json(shared.makeResponse(chargers));
}));

// Add new charger
router.post('/', shared.asyncWrapper(async (req, res) => {

  const { Charger } = res.locals.models;

  const { id, chargerName } = req.body;

  if (!id)
    return res.json(shared.makeResponse({}, "Missing required id"));
  
  if (await Charger.findByPk(id))
    return res.json(shared.makeResponse({}, "Charger with given id already exists"));
  
  const charger = await Charger.create(req.body);

  return res.json(shared.makeResponse(charger));

}));


module.exports = router;
