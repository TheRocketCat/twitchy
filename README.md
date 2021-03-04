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