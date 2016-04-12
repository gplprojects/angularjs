AngularJs Modules - ngValidator
=================================

ngValidator is an Angular module written in generic way to address the form validations.

The idea behind this module (ngValidator) as follows,

• Encourage developers to control when to validate a form element (Example: onBlur or onFoucs or onChange)

• Get rid of tracking multiple flags to show validation messages

• A support to multiple validation rules and a callback / control expression to control execution of rules.

Usage As simple as typical angular module inclusion.

Include Validator to Angular Application

var app = angular.module('AngularApp', ['ngValidator']);
Form Element

<input id="fieldname" name="fieldname" 
                type="text" 
                ng-model="model.name"
                value-patterns="pattern1,pattern2"> <!--pattern1,pattern2 can be a RegEx or javascript method -->
Display Validation Message

Option 1: Loop over the errors list and display
<div ng-repeat="error in formname.fieldname.valueErrors" 
     class="field-error">
     {{getMessageFromScope(error)}} <!-- Customize / Localize message -->
</div>

Option 2: Use valid / invalid flags to show messages
<div ng-show="formname.fieldname.$error.pattern1 || formname.fieldname.$error.pattern2 || formname.fieldname.$error.$invalid">
     Error Message
</div>
Invoke validation before submitting

     //Form validity
     $scope.<formname>.isValid();

     //Element validity
     $scope.<formname>.<elementname>.isValid(); 
