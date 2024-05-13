var DataTypes = require("sequelize").DataTypes;
var _ad = require("./ad");
var _ad_state = require("./ad_state");
var _artist = require("./artist");
var _cart = require("./cart");
var _collection = require("./collection");
var _event = require("./event");
var _event_evaluation = require("./event_evaluation");
var _event_status = require("./event_status");
var _event_type = require("./event_type");
var _favorites = require("./favorites");
var _museum = require("./museum");
var _museum_category = require("./museum_category");
var _museum_evaluation = require("./museum_evaluation");
var _notification = require("./notification");
var _notification_state = require("./notification_state");
var _notification_type = require("./notification_type");
var _piece = require("./piece");
var _piece_category = require("./piece_category");
var _product = require("./product");
var _product_evaluation = require("./product_evaluation");
var _product_type = require("./product_type");
var _proposal = require("./proposal");
var _purchase_invoice = require("./purchase_invoice");
var _purchase_line = require("./purchase_line");
var _sale_invoice = require("./sale_invoice");
var _sale_line = require("./sale_line");
var _support_evaluation = require("./support_evaluation");
var _support_state = require("./support_state");
var _support_ticket = require("./support_ticket");
var _ticket = require("./ticket");
var _ticket_status = require("./ticket_status");
var _user = require("./user");
var _user_status = require("./user_status");
var _user_type = require("./user_type");
var _usermuseum = require("./usermuseum");
var _zip_code = require("./zip_code");

function initModels(sequelize) {
  var ad = _ad(sequelize, DataTypes);
  var ad_state = _ad_state(sequelize, DataTypes);
  var artist = _artist(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var collection = _collection(sequelize, DataTypes);
  var event = _event(sequelize, DataTypes);
  var event_evaluation = _event_evaluation(sequelize, DataTypes);
  var event_status = _event_status(sequelize, DataTypes);
  var event_type = _event_type(sequelize, DataTypes);
  var favorites = _favorites(sequelize, DataTypes);
  var museum = _museum(sequelize, DataTypes);
  var museum_category = _museum_category(sequelize, DataTypes);
  var museum_evaluation = _museum_evaluation(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var notification_state = _notification_state(sequelize, DataTypes);
  var notification_type = _notification_type(sequelize, DataTypes);
  var piece = _piece(sequelize, DataTypes);
  var piece_category = _piece_category(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);
  var product_evaluation = _product_evaluation(sequelize, DataTypes);
  var product_type = _product_type(sequelize, DataTypes);
  var proposal = _proposal(sequelize, DataTypes);
  var purchase_invoice = _purchase_invoice(sequelize, DataTypes);
  var purchase_line = _purchase_line(sequelize, DataTypes);
  var sale_invoice = _sale_invoice(sequelize, DataTypes);
  var sale_line = _sale_line(sequelize, DataTypes);
  var support_evaluation = _support_evaluation(sequelize, DataTypes);
  var support_state = _support_state(sequelize, DataTypes);
  var support_ticket = _support_ticket(sequelize, DataTypes);
  var ticket = _ticket(sequelize, DataTypes);
  var ticket_status = _ticket_status(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_status = _user_status(sequelize, DataTypes);
  var user_type = _user_type(sequelize, DataTypes);
  var usermuseum = _usermuseum(sequelize, DataTypes);
  var zip_code = _zip_code(sequelize, DataTypes);

  event.belongsToMany(user, { as: 'useruid_user_event_evaluations', through: event_evaluation, foreignKey: "eventeid", otherKey: "useruid" });
  museum.belongsToMany(user, { as: 'useruid_user_museum_evaluations', through: museum_evaluation, foreignKey: "museummid", otherKey: "useruid" });
  museum.belongsToMany(user, { as: 'useruid_user_usermuseums', through: usermuseum, foreignKey: "museummid", otherKey: "useruid" });
  product.belongsToMany(user, { as: 'useruid_users', through: cart, foreignKey: "productprodid", otherKey: "useruid" });
  product.belongsToMany(user, { as: 'useruid_user_favorites', through: favorites, foreignKey: "productprodid", otherKey: "useruid" });
  product.belongsToMany(user, { as: 'useruid_user_product_evaluations', through: product_evaluation, foreignKey: "productprodid", otherKey: "useruid" });
  support_ticket.belongsToMany(user, { as: 'useruid_user_support_evaluations', through: support_evaluation, foreignKey: "support_ticketstid", otherKey: "useruid" });
  user.belongsToMany(event, { as: 'eventeid_events', through: event_evaluation, foreignKey: "useruid", otherKey: "eventeid" });
  user.belongsToMany(museum, { as: 'museummid_museums', through: museum_evaluation, foreignKey: "useruid", otherKey: "museummid" });
  user.belongsToMany(museum, { as: 'museummid_museum_usermuseums', through: usermuseum, foreignKey: "useruid", otherKey: "museummid" });
  user.belongsToMany(product, { as: 'productprodid_products', through: cart, foreignKey: "useruid", otherKey: "productprodid" });
  user.belongsToMany(product, { as: 'productprodid_product_favorites', through: favorites, foreignKey: "useruid", otherKey: "productprodid" });
  user.belongsToMany(product, { as: 'productprodid_product_product_evaluations', through: product_evaluation, foreignKey: "useruid", otherKey: "productprodid" });
  user.belongsToMany(support_ticket, { as: 'support_ticketstid_support_tickets', through: support_evaluation, foreignKey: "useruid", otherKey: "support_ticketstid" });
  ad_state.belongsTo(ad, { as: "adsad", foreignKey: "adsadid"});
  ad.hasMany(ad_state, { as: "ad_states", foreignKey: "adsadid"});
  proposal.belongsTo(ad, { as: "adad", foreignKey: "adadid"});
  ad.hasMany(proposal, { as: "proposals", foreignKey: "adadid"});
  piece.belongsTo(artist, { as: "artistum", foreignKey: "artistaid"});
  artist.hasMany(piece, { as: "pieces", foreignKey: "artistaid"});
  piece.belongsTo(collection, { as: "collectionc", foreignKey: "collectioncid"});
  collection.hasMany(piece, { as: "pieces", foreignKey: "collectioncid"});
  event_evaluation.belongsTo(event, { as: "evente", foreignKey: "eventeid"});
  event.hasMany(event_evaluation, { as: "event_evaluations", foreignKey: "eventeid"});
  ticket.belongsTo(event, { as: "evente", foreignKey: "eventeid"});
  event.hasMany(ticket, { as: "tickets", foreignKey: "eventeid"});
  event.belongsTo(event_status, { as: "event_status", foreignKey: "event_statuses_id"});
  event_status.hasMany(event, { as: "events", foreignKey: "event_statuses_id"});
  event.belongsTo(event_type, { as: "event_typeet", foreignKey: "event_typeetid"});
  event_type.hasMany(event, { as: "events", foreignKey: "event_typeetid"});
  event.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(event, { as: "events", foreignKey: "museummid"});
  museum_evaluation.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(museum_evaluation, { as: "museum_evaluations", foreignKey: "museummid"});
  piece.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(piece, { as: "pieces", foreignKey: "museummid"});
  product.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(product, { as: "products", foreignKey: "museummid"});
  purchase_invoice.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(purchase_invoice, { as: "purchase_invoices", foreignKey: "museummid"});
  support_ticket.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(support_ticket, { as: "support_tickets", foreignKey: "museummid"});
  usermuseum.belongsTo(museum, { as: "museumm", foreignKey: "museummid"});
  museum.hasMany(usermuseum, { as: "usermuseums", foreignKey: "museummid"});
  museum.belongsTo(museum_category, { as: "museum_categorymc", foreignKey: "museum_categorymcid"});
  museum_category.hasMany(museum, { as: "museums", foreignKey: "museum_categorymcid"});
  notification.belongsTo(notification_state, { as: "notification_staten", foreignKey: "notification_statensid"});
  notification_state.hasMany(notification, { as: "notifications", foreignKey: "notification_statensid"});
  notification.belongsTo(notification_type, { as: "notification_typent", foreignKey: "notification_typentid"});
  notification_type.hasMany(notification, { as: "notifications", foreignKey: "notification_typentid"});
  ad.belongsTo(piece, { as: "piecep", foreignKey: "piecepid"});
  piece.hasMany(ad, { as: "ads", foreignKey: "piecepid"});
  piece.belongsTo(piece_category, { as: "piece_categorypc", foreignKey: "piece_categorypcid"});
  piece_category.hasMany(piece, { as: "pieces", foreignKey: "piece_categorypcid"});
  cart.belongsTo(product, { as: "productprod", foreignKey: "productprodid"});
  product.hasMany(cart, { as: "carts", foreignKey: "productprodid"});
  favorites.belongsTo(product, { as: "productprod", foreignKey: "productprodid"});
  product.hasMany(favorites, { as: "favorites", foreignKey: "productprodid"});
  product_evaluation.belongsTo(product, { as: "productprod", foreignKey: "productprodid"});
  product.hasMany(product_evaluation, { as: "product_evaluations", foreignKey: "productprodid"});
  purchase_line.belongsTo(product, { as: "productprod", foreignKey: "productprodid"});
  product.hasMany(purchase_line, { as: "purchase_lines", foreignKey: "productprodid"});
  sale_line.belongsTo(product, { as: "productprod", foreignKey: "productprodid"});
  product.hasMany(sale_line, { as: "sale_lines", foreignKey: "productprodid"});
  product.belongsTo(product_type, { as: "product_typept", foreignKey: "product_typeptid"});
  product_type.hasMany(product, { as: "products", foreignKey: "product_typeptid"});
  purchase_line.belongsTo(purchase_invoice, { as: "purchase_invoicepurchase_invoice", foreignKey: "purchase_invoicepurchase_invoiceid"});
  purchase_invoice.hasMany(purchase_line, { as: "purchase_lines", foreignKey: "purchase_invoicepurchase_invoiceid"});
  sale_line.belongsTo(sale_invoice, { as: "sale_invoicesale_invoice", foreignKey: "sale_invoicesale_invoiceid"});
  sale_invoice.hasMany(sale_line, { as: "sale_lines", foreignKey: "sale_invoicesale_invoiceid"});
  support_ticket.belongsTo(support_state, { as: "support_statesss", foreignKey: "support_statesssid"});
  support_state.hasMany(support_ticket, { as: "support_tickets", foreignKey: "support_statesssid"});
  support_evaluation.belongsTo(support_ticket, { as: "support_ticketst", foreignKey: "support_ticketstid"});
  support_ticket.hasMany(support_evaluation, { as: "support_evaluations", foreignKey: "support_ticketstid"});
  ticket.belongsTo(ticket_status, { as: "ticket_statust", foreignKey: "ticket_statusts_id"});
  ticket_status.hasMany(ticket, { as: "tickets", foreignKey: "ticket_statusts_id"});
  ad.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(ad, { as: "ads", foreignKey: "useruid"});
  cart.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(cart, { as: "carts", foreignKey: "useruid"});
  event_evaluation.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(event_evaluation, { as: "event_evaluations", foreignKey: "useruid"});
  favorites.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(favorites, { as: "favorites", foreignKey: "useruid"});
  museum_evaluation.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(museum_evaluation, { as: "museum_evaluations", foreignKey: "useruid"});
  notification.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(notification, { as: "notifications", foreignKey: "useruid"});
  product_evaluation.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(product_evaluation, { as: "product_evaluations", foreignKey: "useruid"});
  sale_invoice.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(sale_invoice, { as: "sale_invoices", foreignKey: "useruid"});
  support_evaluation.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(support_evaluation, { as: "support_evaluations", foreignKey: "useruid"});
  support_ticket.belongsTo(user, { as: "admin_useru", foreignKey: "admin_useruid"});
  user.hasMany(support_ticket, { as: "support_tickets", foreignKey: "admin_useruid"});
  support_ticket.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(support_ticket, { as: "useru_support_tickets", foreignKey: "useruid"});
  ticket.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(ticket, { as: "tickets", foreignKey: "useruid"});
  usermuseum.belongsTo(user, { as: "useru", foreignKey: "useruid"});
  user.hasMany(usermuseum, { as: "usermuseums", foreignKey: "useruid"});
  user.belongsTo(user_status, { as: "user_statusu", foreignKey: "user_statusus_id"});
  user_status.hasMany(user, { as: "users", foreignKey: "user_statusus_id"});
  user.belongsTo(user_type, { as: "user_typeut", foreignKey: "user_typeutid"});
  user_type.hasMany(user, { as: "users", foreignKey: "user_typeutid"});
  proposal.belongsTo(usermuseum, { as: "usermuseummuseumm", foreignKey: "usermuseummuseummid"});
  usermuseum.hasMany(proposal, { as: "proposals", foreignKey: "usermuseummuseummid"});
  proposal.belongsTo(usermuseum, { as: "usermuseumuseru", foreignKey: "usermuseumuseruid"});
  usermuseum.hasMany(proposal, { as: "usermuseumuseru_proposals", foreignKey: "usermuseumuseruid"});
  museum.belongsTo(zip_code, { as: "zip_codezip", foreignKey: "zip_codezipid"});
  zip_code.hasMany(museum, { as: "museums", foreignKey: "zip_codezipid"});

  return {
    ad,
    ad_state,
    artist,
    cart,
    collection,
    event,
    event_evaluation,
    event_status,
    event_type,
    favorites,
    museum,
    museum_category,
    museum_evaluation,
    notification,
    notification_state,
    notification_type,
    piece,
    piece_category,
    product,
    product_evaluation,
    product_type,
    proposal,
    purchase_invoice,
    purchase_line,
    sale_invoice,
    sale_line,
    support_evaluation,
    support_state,
    support_ticket,
    ticket,
    ticket_status,
    user,
    user_status,
    user_type,
    usermuseum,
    zip_code,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
