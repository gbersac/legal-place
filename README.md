# Usage

To create the log file: `yarn start`

To run tests: `yarn test`

To run the linter: `yarn lint`

Instruction for this exercise has been moved [here](https://github.com/gbersac/legal-place/blob/main/INSTRUCTION.md)

I renamed the original file `output.json` to `output-model.json`.

# Discussion of the proposed solution

There's a little ambiguity in this instruction: `"Magic Pill" never expires nor decreases in Benefit.`. I decided to never change benefit for magic pill, even if it is initialized with a value which is not between 0 and 50.

You'll find different implementation of the solution to this problem:
- one procedural programming implementation which style is like the one first implemented (named `Pharmacy`)
- one procedural programming implementation which style is different but more readable in my opinion (named `PharmacyRefactored`)
- one implementation using object oriented design with inheritence (named `PharmacyOop`)

Which implementation should be implemented in real world should depend on discussion with other memebers of the team and how code is designed in other parts of the code base.

In another language, I would have made the class `Pharmacy` abstract, but there is no abstract class in javascript.
