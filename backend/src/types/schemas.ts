import Ajv from 'ajv';

export default new Ajv({
  format: 'fast',
  schemas: [],
});

// TODO: Alle Schmeas im sharedModule title und id umbenennen. Dann isValid(String) string ohne "-schema".
