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