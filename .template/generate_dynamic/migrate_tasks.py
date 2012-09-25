import copy
import json
import logging
import os
import shutil

import lib
from lib import task, BASE_EXCEPTION

log = logging.getLogger(__name__)

class MigrationError(BASE_EXCEPTION):
	pass

def _move_orientations(config):
	if 'modules' in config and 'orientations' in config['modules']:
		config['modules']['display'] = {
				'orientations': config['modules']['orientations']
		}
		del config['modules']['orientations']

@task
def migrate_config(build):
	from_platform_version = "v1.3"
	to_platform_version = "v1.4"
	from_config_version = "2"
	to_config_version = "3"

	# Check platform version
	if not build.config['platform_version'].startswith(from_platform_version):
		raise MigrationError(
"""
'platform_version' in your src/config.json file is not set to {from_platform_version}

This could mean you have already migrated, in which case you can run a build \
as normal, or it could mean your platform version is set to a specific minor \
version or custom version.

If you are not sure how to proceed contact support@trigger.io.
""".format(from_platform_version=from_platform_version))
	
	# Check config version
	if "config_version" not in build.config or \
			build.config["config_version"] != from_config_version:
		raise MigrationError(
"""
Config file version was expected to be {from_config_version} however it was not.

If you are not sure how to proceed, contact support@trigger.io.
""".format(from_config_version=from_config_version))
	
	# Prompt
	cli_mode = build.tool_config.get('general.interactive', True)
	if cli_mode:
		resp = lib.ask_multichoice(
"""
Your app will be migrated from platform version {from_platform_version} to \
{to_platform_version}

This migration will automatically update your 'src/config.json' file; further \
details are available from http://current-docs.trigger.io/release-notes.html

Can we proceed?
""".format(from_platform_version=from_platform_version,
	to_platform_version=to_platform_version),
			["Yes", "No"])
		if resp != 1:
			raise MigrationError("User cancelled migration")

	new_config = copy.deepcopy(build.config)
	new_config['platform_version'] = to_platform_version
	new_config['config_version'] = to_config_version
	new_config['modules']['reload'] = True
	_move_orientations(new_config)
	
	log.info("backing up your config.json file")
	config_file_name = os.path.join(build.source_dir, "config.json")
	shutil.copy(config_file_name, config_file_name + ".bak")

	log.info("creating new config.json file")
	with open(config_file_name, "w") as config_file:
		json.dump(new_config, config_file, indent=4)
	log.info("migrated to platform version {to_platform_version}"
			.format(to_platform_version=to_platform_version))
