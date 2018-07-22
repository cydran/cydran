var context = require.context('./', true, /.\.spec\.(ts|js)$/);

context.keys().forEach(context);

module.exports = context;