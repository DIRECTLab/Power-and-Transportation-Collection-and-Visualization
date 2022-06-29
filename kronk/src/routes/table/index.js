const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const moment = require('moment');
const { Op } = require('sequelize');

/**
 * Supported request parameters
 * ------------------------------
 * startDate (optional, default=now)
 * endDate (optional, default=null. If null, days will be used. If not null, endDate will be used instead of days)
 * days (optional, integer, default=5)
 * includeEVR (bool, default false)
 * limit (integer, default=null)
 */
router.get('/', shared.asyncWrapper(async (req, res) => {
    const { RouteEntry, LevitonEntry, ChargerStatus, MeterValue, Timestamp, AnalogEntry, DigitalEntry, ChargingProfile, ChargepointEntry  } = res.locals.models;


    let startDate = null;
    let endDate = null;
    let days = 5;
    let includeEVR = false;
    let limit = null;

    let TPSS = null;
    let NewFlyer = null;
    let ocppChargerStatus = null;
    let ocppChargingProfile = null;
    let ocppMeterValue = null;
    let evrChargepoint = null;
    let evrLeviton = null;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
        endDate = new Date(req.query.endDate);
        
        if (!startDate) {
            throw new InvalidRequestError("startDate is required if endDate is specified");
        }
    }
    if (req.query.days) {
        days = req.query.days;
    }
    if (req.query.includeEVR) {
        includeEVR = req.query.includeEVR;
    }
    if (req.query.limit) {
        limit = req.query.limit;
    }

    

    TPSS = await Timestamp.findAll({
        where: {
            time: {
                [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                [Op.lt]: endDate ??  moment().toDate(),
            }
        },
        limit: limit,
        order: [['time', 'DESC']],
        include: {
            model: DigitalEntry,
        },
        include: {
            model: AnalogEntry,
        }
    });

    NewFlyer = await RouteEntry.findAll({
        where: {
            gpsFixTime: {
                [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                [Op.lt]: endDate ?? moment().toDate(),
            }
        },
        limit: limit,
        order: [['gpsFixTime', 'DESC']],
    });

    if (includeEVR) {
        evrChargepoint = await ChargepointEntry.findAll({
            where: {
                timestamp: {
                    [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                    [Op.lt]: endDate ?? moment().toDate(),
                }
            },
            limit: limit,
            order: [['timestamp', 'DESC']],
        });

        evrLeviton = await LevitonEntry.findAll({
            where: {
                timestamp: {
                    [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                    [Op.lt]: endDate ?? moment().toDate(),
                }
            },
            limit: limit,
            order: [['timestamp', 'DESC']],
        });
    }

    ocppChargerStatus = await ChargerStatus.findAll({
        where: {
            statusTime: {
                [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                [Op.lt]: endDate ?? moment().toDate(),
            }
        },
        limit: limit,
        order: [['statusTime', 'DESC']],
    });

    ocppChargingProfile = await ChargingProfile.findAll({
        where: {
            createdAt: {
                [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                [Op.lt]: endDate ?? moment().toDate(),
            }
        },
        limit: limit,
        order: [['createdAt', 'DESC']],
    });

    ocppMeterValue = await MeterValue.findAll({
        where: {
            timestamp: {
                [Op.gte]: startDate ?? moment().subtract(days, 'days').toDate(),
                [Op.lt]: endDate ?? moment().toDate(),
            }
        },
        limit: limit,
        order: [['timestamp', 'DESC']],
    });



    return res.json({TPSS, NewFlyer, ocppChargerStatus, ocppChargingProfile, ocppMeterValue, evrChargepoint, evrLeviton});
}));





module.exports = router;