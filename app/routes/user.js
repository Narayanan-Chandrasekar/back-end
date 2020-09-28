const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.

    
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/view/all api for viewing all users.
     *
     * @apiParam -
     * @apiParam -
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
          "error": false,
    "message": "All User Details Found",
    "status": 200,
    "data": 
        {
            "_id": "5f65bd710ae741243869e78a",
            "createdOn": "2020-09-19T08:12:33.000Z",
            "mobileNumber": 9492027055,
            "email": "narayanan.cs.31@gmail.com",
            "password": "$2a$10$EdljWrHy40.ttuYpsBMfceaTH0VMntTUz2DHG2aVs1pEFk6t5lo0q",
            "lastName": "Chandrasekar",
            "firstName": "Narayanan",
            "userId": "VGcL4hGaT"
        }
    
    */

    // params: email, password.
    app.get(`${baseUrl}/view/all`, userController.getAllUser);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:uId/allEventsOfAUser api for getting all events of a user.
     *
     * @apiParam {string} _id of the user. (body params) (required)
     * 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        "error": false,
    "message": "All Event Details Found",
    "status": 200,
    "data": 
        {
            "_id": "5f699c767e0c7c2858a098bc",
            "uId": "5f699b60331913256c4e17f4",
            "lastModified": "2020-09-22T06:40:54.671Z",
            "created": "2020-09-22T06:40:54.671Z",
            "end": "2020-09-22T09:30:00.000Z",
            "start": "2020-09-22T06:30:00.000Z",
            "location": "Gurgaon",
            "title": "third meeting",
            "eventId": "eLThoRXwt",
            "__v": 0
        }
    
    */

    // params: _id.
    app.get(`${baseUrl}/view/:uId/allEventsOfAUser`, userController.getAllEventsOfAUser);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/allEventsOfAllUsers api for getting all events of all users.
     
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         "error": false,
    "message": "All Event Details Found",
    "status": 200,
    "data": 
        {
            "_id": "5f6843c83b2b8309dc4a0165",
            "lastModified": "2020-09-21T06:10:16.714Z",
            "created": "2020-09-21T06:10:16.714Z",
            "end": "2020-09-21T06:30:00.000Z",
            "start": "2020-09-25T11:03:00.000Z",
            "location": "NewYork",
            "title": "new Meeting",
            "eventId": "Hwenpskg9,Hwenpskg9"
        }
    */

    // params: -.
    app.get(`${baseUrl}/view/allEventsOfAllUsers`, userController.getAllEventsOfAllUsers);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:eventId/getSingleEvent api for single event of a user.
     *
     * @apiParam {string} _id of the user. (body params) (required)
     
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         "error": false,
    "message": "All Event Details Found",
    "status": 200,
    "data":
        {
            "_id": "5f6843c83b2b8309dc4a0165",
            "lastModified": "2020-09-21T06:10:16.714Z",
            "created": "2020-09-21T06:10:16.714Z",
            "end": "2020-09-21T06:30:00.000Z",
            "start": "2020-09-25T11:03:00.000Z",
            "location": "NewYork",
            "title": "new Meeting",
            "eventId": "Hwenpskg9,Hwenpskg9"
        }
    */

    // params: eventId
    app.get(`${baseUrl}/view/:eventId/getSingleEvent`, userController.getSingleEvent);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/_id/createEvent api for event creation.
     *
     * @apiParam {string} _id of the user. (body params) (required)
     
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Event added to user successfully",
    "status": 200,
    "data": {
        "__v": 0,
        "uId": "5f699b60331913256c4e17f4",
        "_id": "5f70b1ffa2b6b0191887c8dc",
        "lastModified": "2020-09-27T15:38:39.040Z",
        "created": "2020-09-27T15:38:39.040Z",
        "end": "2020-09-23T11:03:00.000Z",
        "start": "2020-09-23T10:03:00.000Z",
        "location": "Gurgaon",
        "title": "second meeting",
        "eventId": "ZriLRPGsm"
             }
         }
    */

    // params: email, password.
    app.post(`${baseUrl}/:_id/createEvent`, userController.createEvent);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/:eventId/editEvent api for event edit.
     *
     * @apiParam {string} eventId of the event. (params) (required)
     
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Event Edited Successfully.",
    "status": 200,
    "data": {
        "n": 0,
        "nModified": 0,
        "ok": 1
          }
        }
    */

    // params: eventId.
    app.put(`${baseUrl}/:eventId/editEvent`, userController.editEvent);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/:eventId/deleteEvent api for event deletion.
     *
     * @apiParam {string} eventId of the event. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Event Deleted Successfully.",
    "status": 200,
    "data": {
        "n": 0,
        "nModified": 0,
        "ok": 1
          }
        }
    */

    // params: eventId.
    app.post(`${baseUrl}/:eventId/deleteEvent`, userController.deleteEvent);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/view/logout api for user logout.
     *
     * @apiParam {string} _id of the user. (params) (required)
     
     *
     * @apiSuccess 
     * 
     * @apiSuccessExample {} Success-Response:
         
    */

    // params: email, password.
    app.post(`${baseUrl}/view/logout`, userController.logout);
/**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} email email of the user. (body) (required)
     * @apiParam {string} firstname firstname of the user. (body) (required)
     * @apiParam {string} lastname lastname of the user. (body) (required)
     * @apiParam {string} username username of the user. (body) (required)
     * @apiParam {string} password password of the user. (body) (required)
     * @apiParam {string} mobileNumber mobileNumber of the user. (body) (required)
    
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "User created",
    "status": 200,
    "data": {
        "__v": 0,
        "_id": "5f70b449a2b6b0191887c8dd",
        "createdOn": "2020-09-27T15:48:25.000Z",
        "events": [],
        "mobileNumber": 9492027055,
        "email": "narayanan.cs.23@gmail.com",
        "userName": "nari",
        "lastName": "CS",
        "firstName": "Nari",
        "userId": "8b8cf0ucy"
        }
    }
    */

    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Login Successful",
    "status": 200,
    "data": {
        "_id": "5f65bd710ae741243869e78a",
        "events": [],
        "mobileNumber": 9492027055,
        "email": "narayanan.cs.31@gmail.com",
        "userName": "",
        "lastName": "Chandrasekar",
        "firstName": "Narayanan",
        "userId": "VGcL4hGaT"
        }
    }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
    */

    // auth token params: userId.
    app.post(`${baseUrl}/logout`, userController.logout);

}
