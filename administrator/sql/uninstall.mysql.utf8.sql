DROP TABLE IF EXISTS `#__ra_walkseditor_walks`;
DROP TABLE IF EXISTS `#__ra_walkseditor_places`;
DROP TABLE IF EXISTS `#__ra_walkseditor_contacts`;
DROP TABLE IF EXISTS `#__ra_walkseditor_events`;

DELETE FROM `#__content_types` WHERE (type_alias LIKE 'com_ra_walkseditor.%');