const redis_main_const = {
  REDIS_MAGIC_STRING: 5, //used for redis internal protocol operations
  REDIS_VERSION: 4,
};
const OPCODES = {
  EOF: 0xff, //end of file -> 255
  SELECTDB: 0xfe, //specifying database here-> 254
  EXPIRETIME: 0xfd, //expire time in seconds -> 253
  EXPIRETIMEMS: 0xfc, //expire time in miliseconds -> 252
  RESIZEDB: 0xfb, //size allocation -> 251
  AUX: 0xfa, //used for data store/receive -> 250
};
module.exports = {
  redis_main_const,
  OPCODES,
};
