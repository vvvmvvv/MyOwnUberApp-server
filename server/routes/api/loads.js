const router = require('express').Router();
const verify = require('../middleware/verify');
const Load = require("../../models/Load");
const Truck = require("../../models/Truck");
const User = require("../../models/User");

const loadStates = [
    "En route to Pick Up",
    "Arrived to Pick Up",
    "En route to delivery",
    "Arrived to delivery"
];

router.get('/', verify, async (req, res) => {

    try {
        const user = await User.findById(req.user.id);
        
        if(user.role.toLowerCase() === "shipper"){
            const loadsShipper = await Load.find({
                created_by: req.user.id
            });
            if(!loadsShipper){
                return res.json({status: "Now you not have a created loads"});
            }
            return res.json({status: "Success", loadsShipper});
        }

        if(user.role.toLowerCase() === "driver"){
            const loadsDriver = await Load.find({
                assigned_to: req.user.id,
                status: "ASSIGNED"
            });
            if(!loadsDriver.length){
                return res.json({status:"Now you not assigned for any loads!"});
            }
            return res.json({status: "Success",loadsDriver })
        }

        res.json({status: "Undefined user role"});
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.post('/', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(user);
        if(user.role.toLowerCase() !== "shipper"){
            return res.status(400).send("THIS FUNCTIONALITY ONLY FOR SHIPPER!");
        }
        const load = new Load({
            title: req.body.title,
            dimensions: req.body.dimensions,
            payload: req.body.payload,
            created_by: req.user.id
        });

        await load.save();
        res.json({status: "Load created successfully"});
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.get('/:loadId', verify, async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId);
        res.json(load);
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.delete("/:loadId",verify, async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId);
        if(load.status.toUpperCase() === 'NEW'){
            const removedLoad = await Load.findByIdAndRemove(req.params.loadId);
            res.json(removedLoad);
        } else {
            return res.status(400).send("LOAD WITH STATUS -NEW- NOT FOUND!");
        }
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.put("/:loadId",verify, async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId);
        if(load.status.toUpperCase() === 'NEW'){
            const updatedLoad = await Load.findByIdAndUpdate(req.params.loadId, req.body);
            res.json(updatedLoad);
        } else {
            return res.status(400).send("LOAD WITH STATUS -NEW- NOT FOUND!");
        }

    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

const notNormalTruck = "No trucks found, maybe your load is very big for our trucks";
function getTruckType({width, height, length}, payload) {
    console.log(width, height, length, payload);

    if (payload <= 1700 && width <= 300 && length <= 250 && height <= 170) {
        return "SPRINTER";
    }

    if (payload <= 2500 && width <= 500 && length <= 250 && height <= 170) {
        return "SMALL STRAIGHT";
    }

    if (payload <= 4000 && width <= 700 && length <= 350 && height <= 200) {
        return "LARGE STRAIGHT";
    }

    return notNormalTruck;
}

router.patch("/:loadId/state", verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const {loadId} = req.params;

        if(user.role.toLowerCase() === "shipper"){
            return res.status(400).send("State can change only drivers!");
        }

        if(user.role.toLowerCase() === "driver"){
            const load = await Load.findById(loadId);
            if(!load){
                return res.json({status:"Now you not assigned to any load"});
            }

            if(load.assigned_to.equals(user._id)) {
                const currentStateIndex = loadStates.indexOf(load.state);
                if (currentStateIndex >= loadStates.length - 1) {
                    return res.json({status: "You cannot chage state anymore"});
                }
                await Load.findByIdAndUpdate(loadId, {
                    state: loadStates[currentStateIndex + 1]
                });
                return res.json({status: "Load status changed successfully"});
            }

            return res.json({status:"You have not access to this load"});
        }
        res.json({status: "Undefined user role"});
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.patch("/:loadId/post", verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(user.role.toLowerCase() !== "shipper"){
            return res.status(400).send("THIS FUNCTIONALITY ONLY FOR SHIPPER!");
        }
        const load = await Load.findOne({
            _id: req.params.loadId,
            status: "NEW"
        }); 
        if (!load) return res.status(404).json({message: "Load not found"});
        const truckType = getTruckType(load.dimensions, load.payload);

        console.log(truckType);

        if(truckType === notNormalTruck){
            return res.json({status: "No trucks found"});
        }
    
        const readyTruck = await Truck.findOne({
            status: "IS",
            type: truckType
        });

        console.log(readyTruck);

        if(!readyTruck){
            return res.json({status: "No trucks found"});
        }

        await Load.findByIdAndUpdate(req.params.loadId, {
            $set: {
                status: "POSTED"
            }
        },{new: true});

        res.json({status: "Load posted successfully", assigned_to: readyTruck.created_by});
    } catch (err) {
        res.json({
            message: err.message
        });
    }
})

router.patch("/:loadId/assign", verify, async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId);
        if (load.status.toUpperCase() === 'POSTED') {
            const truckType = getTruckType(load.dimensions, load.payload);
            const readyTruck = await Truck.findOne({
                status: "IS",
                type: truckType
            });
            const readyDriver = readyTruck.created_by;
            if (readyTruck) {
                await Load.findByIdAndUpdate(req.params.loadId, {
                    $set: {
                        status: "ASSIGNED",
                        state: "An route to Pick Up",
                        assigned_to: readyDriver
                    }
                });
                const assignedTruck = await Truck.findByIdAndUpdate(readyTruck._id, {
                    $set: {
                        status: 'OL',
                    }
                }, {new: true});
                res.json(assignedTruck);
            } else {
                return res.status(400).send("TRUCK WITH STATUS -IS- NOT FOUND!");
            }
        } else {
            return res.status(400).send("THE LOAD IN PROCCES!PLS, TRY TO ASSIGN ANOTHER LOAD");
        }
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

router.put("/:loadId/shipped", verify, async (req, res) => {
    try {
        const load = await Load.findOne({_id: req.params.loadId, state: "Arrived to delivery"});
        if(!load) return res.status(400).send("LOAD NOT FOUND!");
            const shippedLoad = await Load.findByIdAndUpdate(req.params.loadId,{
                $set: {
                    status: "SHIPPED"
                }
            }, {new: true});
        await Truck.findByIdAndUpdate(load.assigned_to, {
            $set: {
                status: "IS"
            }
        }, {new: true});
            res.json(shippedLoad);
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});



module.exports = router;