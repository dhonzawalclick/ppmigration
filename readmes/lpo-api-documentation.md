LPO API Documentation 

By: Nathan Vranicar 

Last Updated: 3/13/2026 by Nathan Vranicar 

 

This document contains code examples for the integrated ZMP REST API functions that we have access to in Push Planet and Digioh. If any updates to this document are needed, please reach out to Nathan Vranicar or Joseph Wedge. 

 

Track an Event 

Creates an event in the user journey for the People profile associated with the provided UID. 

  

Sample Payload: 

var user_event_json = { 

    "activity": { 

        "subscriber": { 

            "uid": uid     // User ID [string] (Required) 

        }, 

        "event": "global_unsubscribe",      // Event name [string] (Required) 

        "properties": {      // Explicit event properties to update [object] (Optional) 

            site_id: site_id, 

            message_uid: message_uid, 

            page_url: PP_ANALYTICS.VARS.current_page_url 

        } 

    } 

}; 

  

Push Planet: 

window.zetaTrackEvent(pp_guid, pp_int_id, user_event_json, function (status, data) { }); 

pp_guid [string]: Push Planet GUID. This is a unique identifier per Push Planet account. Found under the 'Help' menu in the Push Planet interface 

pp_int_id [string]: Push Planet Integration ID. This is the unique identifier for the integration (connection between Push Planet and ZMP). Found under the 'Integrations' tab in the Push Planet interface 

user_event_json [object]: Data payload, as modeled above 

Callback:  

status [string]: Response status of the API call (200 success or 400 failure) 

data [object]: API response including details of the event created (only on a 200 success) 

  

Digioh: 

api.ZETA_FUNCTIONS.zetaTrackEvent(integration_id, user_event_json, function (data) {  }); 

integration_id [string]: Digioh Integration ID. This is the unique identifier for the integration (connection between Digioh and ZMP). Found under the 'Integrations' tab -> 'Current Integrations' in the Digioh interface 

user_event_json [object]: Data payload, as modeled above 

Callback:  

data [object]: API response including details of the event created (only on a 200 success) 

  

  

  

Identify a User 

Updates the People profile of the provided UID, or creates a new profile if that UID does not exist in ZMP. 

  

Sample Payload: 

var user_json = { 

    "uid": uid,     // User ID [string] (Required) 

    "contacts": [{    // Contact array [array] (Optional) 

        "contact_type": "email",     // Contact type [string]: "email" or "phone" 

        "contact_value": uEmail,    // Contact value [string] (full email address or phone number) 

        "subscription_status": "active"     // Subscription status [string]: "active" or "inactive" 

    }], 

    "properties": {}     // Explicit user properties to update [object] (Optional) 

}; 

  

Push Planet: 

window.updateSubscriber(pp_guid, pp_int_id, user_json, function(data) { }); 

pp_guid [string]: Push Planet GUID. This is a unique identifier per Push Planet account. Found under the 'Help' menu in the Push Planet interface 

pp_int_id [string]: Push Planet Integration ID. This is the unique identifier for the integration (connection between Push Planet and ZMP). Found under the 'Integrations' tab in the Push Planet interface 

user_event_json [object]: Data payload, as modeled above 

Callback:  

data [object]: API response including details of the updated user profile (only on a 200 success) 

  

Digioh: 

api.ZETA_FUNCTIONS.updateSubscriber(integration_id, user_json, function(data) {  }); 

integration_id [string]: Digioh Integration ID. This is the unique identifier for the integration (connection between Digioh and ZMP). Found under the 'Integrations' tab -> 'Current Integrations' in the Digioh interface 

user_json [object]: Data payload, as modeled above 

Callback:  

data [object]: API response including details of the updated user profile (only on a 200 success) 

  

  

  

Unsubscribe a User 

Sets the specified contact's status to inactive, and sends the System Unsubscribed event to the user journey for the People profile associated with the provided UID. 

  

Sample Payload: 

var unsub_payload = { 

    "source": "api",     // Source value [string] (Required, should always be "api" for LPO work) 

    "contact_type": "email",      // Contact type [string]: "email" or "phone" (Required) 

    "status": "inactive",       // Contact status [string]: should always be "inactive" for an unsubscribe call (Required) 

    "message_uid": message_uid,      // Message UID [string] (Optional, but always recommended if available - adds specificity/traceability to the Unsubscribed event) 

    "contact_value": uEmail       // Contact value [string] (full email address or phone number, required) 

} 

  

Push Planet: 

window.zetaUnsubUser(pp_guid, pp_int_id, uid, unsub_payload, function (data) { }); 

pp_guid [string]: Push Planet GUID. This is a unique identifier per Push Planet account. Found under the 'Help' menu in the Push Planet interface 

pp_int_id [string]: Push Planet Integration ID. This is the unique identifier for the integration (connection between Push Planet and ZMP). Found under the 'Integrations' tab in the Push Planet interface 

unsub_payload [object]: Data payload, as modeled above 

Callback:  

data [object]: API response (currently only includes 200 success or 400 error code) 

  

Digioh: 

The Unsubscribe a User endpoint is not integrated into Digioh. 

  

  

  

Get Subscriber by UID: 

Searches ZMP for any People profiles that match the provided UID, and returns the full profile data if a match is found. 

  

Push Planet: 

window.getSubscriber(pp_guid, pp_int_id, uid, function(data) {  }); 

pp_guid [string]: Push Planet GUID. This is a unique identifier per Push Planet account. Found under the 'Help' menu in the Push Planet interface 

pp_int_id [string]: Push Planet Integration ID. This is the unique identifier for the integration (connection between Push Planet and ZMP). Found under the 'Integrations' tab in the Push Planet interface 

uid [string]: ZMP User ID of the user profile to search for 

Callback: 

data [object]: API response including the full user profile found by the call, or a 400 error if the user was not found 

  

  

Digioh: 

api.ZETA_FUNCTIONS.getSubscriber(integration_id, uid, function(data) {  }); 

integration_id [string]: Digioh Integration ID. This is the unique identifier for the integration (connection between Digioh and ZMP). Found under the 'Integrations' tab -> 'Current Integrations' in the Digioh interface 

uid [string]: ZMP User ID of the user profile to search for 

Callback: 

data [object]: API response including the full user profile found by the call, or a 400 error if the user was not found 

  

  

  

Get Subscriber by Contact: 

Searches ZMP for any People profiles that match the provided contact value, and returns the full profile(s) data as an array if a match(s) is found. 

  

Push Planet: 

window.getSubscriberByContactEmail(pp_guid, pp_int_id, uEmail, function (data) { }); 

pp_guid [string]: Push Planet GUID. This is a unique identifier per Push Planet account. Found under the 'Help' menu in the Push Planet interface 

pp_int_id [string]: Push Planet Integration ID. This is the unique identifier for the integration (connection between Push Planet and ZMP). Found under the 'Integrations' tab in the Push Planet interface 

uEmail [string]: Email address to look up 

Callback: 

data [array]: API response including each profile object found by the call, or a 400 error if no users were found 

  

Special considerations for this function: 

This function is dependent on one of Push Planet's non-standard JS libraries. You will need the following code to be present in your custom JS in order to use this function (placing this code at the top of your JS is recommended): 

(function () { 

var e = document.createElement('script'); e.type = 'text/javascript'; e.async = true; 

e.src = 'https://cdn.pushplanet.com/editor/widget_boomtrain.js'; 

var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s); 

})(); 

  

During initial testing of this function, some profiles were returned that did not actually match the inputted email address. The following code was developed to circumvent this issue: 

window.getSubscriberByContactEmail(pp_guid, pp_int_id, email, function (data) { 

    // Handle response data (contained in the "data" variable) 

    if (data[0]) { 

        // Match found 

        // Loop through response data and find one matching profile to use (prevents errors found in testing where some non-matching profiles were returned by the API call) 

        var matchedContact = {}; 

        data.forEach(profile => { 

            profile.contacts.forEach(contact => { 

                if (contact.contact_value == email) { 

                    matchedContact = profile; 

                } 

            }); 

        }); 

        uid = matchedContact.uid; 

    } 

}); 

  

When using the above code, the correct returned profile will be stored in the 'matchedContact' variable. 

  

Digioh: 

api.ZETA_FUNCTIONS.getSubscriberByContact(integration_id, contact_type, contact_value, function(data) {  }); 

integration_id [string]: Digioh Integration ID. This is the unique identifier for the integration (connection between Digioh and ZMP). Found under the 'Integrations' tab -> 'Current Integrations' in the Digioh interface 

contact_type [string]: 'email' or 'phone' 

contact_value [string]: Email address or phone number to look up 

Callback: 

data [array]: API response including each profile object found by the call, or a 400 error if no users were found 

  

Special consideration for this function: 

During initial testing of this function, some profiles were returned that did not actually match the inputted email address. The following code was developed to circumvent this issue: 

api.ZETA_FUNCTIONS.getSubscriberByContact(integration_id, contact_type, contact_value, function(data) { 

    // Handle response data (contained in the "data" variable) 

    if (data[0]) { 

        // Match found 

        // Loop through response data and find one matching profile to use (prevents errors found in testing where some non-matching profiles were returned by the API call) 

        var matchedContact = {}; 

        data.forEach(profile => { 

            profile.contacts.forEach(contact => { 

                if (contact.contact_value == email) { 

                    matchedContact = profile; 

                } 

            }); 

        }); 

        uid = matchedContact.uid; 

    } 

}); 

  

When using the above code, the correct returned profile will be stored in the 'matchedContact' variable.
