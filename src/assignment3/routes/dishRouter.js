var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Dishes = require('../models/dishes');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get(Verify.verifyOrdinaryUser, getDishes)
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, createDish)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, deleteDishes);

dishRouter.route('/:dishId')
    .get(Verify.verifyOrdinaryUser, getDish)
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, updateDish)
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, deleteDish);

function getDishes(req, res, next) {
    Dishes.find({}, function (err, dish) {
        if (err) {
            return next(err);
        }
        res.json(dish);
    });
}

function createDish(req, res, next) {
    Dishes.create(req.body, function (err, dish) {
        if (err) {
            return next(err);
        }
        console.log('Dish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
}

function deleteDishes(req, res, next) {
    Dishes.remove({}, function (err, resp) {
        if (err) {
            return next(err);
        }
        res.json(resp);
    });
}

function getDish(req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) {
            return next(err);
        }
        res.json(dish);
    });
}

function updateDish(req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }, function (err, dish) {
        if (err) {
            return next(err);
        }
        res.json(dish);
    });
}

function deleteDish(req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
        if (err) {
            return next(err);
        }
        res.json(resp);
    });
}

module.exports = dishRouter;