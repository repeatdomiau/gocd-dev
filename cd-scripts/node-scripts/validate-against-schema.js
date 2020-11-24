const fs = require('fs');
const path = require('path');
const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true });

const [, , questionPath, schemaPath] = process.argv;

const files = fs.readdirSync(questionPath);

const errors = [];

for (let file of files) {
    const question = fs.readFileSync(path.resolve(questionPath, file));
    const genSchema = fs.readFileSync(path.resolve(schemaPath, 'generic_schema.json'));

    const validateType = ajv.compile(JSON.parse(genSchema));
    const validType = validateType(JSON.parse(question));

    if (!validType) {
        const error = `Error validating ${file}` + validateType.errors.map(e =>
            `Error: ${e.dataPath}: ${e.message} ${JSON.stringify(e.params)}`).join('\n');
        errors.push(error);
    }

    const questionObj = JSON.parse(question);
    const type = questionObj.type;

    const schemaPathForType = path.resolve(schemaPath, (
        type == "GAP" ? 'questao_gaps_schema.json' :
            type == "MULTI" ? 'questao_multipla_schema.json' :
                'questao_v_f_schema.json'
    )
    );

    const schema = fs.readFileSync(schemaPathForType);
    const validate = ajv.compile(JSON.parse(schema));
    const valid = validate(JSON.parse(question));

    if (!valid) {
        console.log(`${file} -> INVALID`);
        const error = validate.errors.map(e =>
            `Error: ${e.dataPath}: ${e.message} ${JSON.stringify(e.params)}`).join('\n');
    }
    else {
        console.log(`${file} -> OK`);
    }
}

if (errors.length > 0) {
    console.log(errors.join('\n\n'));
    process.exit(1);
}

console.log('OK');