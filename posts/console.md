# NodeJS Console Object

## Introduction

Going down the rabbit hole of node.js docs and spitting them back out with my own understanding plus extras that are either implied knowledge in the docs or things I felt could use a little bit more explanation.

Today we will look at the [`console`](https://nodejs.org/api/console.html) object supplied by node.

## Setup

If you have been following this series/repo, you should already have a project setup with an `app.js` file and a basic `package.json` in the root of the project.

Let's add a file called `console.js` to play around with the methods supplied by the node `console` object.

Let's also add a script in `package.json` to start that file from `npm`

Add this line in your `"scripts"` key:
```json
"console": "node console.js",
```

Now we can run the examples with:
```bash
node console.js
# or
npm console
```

## New Console Object

This section will utilize the Class: Console. This can be used to create a simple logger with a configurable output stream.

We can either require the console as a module (or [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)):

```js
const Console = require('console').Console
// or
const { Console } = require('console')
```

Or use the global `console` (or destructured)
```js
const Console = console.Console
// or 
const { Console } = console
```

Let's go ahead and add the destructured one using the global console object to our code.
Add that last line to our `console.js` file.

While we are at it, let's also make some files to write our log streams to, one for normal and one for errors.

Make a `/logs` directory in the root of the project and add the files `stdout.log` and `stderr.log` in that directory.

We can access these from our file by using the supplied [`fs`](https://nodejs.org/api/fs.html) module that comes with node.
We will not get into too much detail on this subject at the moment, but we will utilize the method [`createWriteStream`](https://nodejs.org/api/fs.html#filehandlecreatewritestreamoptions).

Add the following lines in your `console.js` file to assign variables to the log streams.

```js
// import the fs module
const fs = require('fs')

// create write streams for our custom logger
const output = fs.createWriteStream('./logs/stdout.log')
const errOutput = fs.createWriteStream('./logs/stderr.log')

// simple custom logger
const logger = new Console({ stdout: output, stderr: errOutput })

// can now be used like console.log except will write to files
const name = 'Bannon'
logger.log('my name is: %s', name)
```

Running
```bash
node console.js
```
in the console writes
```log
my name is: Bannon

```
to the file `stdout.log`

We could write a simple command such as
```js
logger.error('Failed', Date.now())
```
to log a Failed message with the time to `stderr.log`
```log

```

You will notice two things if you run this multiple times.
First, the date we put into the error log using the JavaScript [date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) shows up as the [*epoch time*](https://en.wikipedia.org/wiki/Unix_time), which isn't very human readable.
The second thing you will notice is that every time the program is run, the entire contents of the file are replaced with the new content.

### Date Object

For the date, we can change our 
```js
Date.now()
```
to
```js
Date()
```
and JavaScript will automagically spit out the full date with time for your specific timezone.

Looking through the [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) on the date object we can see that there are many ways to spit out the date, we can get pretty much any part of it (day, month, year, etc.). This standard `Date()` will work fine for us though as it is the most complete without having to do any conversions or concatenations.

### Log Persistence

The log will persist and append to the file as long as the program is running.
Since the only thing our program currently does is write a line to each `.log`, this process is restarted every time we run the application.

In a real world scenario, our program would be able to write to the log as many times as it needed, appending each line, for the life of the instance of that application.

We could probably set up a scenario that makes a custom file with a datestamp on it each time the program is run, so that we can keep the previous files and not lose valuable information when our application crashes and is restarted before checking the logs.

To check the first thing I mentioned about being able to append to the file for the life of the application, let's add two new lines to our `console.js` file to log some more data to each file.

```js
logger.log('second line')
logger.error('Failed again', Date())
```

If we run the program now we should get the following results
`stdout.log`
```log
my name is: Bannon
second line
```
`stderr.log`
```log
Failed Thu Nov 25 2021 08:25:13 GMT-0600 (Central Standard Time)
Failed again Thu Nov 25 2021 08:25:13 GMT-0600 (Central Standard Time)
```

Our program + node is so fast that you can't even see a time discrepancy on the error log.
For fun, add back `Date.now()` to the error lines and you can see the milliseconds change between the first and the second line.

#### Dynamic Log Names

Let's see if we can add a dynamic timestamp to our log names so that we can keep the old logs after running the program multiple times.

Change our `output` and `errOutput` lines again to:
```js
const output = fs.createWriteStream(`./logs/stdout_${Date()}.log`)
const errOutput = fs.createWriteStream(`./logs/stderr_${Date()}.log`)
```
Notice that we use string literals to inject some JavaScript code into the file name.
Also note that `createWriteStream` creates the file if it does not already exist.

Now we get a new file every time the program runs and completes, along with a date string for when that happened.

## More Console Magic

I won't go through the entirety of the console docs and display every method, but there are a few more that I want to point out that could be useful.

### console.count()

This method counts the number of times a certain string has been output to the console.
If nothing is sent to the method as an argument, the default is the string `'default'`.

Let's put this to use in a for loop and watch how many times we output the outer and inner loop.

Add the following lines to the end of `console.js`:
```js
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 5; j++) {
    logger.count('inner loop')
    logger.count(j)
    logger.count()
  }
  logger.count('outer loop')
  logger.count(i)
  logger.count()
}
```

Notice we added the `'default'` counter on the outer and inner loop, and that `i` and `j` will sometimes overlap.

Also notice the last line on the inner loop, this was added to see when `i` is a multiple of `j`. Let's run the program and see the results.

If we check the results after running the program now, we will notice 200+ lines of output because of how many loggers we have.

#### Multiples from inner to outer loop

Let's say we want to only output the multiples that satisfy our last line of the inner loop and put the rest in the error log.

Let's comment out our previous loop and add this new one (to save space):
```js
for (let i = 1; i <= 100; i++) {
  for (let j = 1; j <= 10; j++) {
    i % j === 0 ?
      logger.log(`${i} % ${j} === 0 ${i % j === 0}`) :
      logger.error(`${i} % ${j} === 0 ${i % j === 0}`)
  }
}
```

Note we use the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) here instead of if/else statements.

Also note that this particular section has nothing to do with the count method, so please ignore where it is placed in this blog, I just thought of this while I Was doing the count feature. These lines will add all the clean divisors to the `stdout` file and the rest to the `stderr` file.

### console.table()

A very useful feature of the console object is the `table` method.

To begin using this, let's download some mock data (in this repo as `mockdata.json`). I like to use [mockaroo](https://www.mockaroo.com/) to get data instead of trying to create my own, to save time.

Let's import the data into our `console.js` file and then use the `table()` method. This method takes a tabularData argument, such as an array of objects, and an optional properties argument where you can specify which fields from the data you would like to display.

```js
const tabularData = require('./mockdata.json')

logger.table(tabularData)
```

Running our program once again (after commenting out the previous sections besides setting up the logger itself) will display a really neat table of the data in our log file.

![Example console tabluar display](https://s3.us-east-2.amazonaws.com/images.tannerabread.com/Screen+Shot+2021-11-28+at+7.15.31+PM.png)

### console.time()

The `time()`, `timeEnd()`, and `timeLog()` methods can be used to calculate the time elapsed for a process.

You can use the `time` method to start a timer, it takes one argument, a string, that defaults to 'default' or can be named any other string to keep track of multiple timers at once.

Let's try it out with a for loop that we know will be exceptionally longer than it needs to be.

Try this in your `console.js` file:
```js

```