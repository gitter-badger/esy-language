# Compile
Let's start with the most useful command: `compile`

Use this command to compile `Esy` files to JavaScript

## Usage
`esy compile [files..]`

This command takes the name of some Esy files and converts them to JavaScript, by default it shows output in Terminal.

Example: 
```
1. esy compile a.esy b.esy c.esy            # Print result to terminal
2. esy compile a.esy b.esy c.esy -s         # Save results in esy.js
3. esy compile a.esy -s                     # Save results in a.js
4. esy compile a.esy b.esy -d compiled.js   # Save results in compiled.js
```
## Options
```
  --help              Show help                                        [boolean]
  --config, -c        config.json src             [string] [default: "esy.json"]
  --environments, -e  Set project's environments                         [array]
  --save, -s          Save file in same directory               [default: false]
  --tree, -t          Just print parsed code tree               [default: false]
  --min, -m           Minify output                             [default: false]
  --dest, -d          Output destination                                [string]
  --watch, -w         Run program in watch mode                 [default: false]

```
**--save, -s**: Use this option to save the output to a file instead of STDOUT.

**--tree, -t**: If turn this option on, It'll show you generated Esy `Structure Tree` in JSON format.
> Note: -tree option won't work with multiple files

**--min, -m**: Minify output using `uglify-es`

**--dest, -d**: Determine save destination
> When you pass the -d option to program, --save option automatically would be true

**--watch, -w**: Run compiler in watch mode.