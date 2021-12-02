# NodeJS Arguments from Command Line

This repo is a basic example of passing arguments to node.js applications and doing a little math with those arguments.

It has as associated blog post which will eventually go on my blog page in the `/posts` directory

## Get started

Clone this repo and run 

```bash
node app.js num1=<number> num2=<number>
# or
npm start num1=<number> num2=<number>
```

## Example

```bash
node app.js num1=10 num2=3
```
yields
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

# Console Object

This is a continuation of the arguments from command line repo within the same repo to save from having thousands of repos.

## Get Started

```bash
node console.js
# or
npm console
```