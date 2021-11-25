# NodeJS Arguments from Command Line

## Introduction

In an effort to learn something new every day that I may have overlooked in the past, sometimes I return to the docs for technologies.

Today we will be looking at how to pass arguments to a node.js application from the command line.

## Basics

Node comes with a supplied [`process`](https://nodejs.org/api/process.html) object which provides information about, and control over, the current Node.js process.

This object exposes the [`argv`](https://nodejs.org/api/process.html#processargv) property.
This property returns an array containing the command-line arguments.
The first property in the array is [`process.execPath`](https://nodejs.org/api/process.html#processexecpath) which is the absolute path of the executable that started the node.js process, for example:
```bash
/usr/local/bin/node
```
The second property is the path to the javascript file being executed.
The remaining elements in the array are the arguments passed to the program from the command line.

### Basic Example Usage

Let's set up a new node.js project to test this out.

Navigate to a directory where you would like the program to live and type the following command to start our node project and keep the default values:
```bash
npm init --y
```

Open the project folder in your favorite editor and create a new file `app.js` in the project root folder and add the following code:

```js
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})
```

Now in the command line type:
```bash
node app.js one two=three four=five
```

This will yield the following results
```bash
0: /usr/local/bin/node
1: /Users/bannon/Desktop/webDev/node.js/fileArguments/app.js
2: one
3: two=three
4: four=five
```

Each number at the beginning of the line is the index at which you could find that argument within the code. For example:
```bash
0: /usr/local/bin/node
```
Within `app.js` you could get the absolute path for the executable with `process.argv[0]`

Practically we would probably not need the first two arguments often, so we can slice off the first two and save the results in a new variable, called `args`

```js
// app.js
const args = process.argv.slice(2)
console.log('args', args)
```

If we add the previous two lines to our file and run
```bash
node app.js one=two three=four yes=no
```
we will get the previous list of arguments as before along with a new last line that we are interested in:
```bash
args [ 'one=two', 'three=four', 'yes=no' ]
```

The Node.JS docs suggest using the [`minimist`](https://nodejs.dev/learn/nodejs-accept-arguments-from-the-command-line#:~:text=Install%20the%20required%20minimist%20package%20using%20npm%20(lesson%20about%20the%20package%20manager%20comes%20later%20on).) library to properly parse each argument into key:value pairs, however for this simple example post I do not want to add any dependencies, so I will parse the information myself.

We do not want to have to access the information using indexes in the array, so for this process we can use an [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) and store each argument as key:value pairs

Add the following lines to `app.js`

```js
let argsObj = {}
for (let i = 0; i < args.length; i++) {
  let current = args[i].split('=')
  let key = current[0]
  let value = current[1]
  argsObj[key] = value
}
console.log('argsObj', argsObj)
```

If we run the program with the same bash command as before we get the following results on the last line

```bash
argsObj { one: 'two', three: 'four', yes: 'no' }
```

We now have a useable object containing all of the arguments passed to the program from the command line

NOTE: This is a useful parser for sending key=value pairs through the command line, however if an argument is sent that is not the format key=value, the resulting object shows undefined for the value of that argument

Example:
```bash
node app.js one=two three=four yes=no five
```
Yields
```bash
argsObj { one: 'two', three: 'four', yes: 'no', five: undefined }
```

## Practical

This is a pretty simple concept, but the previous examples don't really show anything practical.

Let's look at an example of how this could actually be used in the real world.

Now that we have a working object that we can pass information to from the command line, we could use that object to do just about anything we want with the values passed in.

### Math Functions

Let's use it to input some numbers and display the resulting operations from those numbers

We will just do basic operations:
* Add
* Subtract
* Multiply
* Divide
* Remainder

We could write separate functions for each of these, but just to display the concept of passing in values I will use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) and just display the results to the console.

Add the following lines to your code after the `argsObj` has been filled.

```js
if (argsObj.num1 && argsObj.num2) {
  let num1 = argsObj.num1, num2 = argsObj.num2
  console.log(`Add: ${num1} + ${num2} = ${num1 + num2}`)
  console.log(`Subtract: ${num1} - ${num2} = ${num1 - num2}`)
  console.log(`Multiply: ${num1} * ${num2} = ${num1 * num2}`)
  console.log(`Divide: ${num1} / ${num2} = ${num1 / num2}`)
  console.log(`Remainder: ${num1} % ${num2} = ${num1 % num2}`)
}
```

First we check that the argsObj contains two keys with names `num1` and `num2`
Then we display the results of the mathematical operators on those two numbers

In your terminal, try:
```bash
node app.js num1=10 num2=3
```
Which returns
```bash
...
Add: 10 + 3 = 103
Subtract: 10 - 3 = 7
Multiply: 10 * 3 = 30
Divide: 10 / 3 = 3.3333333333333335
Remainder: 10 % 3 = 1
```

One thing to notice here is that all of the functions seem to work correctly with the template literal, except for the addition line.

This is actually working exactly as JavaScript is supposed to work. We can add the following line into our `if` statement to check the types of the two variables `num1` and `num2`

```js
console.log('typeof num1, num2', typeof num1, typeof num2)
```
which yields the results
```bash
typeof num1, num2 string string
```

We never converted the initial strings passed in from the command line into number format. So JavaScript is concatenating the two strings together rather than adding the numbers together, as they are strings and not numbers.

JavaScript does an automatic [type coercion](https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion) on the remaining functions and converts those strings into numbers before doing the mathematical operations on them.

To fix the addition line, we could rewrite it like so:

```js
console.log(`Add: ${num1} + ${num2} = ${parseInt(num1) + parseInt(num2)})
```
which yields the result
```bash
Add: 10 + 3 = 13
```

### End Results

If you followed everything in this tutorial, your end product should look as follows:

```js
// process object built into node.js
// has the argv property to retrieve arguments from the command line
// first element is full path of the node command
// second element is full path of file being executed
// all additional arguments are present from third element onwards
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

// get rid of the first two arguments as they are not needed in further processing
const args = process.argv.slice(2)
console.log('args', args)

// parse arguments into an object with key:value pairs
let argsObj = {}
for (let i = 0; i < args.length; i++) {
  let current = args[i].split('=')
  let key = current[0]
  let value = current[1]
  argsObj[key] = value
}
console.log('argsObj', argsObj)

// do math with the values passed in
if (argsObj.num1 && argsObj.num2) {
  let num1 = argsObj.num1, num2 = argsObj.num2
  console.log(`Add: ${num1} + ${num2} = ${num1 + num2}`)
  console.log(`Subtract: ${num1} - ${num2} = ${num1 - num2}`)
  console.log(`Multiply: ${num1} * ${num2} = ${num1 * num2}`)
  console.log(`Divide: ${num1} / ${num2} = ${num1 / num2}`)
  console.log(`Remainder: ${num1} % ${num2} = ${num1 % num2}`)

  console.log('typeof num1, num2', typeof num1, typeof num2)
  console.log(`Add: ${num1} + ${num2} = ${parseInt(num1) + parseInt(num2)}`)
}
```

The resulting console log will look like:
```bash
0: /usr/local/bin/node
1: /Users/bannon/Desktop/webDev/node.js/fileArguments/app.js
2: num1=10
3: num2=3
args [ 'num1=10', 'num2=3' ]
argsObj { num1: '10', num2: '3' }
Add: 10 + 3 = 103
Subtract: 10 - 3 = 7
Multiply: 10 * 3 = 30
Divide: 10 / 3 = 3.3333333333333335
Remainder: 10 % 3 = 1
typeof num1, num2 string string
Add: 10 + 3 = 13
```

Stay tuned for more in depth explanations of basic concepts that I learn.

## Bonus

When we started this project, we accepted the node.js defaults for `package.json` with the `npm init --y` command.

Let's update this file so that we can run the process with a different command.

In `package.json`, change the `"main"` key to point to `app.js` instead of `index.js`, and add the following line under the `scripts` key:

```json
"start": "node app.js",
```

Your resulting file should be similar to the following

```json
{
  "name": "node_file_arguments",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### New Command, New Logs

Now we can run the program with the following command:
```bash
npm start num1=10 num2=3
```

This will yield the same results as before but with two extra lines logged before the `app.js` file runs.

```bash
> node_file_arguments@1.0.0 start /Users/bannon/Desktop/webDev/node.js/fileArguments
> node app.js "num1=10" "num2=3"
```

This shows the full executable path starting with the project_name@version_num, the script we used (`start` in this case) and then the full path to the file.
Then it shows what command that script ran, before finally displaying the rest of our usual results for this project.