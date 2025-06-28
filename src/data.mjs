import fs from 'fs'
import yaml from 'yaml'

// Read the YAML file synchronously with UTF-8 encoding
const file = fs.readFileSync('./src/data.yaml', 'utf8')

// Parse the content of the YAML file into a JavaScript object
const data = yaml.parse(file)

// Export the parsed data as the default export
export default data
