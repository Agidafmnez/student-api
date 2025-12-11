const { XMLBuilder } = require('fast-xml-parser');

function toXML(obj, rootName='response') {
  const builder = new XMLBuilder({ ignoreAttributes:false, format: true });
  const root = { [rootName]: obj };
  return builder.build(root);
}

function sendFormatted(res, data, status=200, rootName='response', reqAccept='application/json') {
  if (reqAccept && reqAccept.includes('xml')) {
    res.type('application/xml').status(status).send(toXML(data, rootName));
  } else {
    res.type('application/json').status(status).json(data);
  }
}

module.exports = { sendFormatted, toXML };
