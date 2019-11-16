1> Why use dotenv libraru=y ?

https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

2> Error handler middle wares :

https://expressjs.com/en/guide/error-handling.html

Search for :
The default error handler
Writing error handlers

3> Application level error handlers :

https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947

- How this works ?

When there is an error thrown (new BootcampNotFoundError() / next(err)), control will be passed to error middleware's configured at app level (in server.js). Think of this as control flowing down the stack :

app.use(logError);
app.use(errorHandler);

When control reaches : logError, that function is executed - just logging functionality.
When control reaches : errorHandler, that function is executed - res.status(...).json(), error is sent back through response.

- How to identify which error is for what ?

logError ->

console.log(`Log error middleware`.red.bold);

console.log(`Error name : ${err.name}`.red.bold);
console.log(`Error value : ${err.value}`.red.bold);
console.log(err);

When you log this entire 'err' object, you can find few properties like :

a> When \_id is expected but a normal number is sent

err{
message: 'Cast to ObjectId failed for value "123" at path "\_id" for model "Bootcamp"',
name: 'CastError',
stringValue: '"123"',
kind: 'ObjectId',
value: '123',
path: '\_id',
reason: undefined
}

b> When duplicate field is sent as part of POST request when unique validator is set for a field in Mongoose model.

err{
driver: true,
name: 'MongoError',
index: 0,
code: 11000,
keyPattern: { name: 1 },
keyValue: { name: 'Devworks Bootcamp' },
errmsg: 'E11000 duplicate key error collection: devcamper_db.bootcamps index: name_1 dup key: { name: "Devworks Bootcamp" }'
}

Things like "err.name" / "err.code" can be used to differentiate errors / exceptions.

4> How to throw an error / exception from catch block and make sure configured middleware excutes ?

This may not be the ideal way of doing things, once you throw an exception from catch block we need to have one more catch block at middle ware level.

NO :

exports.getBootcamp = async (req, res, next) => {
try {
const bootcamp = await BootcampModel.findById(req.params.id);

    if (!bootcamp) throw new BootcampNotFoundError(req.params.id);

    res.status(400).json({ success: true, data: bootcamp });

} catch (error) {
if (error.name && error.name === "CastError")
throw new InvalidRequestIDError(req.params.id);
else next(error);
}
};

YES :

exports.getBootcamp = async (req, res, next) => {
try {
const bootcamp = await BootcampModel.findById(req.params.id);

    if (!bootcamp) throw new BootcampNotFoundError(req.params.id);

    res.status(400).json({ success: true, data: bootcamp });

} catch (error) {
if (error.name && error.name === "CastError")
next(new InvalidRequestIDError(req.params.id));
else next(error);
}
};

Creating error object and passing it to next callback will smoothly propogate that error to configured middle-ware, app.use(errorHandler) - server.js

5> Async/Await middleware :

http://www.acuriousanimal.com/blog/2018/03/15/express-async-middleware/

6> GeoCoder :

A 'node-geocoder' npm module is used to with provider set to 'google' and corresponding API_KEY. In the pre('save') hook we make a call to Google Geo-Coder API via node-geocoder module that we installed.

Based on the address text the we passed, Google Geo-Coder will return an object with latitude-longitude etc details. Those will be persisted in the location GEO-JSON point.
