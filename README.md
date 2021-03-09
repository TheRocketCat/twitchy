# Twitchy
The coolest chat bot there is for your Creator Coins FANS!!!
## Description
It's the coolest, what other reason do i have to give you?
Oh... maybe that you'll potentially increase your cult followers
9000x, or that there is one feature to kick all the users at once,
or that we even included a death ray, free of charge ??!?!

## Usage
### Commands
Commands follow the structure of {command token}{command name} [...args]
where {} means required, and [] are optional arguments.
Double quotes will be noted when required.
**Example:**
Command: createAutoMsg "{message}" {update cycle in minutes}
```
    !createAutoMsg "i print every 10 minutes" 10
```
Anything with quotes, eg "", are strings and must be written inside those. Everything
else is numbers with different values, like minutes, coins, etc.

Command: !coinPrice [coin symbol]
```
    !coinPrice
```
```
    !coinPrice MyCoin 
```

# Running tests
```sh
    npm test
```

# Contributing
## Tests
### Setup

#### Mocks
##### channel
channels nammes must be lowercase and start with #.
example:
```
#iamacorrectlynamedchannel
```
### Expect
Should be written so that on unsuccesfull tests the error
message is printed by jest.
example:
```Javascript
//this
const cmdRes:Result<void,Error> = function()
expect(cmdRes).toBe(Ok.EMPTY)
//prints
/*
	ErrImpl {
	  "err": true,
	  "ok": false,
	  "val": [unauthorized error: user is not authorized],
*/
```
It prints like that on error because its comparing the whole structure,
which then includes the error in val.

Dont do this:
```
const cmdRes:Result<void,Error> = function()
expect(cmdRes.ok).toBe(true)
```
it will only print that it expected true, but got false. Which
isnt helpful to understand what error occured.
