const router = require('express').Router();
const shared = require('../../shared');

// Get a location by id
router.get('/:locationId', shared.asyncWrapper(async (req, res) => {
  const { Charger, Location } = res.locals.models;
  const location = await Location.findByPk(req.params.locationId, {
    include: [Charger]
  });
  return res.json(shared.makeResponse(location));
}));

// Get all locations
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Location, Charger } = res.locals.models;
  const locations = await Location.findAll({
    include: [Charger]
  });
  return res.json(shared.makeResponse(locations));
}));

// Create new location
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Location } = res.locals.models;
  if (await Location.findOne({ where: { name: req.body.name }}) !== null)
    return res.json(shared.makeResponse({}, 'Location already exists'));
  const location = await Location.create(req.body);
  return res.json(shared.makeResponse(location));
}));

// Patch location
router.patch('/:locationId', shared.asyncWrapper(async (req, res) => {
  const { Location } = res.locals.models;
  const location = await Location.update(req.body, {
    where: {
      id: req.params.locationId
    }
  });
  return res.json(shared.makeResponse(location));
}));


module.exports = router;