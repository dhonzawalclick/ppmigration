
        var settings = '';
        var PP_MODE = 'hosted';
        var PP_CACHE_VERSION = '0076a8704e35445790aaeb754898d2a9';
        var PP_STAGE = '';
        var IS_DEV = false;
        var IS_PREVIEW = false;
        var USER_ID = '829';
        var USER_GUID = '__IwMwHMCmlmCGoDGAWZB2AnAIzgEw3IriHGAKwDMkuADJEA__';
        var PAGE_ID = '10031';
        var PAGE_GUID = '11381d9518774d37bdae7a1867532f76';
        var PAGE_NAME = 'sei-431sports-prod-preference page updated';
        var PP_KWK = '';
        var GEO = {};
        var DEVICE = "";
        var DEVICE_TYPE = "";
        var DEVICE_TYPE_MOBILE_OVERRIDE = '';
        var UserPixelsSettings = '';
        var PixelsSettingsOverride = false;
        // Preview-only: if controller provided a device_type, expose it here
        var PREVIEW_FORCED_DEVICE = '';

        var usePC_Z_Prof = "";
        var btGlobalSubscriptionStatus = "";
        var isValidParse = true;
        var btSubscriberJson = {};
        var itSubscriberJson = {};
        var itMessageTypePolicy = '';
        var itProjectType = '';
        var it_lz = '';
        var bt_lz = '';

        var PP_COUPON_GROUP_POPULATE_OBJ = JSON.parse('{}');

        var PAGE_MODE = 'LP';
        var PC_PARTNER = '';
        var PC_LINK_VERSION = '';
        var PC_LISTS_OBJ = '';
        var PC_PROFILE_OBJ = '';
        var PC_EXTRA_OBJ = '';
        var PC_ALL_OBJ = '';
        var PC_INTEGRATION_ID = '3391';
        var PC_ERROR_PAGE = '';
        var DATA_STORAGE_TYPE = 'none';
        var PP_TURNSTILE_ENABLED = false;

        //parse PixelsJSONConfigs

        try {
            if (UserPixelsSettings != '' && typeof UserPixelsSettings === 'object') {
                let pageMobilePixelThreshold = UserPixelsSettings[PAGE_ID] || UserPixelsSettings["all"] || "";
                let currentWindowWidth = window.innerWidth;
                if (pageMobilePixelThreshold && typeof pageMobilePixelThreshold == 'number' && currentWindowWidth <= pageMobilePixelThreshold) {
                    DEVICE_TYPE = 'mobile';
                    PixelsSettingsOverride = true;
                }
            }
        } catch(err) {
            logger('ERROR: ' + e.message);
        }

        var window_loc_base = window.location.href.toLowerCase();
        if (window_loc_base.indexOf('http://') == 0) {
            window.location.href = "https://" + window.location.href.substring(7);
        }

        var LogIsPrinted = false;
        var LogDeferredArr = [];

        var logger = function(msg) {
            if (LogIsPrinted || localStorage.getItem('pp_show_logs') == '1') {
                console.log(msg);
                LogIsPrinted = true;
            }
            else {
                LogDeferredArr.push(msg);
            }
        };

        var logErrorText = function(function_name, msg) {
            if (function_name && function_name !== "logger") {
                logger('ERROR: ' + function_name + '() - ' + msg);
            }
        };

        var logError = function(e, function_name) {
            if (function_name && function_name !== "logger") {
                logger('ERROR: ' + function_name + '() - ' + e.message);
            }
        };

        var hideAllLogs = function () {
            LogIsPrinted = false;
            localStorage.removeItem("pp_show_logs");
        };

        var printAll = function() {
            if (typeof console !== "undefined") { 
                LogIsPrinted = true;
                for (var i = 0; i < LogDeferredArr.length; i++) {
                    console.log(LogDeferredArr[i]);
                }
                LogDeferredArr = [];
                localStorage.setItem('pp_show_logs', '1');
            }
        };



            PAGE_MODE = 'PC';
            

            try {
                PC_LISTS_OBJ = JSON.parse(atob('e30='));
                //logger("PC_LISTS_OBJ");
                //logger(PC_LISTS_OBJ);
            } catch (e) {
                logger('Error parsing PC_LISTS_OBJ: ' + e.message);
            }
            

            try {
                PC_PROFILE_OBJ = JSON.parse(atob('e30='));
                //logger("PC_PROFILE_OBJ");
                //logger(PC_PROFILE_OBJ);
            } catch (e) {
                logger('Error parsing PC_PROFILE_OBJ: ' + e.message);
            }
            

            try {
                PC_EXTRA_OBJ = JSON.parse(atob('e30='));
                //logger("PC_EXTRA_OBJ");
                //logger(PC_EXTRA_OBJ);
            } catch (e) {
                logger('Error parsing PC_EXTRA_OBJ: ' + e.message);
            }
            

            try {
                PC_ALL_OBJ = JSON.parse(atob('e30='));
                //logger("PC_ALL_OBJ");
                //logger(PC_ALL_OBJ);
            } catch (e) {
                logger('Error parsing PC_ALL_OBJ: ' + e.message);
            }
            

                logger('PC_ERRORS: ==> ERROR::::PC Boomtrain Integration encountered an error (3): uid and email were emptyERROR::::PC Boomtrain Integration encountered an error (2): ');
            

            PC_ERROR_PAGE = 'extra_page_1';
               

        var customJS = '';
        var customCSS = '';

        var masterCustomJS = {};
        masterCustomJS.CustomJSReady = '';
        masterCustomJS.CustomJSBeforeValidation = '';
        masterCustomJS.CustomJSBeforeSubmit = '';
        masterCustomJS.CustomJSAfterSubmit = '';
        masterCustomJS.CustomJSBeforeRedirect = '';
        masterCustomJS.CustomJSBeforeDownload = '';
        masterCustomJS.CustomJSBeforeChangePages = '';
        masterCustomJS.CustomJSAfterChangePages = '';
        masterCustomJS.CustomJSBeforeExit = '';


        if ('success' !== 'success') {
            logger('Controller Failure Step: ' + 'success');
            logger('HostedPagesName: ' + '431sports');
        }




        logger('PageMode: ' + PAGE_MODE);
        logger('CacheBreakerSource: Cache_prod');
        logger('UserSource: ');
        logger('PageSource: ');
        logger('LZENC: true');
    