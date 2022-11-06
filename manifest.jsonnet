local manifest = import 'core/manifest_v3.libsonnet';
local utils = import 'core/utils.libsonnet';

local icons() = {
  [size]: 'icon.png'
  for size in ['16', '48', '128']
};

local json = manifest.new(
  name='MDN Search Extension',
  version='0.1',
  keyword='mdn',
  description='Search MDN docs!',
  service_worker='service-worker.js',
)
  .addIcons(icons())
  .addPermissions(['storage'])
  .addHostPermissions(['https://developer.mozilla.org/*']);

json