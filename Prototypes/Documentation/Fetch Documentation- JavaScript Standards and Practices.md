# JavaScript Standards and Practices
## Variables
- Syntax:
  - Variables should be written using camelcase (ex: varOne)
- Declaration:
  - Variables should not be assigned at global scope
  - Variables should be declared constant where applicable
  - Varable names in content loaded should be unique from all function variables
- Should include commenting descriptive of variable use
## Functions
- API Functions
  - Any API interactivity should be done from a seperate functions outside of DOMContentLoaded
  - Should only accept input and return list or object containing relevant information
- Any code interacting with or propagating HTML or CSS code should be within DOMContentLoaded or from a function inside DOMContentLoaded
- Should include commenting describing input and output 
