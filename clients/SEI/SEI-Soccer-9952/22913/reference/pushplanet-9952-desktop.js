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
// var healthier_together = btSubscriberJson.properties.healthier_together;
//var address_confirmed = btSubscriberJson.properties.address_confirmed;
// var email_active = btSubscriberJson.properties.has_active_email;

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
//
//console.log("phone_value contact");
//console.log(matchedContact.contact_properties.phone_number);

if (matchedContact.contact_properties.phone_number) {
  phone = matchedContact.contact_properties.phone_number;
} else if (btSubscriberJson.properties.phone_writable) {
  phone = btSubscriberJson.properties.phone_writable;
} else {
  phone = btSubscriberJson.properties.phone;
}

if (btSubscriberJson.properties.pref_center_new_cleats == 'Y') {
  $("#new_cleats").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_new_fan_jerseys == 'Y') {
  $("#new_fan_jerseys").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_new_equipment == 'Y') {
  $("#new_equipment").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_goalkeeper == 'Y') {
  $("#goalkeeper").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_sale == 'Y') {
  $("#sale").prop('checked', true);
}

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

if (btSubscriberJson.properties.opt_down_ind == '1_2_per_week') {
  $('input:radio[name=opt_down_ind][value=1_2_per_week]').click();
} else if (btSubscriberJson.properties.opt_down_ind == '3_5_per_week') {
  $('input:radio[name=opt_down_ind][value=3_5_per_week]').click();
} else if (btSubscriberJson.properties.opt_down_ind == 'receive_all') {
  $('input:radio[name=opt_down_ind][value=receive_all]').click();
}

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

//console.log(address_1);
//console.log('phone type below')
//console.log(phone)
//console.log(typeof phone);
// console.log(typeof zip);

$("#subEmail").val(email);
$("#unsubEmail").val(email);

$('#submit').click(function () {
  var email_value = email;
  var failure = false;
  var first_name_value = $('#first_name').val();
  var last_name_value = $('#last_name').val();
  var date_of_birth_value = $('#date_of_birth').val();
  var agreement_conf_value = $('#agreement_conf').prop("checked") ? true : false;
  //   var date_of_birth_value_converted = date_of_birth_value.toISOString().split('T')[0];
  var new_cleats_value = $('#new_cleats').prop("checked") ? true : false;
  var new_fan_jerseys_value = $('#new_fan_jerseys').prop("checked") ? true : false;
  var new_equipment_value = $('#new_equipment').prop("checked") ? true : false;
  var goalkeeper_value = $('#goalkeeper').prop("checked") ? true : false;
  var sale_value = $('#sale').prop("checked") ? true : false;
  var parent_value = $('#parent').prop("checked") ? true : false;
  var coach_admin_value = $('#coach_admin').prop("checked") ? true : false;
  var player_value = $('#player').prop("checked") ? true : false;
  var fan_value = $('#fan').prop("checked") ? true : false;
  var opt_down_ind_value = $('input[name="opt_down_ind"]:checked').val();
//  var opt_down_ind_value = $('#opt_down_ind').val();;
  var current_date = new Date();
  var opt_down_date = current_date.toISOString();
  var date_of_birth_not_converted = Date.parse(date_of_birth_value);
  var date_of_birth_converted = Math.round(Date.parse(date_of_birth_value) / 1000);
  var current_date_compare = Date.now();
  var current_date_compare_formatted = Math.round(current_date_compare / 1000);
  var subtract_this = 12 * 31556926;
  var twelve_and_up = current_date_compare_formatted - subtract_this;
  //  var phone_number_val_converted = parseInt(phone_number_val);
  //  var phone_number_val_converted_two = Number(phone_number_val);

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

  if (agreement_conf_value === false) {
    alert('Please confirm that you have read and agree to the Terms and Conditions of Use and Privacy Policy');
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

if (opt_down_ind_value) {
  user_json['opt_down_ind'] = opt_down_ind_value;
  user_json['opt_down_date'] = opt_down_date;
}

if (new_cleats_value === true) {
  user_json['pref_center_new_cleats'] = 'Y';
} else {
  user_json['pref_center_new_cleats'] = 'N';
}

if (new_fan_jerseys_value === true) {
  user_json['pref_center_new_fan_jerseys'] = 'Y';
} else {
  user_json['pref_center_new_fan_jerseys'] = 'N';
}

if (new_equipment_value === true) {
  user_json['pref_center_new_equipment'] = 'Y';
} else {
  user_json['pref_center_new_equipment'] = 'N';
}

if (goalkeeper_value === true) {
  user_json['pref_center_goalkeeper'] = 'Y';
} else {
  user_json['pref_center_goalkeeper'] = 'N';
}

if (sale_value === true) {
  user_json['pref_center_sale'] = 'Y';
} else {
  user_json['pref_center_sale'] = 'N';
}

if (parent_value === true) {
  user_json['pref_center_parent'] = 'Y';
} else {
  user_json['pref_center_parent'] = 'N';
}

if (coach_admin_value === true) {
  user_json['pref_center_coach_admin'] = 'Y';
} else {
  user_json['pref_center_coach_admin'] = 'N';
}

if (player_value === true) {
  user_json['pref_center_player'] = 'Y';
} else {
  user_json['pref_center_player'] = 'N';
}

if (fan_value === true) {
  user_json['pref_center_fan'] = 'Y';
} else {
  user_json['pref_center_fan'] = 'N';
}

window.updateSubscriber(pp_guid, pp_int_id, user_json, function (res) {
  //	  console.log(user_json);
  setTimeout(function () {
    //      window.zetaTrackEvent(pp_guid, pp_int_id, user_event_json, function (status, data) {
    //        $('#text1').hide();
    //        $('#text4').show();
    //        $('#text5').hide();
    //        $('#form').hide();
    //      });
    window.scrollTo(0, 0);
    $('#text2').hide();
    $('#text3').hide();
    $('#text4').hide();
    $('#text5').show();
    $('#subForm').hide();
    $('#unsubForm').hide();
  }, 1000);

});

});

$('#unsubscribe').click(function () {
  var email_value = email;

  var user_json = {
    "uid": uid,
    "properties": {
      "email": email_value
    },
    "contacts": [{
      "contact_type": 'email',
      "contact_value": email_value,
      "subscription_status": 'inactive'
    }],
  };

  var user_event_json = {
    "activity": {
      "subscriber": {
        "uid": uid
      },
      "event": "unsubscribe",
      "properties": {
        "subscription_status": 'inactive',
        "email": email_value
      }
    }
  };

  // 		bt('updateUser', user_json);

  window.updateSubscriber(pp_guid, pp_int_id, user_json, function (res) {
    PC_EXTRA_OBJ["boomtrain_all"] = "inactive";
    //	  console.log(user_json);
    setTimeout(function () {
      window.zetaTrackEvent(pp_guid, pp_int_id, user_event_json, function (status, data) {
        window.scrollTo(0, 0);
        $('#text2').hide();
        $('#text3').hide();
        $('#text4').hide();
        $('#text6').show();
        $('#subForm').hide();
        $('#unsubForm').hide();
      });
    }, 1000);

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
