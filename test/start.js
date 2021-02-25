var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

it('should be correct calculation!', function () {
    var num1 = 2;
    var num2 = 5;

    expect(num1 + num2).to.equal(7);
});
it('should be integer!', function () {
    var inputval = 5;

    expect(inputval).to.be.a("string");
});