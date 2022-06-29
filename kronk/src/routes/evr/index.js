const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');


//TODO: Move anything that is using two queries to a single query using the include keyword
/**
 * Chargepoint Section
 * 
 */


/**
 * Returns the chargepoint's last status.
 */
router.get('/chargepoint/:id/lastStatus', shared.asyncWrapper(async (req, res) => {
    const id = req.params.id;

    const { Chargepoint, ChargepointEntry } = res.locals.models;

    const charger = await Chargepoint.findOne({
        where: {
            id: id
        }
    });

    if (!charger) {
        throw new InvalidRequestError(`Charger with id: ${id} does not exist`)
    }


    const lastStatus = await ChargepointEntry.findOne({
        where: {
            ChargepointId: id
        },
        order: [['timestamp', 'DESC']],
    });

    if (!lastStatus) {
        throw new InvalidRequestError("No status has been found for this charger");
    }

    return res.json(shared.makeResponse(lastStatus));
}));

/**
 * Returns all the chargepoint's statuses.
 */
router.get('/chargepoint/:id', shared.asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const { Chargepoint, ChargepointEntry } = res.locals.models;


    const entries = await Chargepoint.findAll({
        where: {
            id: id
        },
        include: [{
            model: ChargepointEntry,
            order: [['timestamp', 'DESC']],
            limit: req.query.limit
        }]
    });
    
    

    if (!entries) {
        throw new InvalidRequestError(`Charger with id: ${id} does not exist`)
    }

    return res.json(shared.makeResponse(entries));
}));

/**
 * Exposes endpoint to which to post the chargepoint's status
 */
router.post('/chargepoint/:id', shared.asyncWrapper(async (req, res) => {
    const id = req.params.id;

    const { Chargepoint, ChargepointEntry } = res.locals.models;
    
    const charger = await Chargepoint.findOne({
        where: {
            id: id
        }
    });

    if (!charger) {
        throw new InvalidRequestError(`Charger with id: ${id} does not exist`)
    }

    const entry = await ChargepointEntry.findOrCreate({
        where: {
            ...req.body, 
            ChargepointId: id
        },
    })

    if (!entry) {
        throw new InvalidRequestError("Could not create new chargepoint entry");
    }

    return res.json(shared.makeResponse(entry));
}));

/**
 * Returns most recent status for all chargepoint chargers
 */
router.get('/chargepoint', shared.asyncWrapper(async (req, res) => {
    const { Chargepoint, ChargepointEntry } = res.locals.models;

    const chargers = await Chargepoint.findAll({
        include: [{
            model: ChargepointEntry,
            order: [['timestamp', 'DESC']],
            limit: 1,
        }]
    });

    if (chargers.length === 0) {
        throw new InvalidRequestError("No chargepoint chargers found");
    }

    return res.json(shared.makeResponse(chargers));
}));


/**
 * Exposes endpoint to which to create a new chargepoint charger.
 */
router.post('/chargepoint', shared.asyncWrapper(async (req, res) => {
    
    const { Chargepoint } = res.locals.models;

    const charger = await Chargepoint.findOrCreate({
        where: {
            id: req.body.id,
        }
    });


    if (!charger) {
        throw new InvalidRequestError("Could not create new charger")
    }
    return res.json(shared.makeResponse(charger));
}));


/**
 * Leviton Section
 * 
 */


/**
 * Returns back the current draw on the leviton device. For the evr, the :id is evr
 * i.e. /leviton/evr/current
 */
router.get('/leviton/:id/current', shared.asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const { LevitonMeter, LevitonEntry } = res.locals.models;

    const meter = await LevitonMeter.findOne({
        where: {
            id: id,
        }
    });
    if (!meter) {
        throw new InvalidRequestError("No Leviton Meter with that id was found");
    }

    const recentPowerConsumed = await LevitonEntry.findOne({
        where: {
            LevitonMeterId: id,
        },
        order: [['timestamp', 'DESC']],
    })    

    if (!recentPowerConsumed) {
        throw new InvalidRequestError("No power draw has been found");
    }

    return res.json(shared.makeResponse(recentPowerConsumed));
}));


/**
 * Returns back the past x draw values on the leviton deviceFor the evr, the :id is evr
 * i.e. /leviton/evr
 */
 router.get('/leviton/:id', shared.asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const { LevitonMeter, LevitonEntry } = res.locals.models;

    const meter = await LevitonMeter.findOne({
        where: {
            id: id,
        }
    });
    if (!meter) {
        throw new InvalidRequestError("No Leviton Meter with that id was found");
    }

    let recentPowerConsumed;
    if (req.query.limit){
        recentPowerConsumed = await LevitonEntry.findAll({
            where: {
                LevitonMeterId: id,
            },
            order: [['timestamp', 'DESC']],
            limit: req.query.limit,
        })
    }
    else{
        recentPowerConsumed = await LevitonEntry.findAll({
            where: {
                LevitonMeterId: id,
            },
            order: [['timestamp', 'DESC']],
        })
    } 

    if (!recentPowerConsumed) {
        throw new InvalidRequestError("No power draw has been found");
    }

    return res.json(shared.makeResponse(recentPowerConsumed));
}));



/**
 * Exposes POST endpoint to record new power draw entry. For the evr, the :id is evr
 * i.e. /leviton/evr
 */
 router.post('/leviton/:id', shared.asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const { LevitonMeter, LevitonEntry } = res.locals.models;

    const meter = await LevitonMeter.findOne({
        where: {
            id: id,
        }
    });
    if (!meter) {
        throw new InvalidRequestError("No Leviton Meter with that id was found");
    }

    const recentPowerConsumed = await LevitonEntry.findOrCreate({
        where: {
            ...req.body,
            LevitonMeterId: id,
        },
        order: [['timestamp', 'DESC']],
    })    

    if (!recentPowerConsumed) {
        throw new InvalidRequestError("No power draw has been found");
    }

    return res.json(shared.makeResponse(recentPowerConsumed));
}));


/**
 * Exposes POST endpoint to record new power draw entry
 */
 router.post('/leviton', shared.asyncWrapper(async (req, res) => {
    const { LevitonMeter } = res.locals.models;

    const meter = await LevitonMeter.findOrCreate({
        where: {
            id: req.body.id,
        }
    });
    if (!meter) {
        throw new InvalidRequestError("No Leviton Meter with that id was found");
    }

    return res.json(shared.makeResponse(meter));
}));












module.exports = router;
