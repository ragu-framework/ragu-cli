
      var component = require('/home/runner/work/ragu-cli/ragu-cli/onboarding-mfe/mfe');
      var resolver = require('/home/runner/work/ragu-cli/ragu-cli/onboarding-mfe/node_modules/ragu-react-server-adapter/resolvers/hydrate-resolver');

      module.exports.default = (resolver.default || resolver)(component.default || component);
    