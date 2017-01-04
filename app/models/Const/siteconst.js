/**
 * Created by Stupig on 1/4/2017.
 */

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define('SECRET', 'qwerty');
define('RESET_TOKEN_ERROR', 'Password reset token is invalid or has expired.');
define('PASSWORD_NOT_MATCH', 'Your passwords do not match');
define('SUCCESS', 'Success');
define('FAIL', 'fail');
define('INSERT_SUCCESS', 'The new record is inserted successfully');
define('UPDATE_SUCCESS', 'The record is updated successfully');
define('DELETE_SUCCESS', 'The record is deleted successfully');
define('UPDATE_FAILURE', 'The record is updated unsuccessfully');
define('INSERT_FAILURE', 'The record is inserted unsuccessfully');
define('SOCKET_NULL_SERVICE_TYPE', 'No Service Type');
define('DELETE_FAILURE', 'The record is deleted unsuccessfully');
define('INPUT_REQUIRED', 'Input required');
define('GENERAL_ERROR', 'Something wrong!');

define('SERVICE_REQUEST_NEW_REQUEST', 1);
define('SERVICE_REQUEST_IN_PROGRESS', 2);
define('SERVICE_REQUEST_FOLLOW_UP_CALL', 3);
define('SERVICE_REQUEST_ARCHIVED', 4);

define('GUEST_SATISFATION_SASTIFY', 1);
define('GUEST_SATISFATION_AVERAGE', 2);
define('GUEST_SATISFATION_DISSATISFIED', 3);

// API
define('API_STATUS', 'status');
define('API_MSG', 'msg');
define('API_DATA', 'data');
define('API_TOKEN', 'token');

define('API_SUCCESS_YES', 1);
define('API_SUCCESS_NO', 0);

define('URL', 'http://localhost:');
define('PORT', '5555');

// Service request error message
define('MISSING_REQUEST_TYPE', 'Missing request type');

// Departments
define('ALL_DEPARTMENT_KEY', 'All');

// STAFFS
define('REAL_PATH', './src/server/uploads/');
define('PATH_DEFAULT', '/uploads/upload_img.png');
define('IMAGE_PATH', '/uploads/');
define('EMAIL_EXISTENCE', 'The email is existed');
define('STAFFID_EXISTENCE', 'The the stall id is existed');

// SOCKET CONSTANTS
define('SOCKET_IO_NO_CHOICE', 0);
define('SOCKET_IO_NEW_REQUEST', 1);
define('SOCKET_IO_LATE_RESPONSE', 2);

// REQUEST TYPE
define('REQUEST_TYPE_ROOM_REQUEST', 1);
define('REQUEST_TYPE_CONCIERGE_REQUEST', 2);
define('REQUEST_TYPE_OTHER_REQUEST', 3);
define('SURVEY_FEEDBACK', 4);

// PATTERNS
define('EMAIL_PATTERN', /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
define('IMAGE_PATTERN', 'base64');
define('STAFFID_PATTERN', /([a-zA-Z0-9_])/);

// FILE EXTENSIONS
define('EXTENSION_PNG', 'png');
define('EXTENSION_JPG', 'jpg');
define('EXTENSION_JPEG', 'jpeg');

// VALIDATION MESSAGES
define('ERR_EMAIL', 'The email is empty or wrong');
define('ERR_ROLE', 'The role is empty');
define('ERR_DEPARTMENT', 'The department is empty');
define('ERR_EXTENSION', 'The extension is not correct');
define('ERR_IMAGE', 'The image must be encoded by base 64');
define('ERR_STAFFID', 'The staff id is not correct');
define('ERR_CONFIRMPASS', 'The password and confirm password are not same');
define('ERR_PASSWORD', 'The password and confirm password are empty or the password must be have at least 6 digits');
define('ERR_PERMISSION', 'Your role can not create , update or delete the information of staff and the role');
define('ACCOUNT_NOT_FOUND', 'The account not exists');
define('EMAIL_EXIST', 'The email have been used');
define('PASSWORD_WRONG', 'Invalid username or password');

//ROLES AND PERMISSIONS
