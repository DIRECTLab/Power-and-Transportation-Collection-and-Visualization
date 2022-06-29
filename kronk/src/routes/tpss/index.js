const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');

/**
 * Returns the last entry of TPSS data
 */
router.get('/lastEntry',  shared.asyncWrapper(async (req, res) => {
    const { Timestamp, DigitalEntry, AnalogEntry } = res.locals.models;

    const timestamp = await Timestamp.findOne({
        order: [['time', 'DESC']],
    })

    if (!timestamp) {
        throw new InvalidRequestError("No status has been found for this charger");
    }

    const lastDigitalValue = await DigitalEntry.findOne({
        where: {
            TimestampId: timestamp.time
        },
    });

    const lastAnalogValue = await AnalogEntry.findOne({
        where: {
            TimestampId: timestamp.time
        },
    });

    if (!lastAnalogValue && !lastDigitalValue) {
        throw new InvalidRequestError("No digital or analog values have been found for this charger");
    }

    return res.json(shared.makeResponse({...timestamp, ...lastDigitalValue, ...lastAnalogValue}));
}));

/**
 * Returns all the entries of TPSS data
 * Optional query parameters: limit
 * limit = number of entries to return
 */
router.get('/',  shared.asyncWrapper(async (req, res) => {
    const { Timestamp, DigitalEntry, AnalogEntry } = res.locals.models;

    let timestamps = null;

    if (req.query.limit){
        timestamps = await Timestamp.findAll({
            order: [['time', 'DESC']],
            limit: req.query.limit,
            include: [
                {
                    model: DigitalEntry,
                    required: false,
                },
                {
                    model: AnalogEntry,
                    required: false,
                },
            ],
        })
    } else {
        timestamps = await Timestamp.findAll({
            order: [['time', 'DESC']],
            include: [
                {
                    model: DigitalEntry,
                    required: false,
                },
                {
                    model: AnalogEntry,
                    required: false,
                },
            ],
        });
    }

    return res.json(shared.makeResponse(timestamps));

}));




module.exports = router;