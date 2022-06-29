const router = require('express').Router();
const  Sequelize = require('sequelize');
const { Op } = require('sequelize');
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const moment = require('moment');


//TODO: Move anything that is using two queries to a single query using the include keyword


/**
 * Allows to get every route that the bus has gone on and its parameters during the route.
 */
router.get('/:id/route/all', shared.asyncWrapper(async (req, res) => {
    const busId = req.params.id;

    const { RouteEntry } = res.locals.models;
    
    let routes = null;
    if (req.query.limit){
        routes = await RouteEntry.findAll({
            where: {
                BusId: busId
            },
            order: [['gpsFixTime', 'DESC']],
            limit: req.query.limit,
        });
    }
    else {
        routes = await RouteEntry.findAll({
            where: {
                BusId: busId,
            },
            order: [['gpsFixTime', 'DESC']],
        });
    }



    if (!routes) {
        return res.json(shared.makeResponse({info: "No past routes found"}));
    }

    return res.json(shared.makeResponse(routes));
}));


/**
 * Returns non-repeated GPS times
 * params: limit
 */
router.get('/:id/route/useful', shared.asyncWrapper(async (req, res) => {
    const busId = req.params.id;
    const limit = req.query.limit;
    const { RouteEntry } = res.locals.models;

    const days = req.query.days;

    const includedFields = Object.keys(RouteEntry.rawAttributes).filter(field => field !== 'gpsFixTime' 
    && field !== 'id' 
    && field !== 'time' 
    && field !== 'createdAt'
    && field !== 'updatedAt');


    let routes = null;
    routes = await RouteEntry.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('gpsFixTime')), 'gpsFixTime'],
            ...includedFields
        ],
        where: {
            BusId: busId,
            gpsFixTime: {
                [Op.gte]: moment().subtract(days ?? 0, 'days').toDate()
            },
        },
        group: ['gpsFixTime', ...includedFields],
        order: [['gpsFixTime', 'DESC']],
        limit: limit
    });
    if (!routes) {
        return res.json(shared.makeResponse({info: "No past routes found"}));
    }

    return res.json(shared.makeResponse(routes));
}));



/**
 * Gets the most recent update for the bus, this should reflaect its actual SOC most accurately
 */
router.get('/:id', shared.asyncWrapper(async (req, res) => {
    const busId = req.params.id;

    const { Bus, RouteEntry } = res.locals.models;

    const bus = await Bus.findOne({
        where: {
            id: busId,
        },
        
    });


    const lastRoute = await RouteEntry.findOne({
        where: {
            BusId: busId
        },
        order: [['gpsFixTime', 'DESC']],
    });



    if (!bus) {
        return res.json(shared.makeResponse({info: "No bus found with this id"}));
    }

    if (!lastRoute) {
        return res.json(shared.makeResponse(bus))
    }

    return res.json(shared.makeResponse({lastRoute}))
}));

/**
 * URL to add a new bus to the database.
 */
router.post('/add', shared.asyncWrapper(async (req, res) => {
    const id = req.body.id;

    const { Bus } = res.locals.models;

    const bus = await Bus.findOrCreate({
        where: {
            id: id,
        },
    });

    if (!bus) {
        return res.json(shared.makeResponse({info: "An error has occurred while trying to create the bus"}));
    }

    return res.json(shared.makeResponse(bus));

}));

/**
 * URL to add a new route entry to the bus
 */
router.post('/:id/route/add', shared.asyncWrapper(async (req, res) => {
    const busId = req.params.id;
    const { RouteEntry } = res.locals.models;

    const requiredParams = ['isActive', 'soc', 'wheelBasedVehicleSpeed', 'engineSpeed', 'totalVehicleDistance', 'instantaneousPower', 'tripRegenPower', 'tripMotorEnergyConsumption', 'averagePowerKw', 'timeToEmpty', 'milesToEmpty', 'averageSpeed', 'chargingEnergyTransferKwh', 'dcEnergyConsumptionKwh', 'auxInverterEnergyConsumptionKwh', 'electricHeaderEnergyConsumptionKwh', 'sysInstantaneousEnergyKwh', 'sysSoc', 'time'];
    const missingParams = requiredParams.filter(param => !req.body[param] && !req.body.bus[param]);

    if (missingParams.length > 0) {
        throw new InvalidRequestError(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    let exists = null;
    if (!req.body.bus.gpsFixTime)
    {
        exists = await RouteEntry.findOne({
            where: {
                time: req.body.time
            }
        });
    } else {
        exists = await RouteEntry.findOne({
            where: {
                time: req.body.bus.gpsFixTime
            }
        });
    }

    const cleanedBus = req.body.bus;

    delete cleanedBus['id']

    if (!exists) {
       const routeEntry = await RouteEntry.create({...cleanedBus, ...req.body, BusId: busId});

       if (routeEntry) {
            return res.json(shared.makeResponse(routeEntry));
       }
       else {
            throw new InvalidRequestError("Route entry creation failed");
       }
    }


    return res.json(shared.makeResponse(exists));
}));

/**
 * Returns all registered buses
 */
router.get('/', shared.asyncWrapper(async (req, res) => {
    const { Bus } = res.locals.models;

    const buses = await Bus.findAll();

    if (!buses) {
        throw new InvalidRequestError("No buses found");
    }

    return res.json(shared.makeResponse(buses));

}));



module.exports = router;


