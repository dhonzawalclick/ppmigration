(function (b, t, r, a, i, n) {
  b['bt'] = b['bt'] || function () {
    (b['_bt'] = b['_bt'] || []).push(arguments);
  }, i = t.createElement(r), n = t.getElementsByTagName(r)[0];
  i.async = 1;
  i.src = a;
  n.parentNode.insertBefore(i, n);
})(window, document, 'script', 'https://cdn.boomtrain.com/p13n/' + site_id + '/p13n.min.js');

var pp_int_id = '3393';
var pp_guid = '7b43e2661c514e2095871a5471d17d61';
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
// logger("eid");
// logger(eid);
//var uEmail = atob(email_enc);
var opt_in_status = PC_EXTRA_OBJ["boomtrain_all"];

var foundMatch = false;
var matchedContact;
var matchedPhoneContact;

while (!foundMatch) {
  btSubscriberJson.contacts.forEach(contact => {
    // swap to uEmail during prod
    //    logger(contact);
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

// logger("look here")
// logger(btSubscriberJson.properties)

//block1
if (btSubscriberJson.properties.pref_center_die_hard_fan == 'Y') {
  $("#die_hard_fan").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_casual_fan == 'Y') {
  $("#casual_fan").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_deal_seeker == 'Y') {
  $("#deal_seeker").prop('checked', true);
}

//block2
if (btSubscriberJson.properties.pref_center_latest_product_drops == 'Y') {
  $("#latest_product_drops").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_deals_and_special_offers == 'Y') {
  $("#deals_and_special_offers").prop('checked', true);
}

if (btSubscriberJson.properties.pref_center_new_content_and_articles == 'Y') {
  $("#new_content_and_articles").prop('checked', true);
}

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
  var die_hard_fan_value = $('#die_hard_fan').prop("checked") ? true : false;
  var casual_fan_value = $('#casual_fan').prop("checked") ? true : false;
  var deal_seeker_value = $('#deal_seeker').prop("checked") ? true : false;
  //block2
  var latest_product_drops_value = $('#latest_product_drops').prop("checked") ? true : false;
  var deals_and_special_offers_value = $('#deals_and_special_offers').prop("checked") ? true : false;
  var new_content_and_articles_value = $('#new_content_and_articles').prop("checked") ? true : false;
	
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
  var die_hard_fan_value_zmp;
  var casual_fan_value_zmp;
  var deal_seeker_value_zmp;
  var latest_product_drops_value_zmp;
  var deals_and_special_offers_value_zmp;
  var new_content_and_articles_value_zmp;
  if (die_hard_fan_value === true) {
    user_json['pref_center_die_hard_fan'] = 'Y';
	var die_hard_fan_value_zmp = 'Y';
  } else {
    user_json['pref_center_die_hard_fan'] = 'N';
	var die_hard_fan_value_zmp = 'N';
  }

  if (casual_fan_value === true) {
    user_json['pref_center_casual_fan'] = 'Y';
	var casual_fan_value_zmp = 'Y';
  } else {
    user_json['pref_center_casual_fan'] = 'N';
	var casual_fan_value_zmp = 'N';
  }

  if (deal_seeker_value === true) {
    user_json['pref_center_deal_seeker'] = 'Y';
	var deal_seeker_value_zmp = 'Y';
  } else {
    user_json['pref_center_deal_seeker'] = 'N';
	var deal_seeker_value_zmp = 'N';
  }

  //block2
  if (latest_product_drops_value === true) {
    user_json['pref_center_latest_product_drops'] = 'Y';
	var latest_product_drops_value_zmp = 'Y';
  } else {
    user_json['pref_center_latest_product_drops'] = 'N';
	var latest_product_drops_value_zmp = 'N';
  }

  if (deals_and_special_offers_value === true) {
    user_json['pref_center_deals_and_special_offers'] = 'Y';
	var deals_and_special_offers_value_zmp = 'Y';
  } else {
    user_json['pref_center_deals_and_special_offers'] = 'N';
	var deals_and_special_offers_value_zmp = 'N';
  }

  if (new_content_and_articles_value === true) {
    user_json['pref_center_new_content_and_articles'] = 'Y';
	var new_content_and_articles_value_zmp = 'Y';
  } else {
    user_json['pref_center_new_content_and_articles'] = 'N';
	var new_content_and_articles_value_zmp = 'N';
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
        "pref_center_die_hard_fan": die_hard_fan_value_zmp,
        "pref_center_casual_fan": casual_fan_value_zmp,
        "pref_center_deal_seeker": deal_seeker_value_zmp,
        "pref_center_latest_product_drops": latest_product_drops_value_zmp,
        "pref_center_deals_and_special_offers": deals_and_special_offers_value_zmp,
        "pref_center_new_content_and_articles": new_content_and_articles_value_zmp
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
