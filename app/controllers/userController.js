const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib.js')
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib');
const { convertToLocalTime } = require('./../libs/timeLib');
const AuthModel = mongoose.model('Auth')

/* Models */
const UserModel = mongoose.model('User')
const EventModel = mongoose.model('Event')

/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                }else if (check.isEmpty(req.body.userName)) {
                    let apiResponse = response.generate(true, '"UserName" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            userName: req.body.userName,
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })


}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    //delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

 /*   let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
   */

    findUser(req,res)
        .then(validatePassword)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })

}


// end of the login function 


let logout = (req, res) => {
    
} // end of the logout function.

/**
 * function to read all events of a user.
 */
let getAllEventsOfAUser = (req, res) => {
    if (check.isEmpty(req.params.uId)) {

        console.log('UserId should be passed')
        let apiResponse = response.generate(true, 'userId is missing', 403, null)
        res.send(apiResponse)
    } else {
    EventModel.find({uId:req.params.uId})
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllEventsOfAUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Event Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Event Found', 'User Controller: getAllEvents')
                let apiResponse = response.generate(true, 'No Event Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Event Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}
}// end get all Events

/**
 * function to read single blog.
 */
let viewByBlogId = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Blog Not Found.')
                let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Blog found successfully","BlogController:ViewBlogById",5)
                let apiResponse = response.generate(false, 'Blog Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

/**
 * function to read blogs by category.
 */
let viewByCategory = (req, res) => {

    if (check.isEmpty(req.params.categoryId)) {

        console.log('categoryId should be passed')
        let apiResponse = response.generate(true, 'CategoryId is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.find({ 'category': req.params.category }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Blogs Not Found.')
                let apiResponse = response.generate(true, 'Blogs Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Blogs Found Successfully')
                let apiResponse = response.generate(false, 'Blogs Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

/**
 * function to read blogs by author.
 */
let viewByAuthor = (req, res) => {

    if (check.isEmpty(req.params.author)) {

        console.log('author should be passed')
        let apiResponse = response.generate(true, 'author is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.find({ 'author': req.params.author }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Blogs Not Found.')
                let apiResponse = response.generate(true, 'Blogs Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Blogs Found Successfully')
                let apiResponse = response.generate(false, 'Blogs Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

/**
 * function to edit blog by admin.
 */
let editEvent = (req, res) => {

    if (check.isEmpty(req.params.eventId)) {

        console.log('eventId should be passed')
        let apiResponse = response.generate(true, 'eventId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        console.log(options);
        EventModel.update({ 'eventId': req.params.eventId }, options, { multi: true }).exec((err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Event Not Found.')
                let apiResponse = response.generate(true, 'Event Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Event Edited Successfully')
                
                let apiResponse = response.generate(false, 'Event Edited Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

/**
 * function to find the assignment.
 */
let findBlogToEdit = (blogId) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        reject(apiResponse)
    } else {
        return new Promise((resolve, reject) => {
            BlogModel.findOne({ 'blogId': req.params.blogId }, (err, blog) => {
                if (err) {
                    console.log('Error Occured.')
                    logger.error(`Error Occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(blog)) {
                    console.log('Blog Not Found.')
                    let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
                    reject(apiResponse)
                } else {
                    console.log('Blog Found.')
                    resolve(blog)
                }
            })
        })
    }
}

/**
 * function to delete the assignment collection.
 */
let deleteEvent = (req, res) => {

    if (check.isEmpty(req.params.eventId)) {

        console.log('eventId should be passed')
        let apiResponse = response.generate(true, 'eventId is missing', 403, null)
        res.send(apiResponse)
    } else {

        EventModel.remove({ 'eventId': req.params.eventId }, (err, result) => {
            if (err) {
                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                console.log('Event Not Found.')
                let apiResponse = response.generate(true, 'Event Not Found.', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Event Deletion Success')
                let apiResponse = response.generate(false, 'Event Deleted Successfully', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

let getAllEventsOfAllUsers = (req, res) => {
    EventModel.find()
        .select(' -__v')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllEvents', 10)
                let apiResponse = response.generate(true, 'Failed To Find Event Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Event Found', 'User Controller: getAllEvents')
                let apiResponse = response.generate(true, 'No Event Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Event Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users


/**
 * function to create the blog.
 */
let createEvent = (req, res) => {
    let eventCreationFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.params._id) || check.isEmpty(req.body.start) || check.isEmpty(req.body.end) || check.isEmpty(req.body.location) || check.isEmpty(req.body.title)) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let eventId = shortid.generate()

                let newEvent = new EventModel({

                    eventId: eventId,
                    uId: req.params._id,
                    title: req.body.title,
                    location: req.body.location,
                    start: req.body.start,
                    end: req.body.end,
                    created: today,
                    lastModified: today
                }) // end new blog model
                console.log(newEvent.start); 
                console.log(newEvent.end);       
                newEvent.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in event creation')
                        //result.userId = req.params.userId
                        resolve(result)
                    }
                }) // end new blog save
            }
        }) // end new blog promise
    } // end create blog function

    /*let updateUserWithEvent = (event) => {
        return new Promise((resolve, reject) => { 
        if (check.isEmpty(event.userId)) {
    
            console.log('userId is empty')
            let apiResponse = response.generate(true, 'userId is missing', 403, null)
            reject(apiResponse)
        } else {
            var today = Date.now()

             let currentEvent = new EventModel({
                                 _id: event._id,   
                                 eventId: event.eventId,
                                 title: event.title,
                                 start: event.start,
                                 end: event.end,
                                 location: event.location,
                                 created: today,
                                 lastModified: today
                             }) 
            console.log(currentEvent);                    
            UserModel.findOne({userId:event.userId}).
             exec((err, result) => {
    
                if (err) {
    
                    console.log('Error Occured.')
                    logger.error(`Error Occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
    
                    console.log('User Not Found.')
                    let apiResponse = response.generate(true, 'User Not Found', 404, null)
                    reject(apiResponse)
                } else {
                    console.log(result);
                    result.events.push(currentEvent);
                    result.save().exec((err, result)=>{
                        if(err)
                        {
                            console.log('Error Occured.')
                            logger.error(`Error Occured : ${err}`, 'Database', 10)
                            let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                            reject(apiResponse)
                        } else if(result)
                        {
                            console.log('User Edited Successfully')
                            let apiResponse = response.generate(false, 'User Edited Successfully.', 200, result)
                            resolve(result)
                        }
                    });    
                     
                }
            })
        }
    })
    }

*/
    // making promise call.
    eventCreationFunction(req,res)
            .then((resolve) => {
            console.log("Here");
            let apiResponse = response.generate(false, 'Event added to user successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}

let getSingleEvent = (req, res) => {
    if (check.isEmpty(req.params.eventId)) {
    
        console.log('Meeting Id should be passed')
        let apiResponse = response.generate(true, 'parameters are missing', 403, null)
        res.send(apiResponse)
    } else {
    EventModel.find({eventId: req.params.eventId})
        .select('-_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleEvent', 10)
                let apiResponse = response.generate(true, 'Failed To Find Event Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Event Found', 'User Controller: getAllEvent')
                let apiResponse = response.generate(true, 'No Event Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Event Details Found', 200, result)
                res.send(apiResponse)
            }
        })
    }
}// end get event

let alertUser = (meetingData, cb) => {
    // verify a token symmetric
   cb(null,meetingData);    
};
  
  
// end alert User
  
/**
 * function to increase views of a blog.
 */
let increaseBlogView = (req, res) => {
    
        if (check.isEmpty(req.params.blogId)) {
    
            console.log('blogId should be passed')
            let apiResponse = response.generate(true, 'blogId is missing', 403, null)
            res.send(apiResponse)
        } else {
    
            BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {
    
                if (err) {
    
                    console.log('Error Occured.')
                    logger.error(`Error Occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
    
                    console.log('Blog Not Found.')
                    let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
                    res.send(apiResponse)
                } else {
                    result.views += 1;
                    result.save(function(err,result){
                        if(err){
                            console.log('Error Occured.')
                            logger.error(`Error Occured : ${err}`, 'Database', 10)
                            let apiResponse = response.generate(true, 'Error Occured While saving blog', 500, null)
                            res.send(apiResponse)
                        }
                        else{
                            console.log('Blog Updated Successfully')
                            let apiResponse = response.generate(false, 'Blog Updated Successfully.', 200, result)
                            res.send(apiResponse)
                        }
                    });// end result
                    
                }
            })
        }
    }

module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    getAllEventsOfAUser: getAllEventsOfAUser,
    getAllEventsOfAllUsers:getAllEventsOfAllUsers,
    getSingleEvent: getSingleEvent,
    createEvent: createEvent,
    editEvent: editEvent,
    deleteEvent: deleteEvent,
    alertUser: alertUser,
    loginFunction: loginFunction,
    logout: logout

}// end exports