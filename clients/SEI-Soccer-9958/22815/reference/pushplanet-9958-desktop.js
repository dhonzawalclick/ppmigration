//load p13n.js
var site_id = 'sei-soccer-com';
(function (b, t, r, a, i, n) {
  b['bt'] = b['bt'] || function () {
    (b['_bt'] = b['_bt'] || []).push(arguments);
  }, i = t.createElement(r), n = t.getElementsByTagName(r)[0];
  i.async = 1;
  i.src = a;
  n.parentNode.insertBefore(i, n);
})(window, document, 'script', 'https://cdn.boomtrain.com/p13n/' + site_id + '/p13n.min.js');

var pp_int_id = '3392';
var pp_guid = '96ae1b07c23f453c9233a3a6ff633106';
var regExp = /[a-zA-Z]/;
var regExpNum = /[^0-9-]/;
var regNumAndChar = /[^0-9.,#@%&\/\-]/;
var regSpecialChars = /[^A-Za-z0-9 .,'#@%&\/\-]/;
var specialChars = ". ' - # @ % & /"
var uid_enc = getUrlParam('encbu');
var email_enc = getUrlParam('ence');
var email = atob(email_enc);
var uid = atob(uid_enc);
var eid = getUrlParam('eid');
// console.log("eid");
// console.log(eid);
//var uEmail = atob(email_enc);
var opt_in_status = PC_EXTRA_OBJ["boomtrain_all"];

var foundMatch = false;
var matchedContact;
var matchedPhoneContact;

while (!foundMatch) {
  btSubscriberJson.contacts.forEach(contact => {
    // swap to uEmail during prod
    //    console.log(contact);
    if (contact.contact_value == email) {
      matchedContact = contact;
      foundMatch = true;
    }
  });
}

if (matchedContact.contact_properties.phone_number) {
  phone = matchedContact.contact_properties.phone_number;
} else if (btSubscriberJson.properties.phone_writable) {
  phone = btSubscriberJson.properties.phone_writable;
} else {
  phone = btSubscriberJson.properties.phone;
}

// console.log("look here")
// console.log(btSubscriberJson.properties)

//block1
if (btSubscriberJson.properties.pref_center_parent == 'Y') {
  $("#parent").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_coach_admin == 'Y') {
  $("#coach_admin").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_player == 'Y') {
  $("#player").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_fan == 'Y') {
  $("#fan").prop('checked', true);
}

//block2
if (btSubscriberJson.properties.pref_center_cleats_and_shoes == 'Y') {
  $("#cleats_and_shoes").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_fan_jerseys_and_gear == 'Y') {
  $("#fan_jerseys_and_gear").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_apparel == 'Y') {
  $("#apparel").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_soccer_balls_and_equipment == 'Y') {
  $("#soccer_balls_and_equipment").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_goalkeeper == 'Y') {
  $("#goalkeeper").prop('checked', true);
}

//blocks 3 and 4
if (btSubscriberJson.properties.pref_center_deals_and_special_offers == 'Y') {
  $("#deals_and_special_offers").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_new_content_and_articles == 'Y') {
  $("#new_content_and_articles").prop('checked', true);
}

// check all inner checkboxes if outer checkbox is checked, otherwise uncheck all inner checkboxes if outer checkbox is unchecked
$('#prefer_all').change(function () {
  if ($('#prefer_all').is(':checked')) {
    $('.checkbox-group').prop('checked', true);
  } else {
    $('.checkbox-group').prop('checked', false);
  }
});

// uncheck outer checkbox if one of inner checkbox is unchecked
$('.checkbox-group').change(function () {
  if (!$(this).is(':checked')) {
    $('#prefer_all').prop('checked', false);
  }
});

$("#subEmail").val(email);

$('#submit').click(function () {
  var email_value = email;
  var failure = false;
  var first_name_value = $('#first_name').val();
  var last_name_value = $('#last_name').val();
  var date_of_birth_value = $('#date_of_birth').val();
  //   var date_of_birth_value_converted = date_of_birth_value.toISOString().split('T')[0

  if ($('#prefer_all').is(':checked')) {
    $('.checkbox-group').prop('checked', true);
  }


  //block1
  var parent_value = $('#parent').prop("checked") ? true : false;
  var coach_admin_value = $('#coach_admin').prop("checked") ? true : false;
  var player_value = $('#player').prop("checked") ? true : false;
  var fan_value = $('#fan').prop("checked") ? true : false;
  //block2
  var cleats_and_shoes_value = $('#cleats_and_shoes').prop("checked") ? true : false;
  var fan_jerseys_and_gear_value = $('#fan_jerseys_and_gear').prop("checked") ? true : false;
  var apparel_value = $('#apparel').prop("checked") ? true : false;
  var soccer_balls_and_equipment_value = $('#soccer_balls_and_equipment').prop("checked") ? true : false;
  var goalkeeper_value = $('#goalkeeper').prop("checked") ? true : false;
  //blocks 3 and 4
  var new_content_and_articles_value = $('#new_content_and_articles').prop("checked") ? true : false;
  var deals_and_special_offers_value = $('#deals_and_special_offers').prop("checked") ? true : false;
  var current_date = new Date();
  var date_of_birth_not_converted = Date.parse(date_of_birth_value);
  var date_of_birth_converted = Math.round(Date.parse(date_of_birth_value) / 1000);
  var current_date_compare = Date.now();
  var current_date_compare_formatted = Math.round(current_date_compare / 1000);
  var subtract_this = 12 * 31556926;
  var twelve_and_up = current_date_compare_formatted - subtract_this;

  if (isBlank(first_name_value)) {
    alert('First Name is required.');
    failure = true;
  }

  if (isBlank(last_name_value)) {
    alert('Last Name is required.');
    failure = true;
  }

  if (isBlank(date_of_birth_value)) {
    alert('Date of Birth is required.');
    failure = true;
  }

  if (twelve_and_up < date_of_birth_converted) {
    alert('Must be ages 12 and up.');
    failure = true;
  }

  if (failure) {
    return;
  }

  var user_json = {
    "uid": uid,
    "properties": {
      "first_name": first_name_value,
      "last_name": last_name_value,
      "date_of_birth": date_of_birth_value,
      "email": email_value
    },
    "contacts": [{
      "contact_type": "email",
      "contact_value": uid,
      "subscription_status": "active",
      "contact_properties": {}
    }],
  };


  //block1
  var parent_value_zmp;
  var coach_admin_value_zmp;
  var player_value_zmp;
  var fan_value_zmp;
  var cleats_and_shoes_value_zmp;
  var apparel_value_zmp;
  var soccer_balls_and_equipment_value_zmp;
  var goalkeeper_value_zmp;
  var new_content_and_articles_value_zmp;
  var deals_and_special_offers_value_zmp;
  if (parent_value === true) {
    user_json['pref_center_parent'] = 'Y';
    var parent_value_zmp = 'Y';
  } else {
    user_json['pref_center_parent'] = 'N';
    var parent_value_zmp = 'N';
  }

  if (coach_admin_value === true) {
    user_json['pref_center_coach_admin'] = 'Y';
    var coach_admin_value_zmp = 'Y';
  } else {
    user_json['pref_center_coach_admin'] = 'N';
    var coach_admin_value_zmp = 'N';
  }

  if (player_value === true) {
    user_json['pref_center_player'] = 'Y';
    var player_value_zmp = 'Y';
  } else {
    user_json['pref_center_player'] = 'N';
    var player_value_zmp = 'N';
  }

  if (fan_value === true) {
    user_json['pref_center_fan'] = 'Y';
    var fan_value_zmp = 'Y';
  } else {
    user_json['pref_center_fan'] = 'N';
    var fan_value_zmp = 'N';
  }

  //block2
  if (cleats_and_shoes_value === true) {
    user_json['pref_center_cleats_and_shoes'] = 'Y';
    var cleats_and_shoes_value_zmp = 'Y';
  } else {
    user_json['pref_center_cleats_and_shoes'] = 'N';
    var cleats_and_shoes_value_zmp = 'N';
  }

  if (fan_jerseys_and_gear_value === true) {
    user_json['pref_center_fan_jerseys_and_gear'] = 'Y';
  } else {
    user_json['pref_center_fan_jerseys_and_gear'] = 'N';
    var fan_jerseys_and_gear_value_zmp = 'N'
  }

  if (apparel_value === true) {
    user_json['pref_center_apparel'] = 'Y';
    var apparel_value_zmp = 'Y';
  } else {
    user_json['pref_center_apparel'] = 'N';
    var apparel_value_zmp = 'N';
  }

  if (soccer_balls_and_equipment_value === true) {
    user_json['pref_center_soccer_balls_and_equipment'] = 'Y';
    var soccer_balls_and_equipment_value_zmp = 'Y';
  } else {
    user_json['pref_center_soccer_balls_and_equipment'] = 'N';
    var soccer_balls_and_equipment_value_zmp = 'N';
  }

  if (goalkeeper_value === true) {
    user_json['pref_center_goalkeeper'] = 'Y';
    var goalkeeper_value_zmp = 'Y';
  } else {
    user_json['pref_center_goalkeeper'] = 'N';
    var goalkeeper_value_zmp = 'N';
  }

  //blocks 3 and 4
  if (new_content_and_articles_value === true) {
    user_json['pref_center_new_content_and_articles'] = 'Y';
    var new_content_and_articles_value_zmp = 'Y';
  } else {
    user_json['pref_center_new_content_and_articles'] = 'N';
    var new_content_and_articles_value_zmp = 'N';
  }

  if (deals_and_special_offers_value === true) {
    user_json['pref_center_deals_and_special_offers'] = 'Y';
    var deals_and_special_offers_value_zmp = 'Y';
  } else {
    user_json['pref_center_deals_and_special_offers'] = 'N';
    var deals_and_special_offers_value_zmp = 'N';
  }

  var user_event_json = {
    "activity": {
      "subscriber": {
        "uid": uid
      },
      "event": "preference_center",
      "properties": {
        "subscription_status": "active",
        "first_name": first_name_value,
        "last_name": last_name_value,
        "date_of_birth": date_of_birth_value,
        "email": email_value,
        "pref_center_parent": parent_value_zmp,
        "pref_center_coach_admin": coach_admin_value_zmp,
        "pref_center_player": player_value_zmp,
        "pref_center_fan": fan_value_zmp,
        "pref_center_cleats_and_shoes": cleats_and_shoes_value_zmp,
        "pref_center_apparel": apparel_value_zmp,
        "pref_center_soccer_balls_and_equipment": soccer_balls_and_equipment_value_zmp,
        "pref_center_goalkeeper": goalkeeper_value_zmp,
        "pref_center_new_content_and_articles": new_content_and_articles_value_zmp,
        "pref_center_deals_and_special_offers": deals_and_special_offers_value_zmp
      }
    }
  };

  window.updateSubscriber(pp_guid, pp_int_id, user_json, function (res) {
    window.zetaTrackEvent(pp_guid, pp_int_id, user_event_json, function (status, data) {
      setTimeout(function () {
        window.scrollTo(0, 0);
        $('#textBox1').hide();
        $('#textBox2').hide();
        $('#subForm').hide();
        $('#textBox3').show();
      }, 1000);
    });
  });
});

//check for valid email
function validateEmail(email) {
  var reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return reg.test(email);
}

//check for a blank
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}