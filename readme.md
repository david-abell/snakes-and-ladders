# Snakes and ladders game for two players

## How to play

currently under development

## Project goals

Build an interactive snakes and ladder game, playable in browser.

- Game logic should be fully covered by unit tests to ensure stable code.
- Use a css processor for cleaner front end code

It should have:

- a graphical board
- player tokens
- buttons for each player to click on their respective turns
- when clicked the buttons should:
  - roll two 6 sided dice
  - move the player token the resulting spaces
  - move up or down when ending turn on any snakes or ladders
- a winner should be declared when one player manages to reach the final space
- there should be a button to start a new game once victory is declared

## Why I built it this way

- project was a good playground for practicing with JavaScript classes
- meaningful way to learn industry standard testing skills

## Technology used

- Jest testing framework

## Available scripts

```bash
npm run test
```

## Credits

- I was inspired to expand on my quick and dirty solution to the CodeWars kata [Snakes and Ladders](https://www.codewars.com/kata/587136ba2eefcb92a9000027/javascript)
