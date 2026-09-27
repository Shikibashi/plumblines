const {withEntitlementsPlist} = require('expo/config-plugins')

const withAppEntitlements = config => {
  return withEntitlementsPlist(config, config => {
    config.modResults['com.apple.security.application-groups'] = [
      `group.uk.plumblines.app`,
    ]
    return config
  })
}

module.exports = {withAppEntitlements}
