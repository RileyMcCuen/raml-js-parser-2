/* global RAML, describe, it */

'use strict';

if (typeof window === 'undefined') {
  var raml           = require('../raml-parser-2');
  var chai           = require('chai');
  var expect         = chai.expect;
  var should         = chai.should();
  var chaiAsPromised = require('chai-as-promised');
  var path = require('path');
  chai.use(chaiAsPromised);
} else {
  var raml           = RAML.Parser;
  chai.should();
}
//
describe('Duplicated properties', function () {
  this.timeout(15000);
  describe('in Security Schemes', function () {

    //FIXTEST removed skip, changed error message
    it('should fail if two security schemes have the same name', function (done) {
      var definition = [
        '#%RAML 0.8',
        'title: some API',
        'securitySchemes:',
        '  - scheme1:',
        '      type: x-custom',
        '  - scheme1:',
        '      type: x-custom'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Security scheme \'scheme1\' already exists/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if a security scheme repeats the type property', function (done) {
      var definition = [
        '#%RAML 0.8',
        'title: some API',
        'securitySchemes:',
        '  - scheme1:',
        '      type: x-custom',
        '      type: x-custom-2'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Security scheme property already used: \'type\'/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if a OAuth 2.0 settings repeats a known property', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'securitySchemes:',
        ' - scheme:',
        '     description: This is some text',
        '     type: OAuth 2.0',
        '     settings:',
        '       authorizationUri: https://www.dropbox.com/1/oauth2/authorize',
        '       accessTokenUri: https://api.dropbox.com/1/oauth2/token',
        '       authorizationGrants: [ code, token ]',
        '       authorizationUri: https://www.dropbox.com/1/oauth2/authorize'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Property already used: \'authorizationUri\'/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if a OAuth 2.0 settings repeats an unknown property', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'securitySchemes:',
        ' - scheme:',
        '     description: This is some text',
        '     type: OAuth 2.0',
        '     settings:',
        '       authorizationUri: https://www.dropbox.com/1/oauth2/authorize',
        '       tokenTTL: 60s',
        '       accessTokenUri: https://api.dropbox.com/1/oauth2/token',
        '       authorizationGrants: [ code, token ]',
        '       tokenTTL: 30s'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Property already used: \'tokenTTL\'/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if a OAuth 1.0 settings repeats a known property', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'securitySchemes:',
        ' - scheme:',
        '     description: This is some text',
        '     type: OAuth 1.0',
        '     settings:',
        '       requestTokenUri: https://api.dropbox.com/1/oauth/request_token',
        '       authorizationUri: https://www.dropbox.com/1/oauth/authorize',
        '       tokenCredentialsUri: https://api.dropbox.com/1/oauth/access_token',
        '       requestTokenUri: https://api.dropbox.com/1/oauth/request_token'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Property already used: \'requestTokenUri\'/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if a OAuth 1.0 settings repeats an unknown property', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'securitySchemes:',
        ' - scheme:',
        '     description: This is some text',
        '     type: OAuth 1.0',
        '     settings:',
        '       requestTokenUri: https://api.dropbox.com/1/oauth/request_token',
        '       requestTimeout: 30',
        '       authorizationUri: https://www.dropbox.com/1/oauth/authorize',
        '       tokenCredentialsUri: https://api.dropbox.com/1/oauth/access_token',
        '       requestTimeout: 30'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Property already used: \'requestTimeout\'/).and.notify(done);
    });
  });
//
  describe('in URI parameters', function () {

    //FIXTEST error message
    it('should fail if there are repeated base URI parameter names at the root level', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'baseUri: http://api.com/{param1}',
        'baseUriParameters:',
        ' param1:',
        ' param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Base uri parameter \'param1\' already exists/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if there are repeated properties in a base URI parameter at the root level', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'baseUri: http://api.com/{param1}',
        'baseUriParameters:',
        ' param1:',
        '   type: number',
        '   type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Base uri parameter property already used: \'type\'/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if there are repeated base URI parameter names in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'baseUri: http://api.com/{param1}',
        '/resource:',
        '  baseUriParameters:',
        '    param1:',
        '    param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Base uri parameter \'param1\' already exists/).and.notify(done);
    });
//
    //FIXTEST error message
    it('should fail if there are repeated properties in a base URI parameter in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'baseUri: http://api.com/{param1}',
        '/resource:',
        '  baseUriParameters:',
        '    param1:',
        '      type: number',
        '      type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Base uri parameter property already used: \'type\'/).and.notify(done);
    });
//
    //FIXTEST changed message
    it('should fail if there are repeated URI parameter names in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'baseUri: http://api.com/{param1}',
        '/resource/{param1}:',
        '  uriParameters:',
        '    param1:',
        '    param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Uri parameter \'param1\' already exists/).and.notify(done);
    });
//
    it('should fail if there are repeated properties in a URI parameter in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'baseUri: http://api.com/{param1}',
        '/resource/{param1}:',
        '  uriParameters:',
        '    param1:',
        '      type: number',
        '      type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });
  });
//

  //FIXTEST changed syntax and removed "skip" as test is now valid, changed error message
  describe('in resource type names', function () {
    it('should fail if there are two resource types with the same name in the same list', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1: {}',
        '  - type2: {}',
        '  - type1: {}'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Resource type \'type1\' already exists/).and.notify(done);
    });
//
    //FIXTEST changed syntax and removed "skip" as test is now valid, changed error message
    it('should fail if there are two resource types with the same name in separate lists', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1: {}',
        '  - type2: {}',
        '  - type3: {}',
        '  - type1: {}'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Resource type \'type1\' already exists/).and.notify(done);
    });
  });
//
  //FIXTEST changed syntax and removed "skip" as test is now valid, changed error message
  describe('in traits names', function () {
    it('should fail if there are two traits with the same name in the same list', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1: {}',
        '  - trait2: {}',
        '  - trait1: {}'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Trait \'trait1\' already exists/).and.notify(done);
    });
//
    //FIXTEST changed syntax and removed "skip" as test is now valid, changed error message
    it('should fail if there are two resource types with the same name in separate lists', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1: {}',
        '  - trait2: {}',
        '  - trait3: {}',
        '  - trait1: {}'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Trait \'trait1\' already exists/).and.notify(done);
    });
  });
//
  //FIXTEST error message
  describe('in root', function () {
    it('should fail if there are repeated root properties', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'title: Test'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Api property already used: \'title\'/).and.notify(done);
    });
  });
//
//  describe('in documentation', function () {
//    it('should fail if there are repeated doc section titles', function (done) {
//      var definition = [
//        '#%RAML 0.8',
//        '---',
//        'title: Test',
//        'documentation:',
//        '  - title: Title for the section',
//        '    content: Content for the section',
//        '  - title: Title for the section',
//        '    content: Content for the section',
//        '  - title: Title for the section',
//        '    content: Content for the section',
//        '  - title: Title for the section',
//        '    content: Content for the section',
//        '  - title: Title for the section',
//        '    content: Content for the section',
//        '  - title: Title for the section',
//        '    title: Content for the section'
//      ].join('\n');
//
//      raml.load(definition).should.be.rejectedWith(/property already used: 'title'/).and.notify(done);
//    });
//
//    it('should fail if there are repeated doc section content', function (done) {
//      var definition = [
//        '#%RAML 0.8',
//        '---',
//        'title: Test',
//        'documentation:',
//        '  - title: Title for the section',
//        '    content: Content for the section',
//        '    content: Content for the section'
//      ].join('\n');
//
//      raml.load(definition).should.be.rejectedWith(/property already used: 'content'/).and.notify(done);
//    });
//  });
//
  describe('in resource names', function () {

    //FIXTEST error message changed
    it('should fail if there are repeated resources in the document', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '/resource:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Resource \'\/resource\' already exists/).and.notify(done);
    });

    //FIXTEST error message changed
    it('should fail if there are repeated resources in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource1:',
        '  /resource:',
        '  /resource2:',
        '  /resource:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Resource \'\/resource\' already exists/).and.notify(done);
    });
  });
//
  describe('in method names', function () {

    //FIXTEST error message changed
    it('should fail if there are repeated methods in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource1:',
        '  post:',
        '  get:',
        '  head:',
        '  get:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Method \'get\' already exists/).and.notify(done);
    });

    //FIXTEST error message changed
    it('should fail if there are repeated methods in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '      get:',
        '      head:',
        '      get:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Method \'get\' already exists/).and.notify(done);
    });

    //FIXTEST error message changed
    it('should fail if there are repeated methods in a resource type first declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '      get?:',
        '      head:',
        '      get:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Method \'get\' already exists/).and.notify(done);
    });

    //FIXTEST error message changed
    it('should fail if there are repeated methods in a resource type second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '      get:',
        '      head:',
        '      get?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Method \'get\' already exists/).and.notify(done);
    });

    it('should fail if there are repeated methods in a resource type both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '      get?:',
        '      head:',
        '      get?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Method \'get\' already exists/).and.notify(done);
    });

    //it('should fail if there are repeated methods in a resource type both declarations parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'resourceTypes:',
    //    '  - type1:',
    //    '      post:',
    //    '      <<retieveMethodName>>:',
    //    '      head:',
    //    '      <<retieveMethodName>>:'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/property already used: '<<retieveMethodName>>'/).and.notify(done);
    //});
  });
//
  describe('in a resource', function () {
    it('should fail if there are repeated properties in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource1:',
        '  description: Some description here',
        '  description: Some other description here'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'description'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      description: Some description here',
        '      description: Some other description here'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'description'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a resource type first declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      uriParameters?:',
        '      uriParameters:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'uriParameters'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a resource type second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      uriParameters:',
        '      uriParameters?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'uriParameters'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a resource type both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      uriParameters?:',
        '      uriParameters?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'uriParameters'/).and.notify(done);
    });
  });
//
  describe('in a method', function () {
    it('should fail if there are repeated properties in a method', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    body:',
        '    body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '      body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a trait first declararion optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body?:',
        '      body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a trait second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '      body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a trait both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body?:',
        '      body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a trait both declarations parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'traits:',
    //    '  - trait1:',
    //    '      <<propertyName>>:',
    //    '      <<propertyName>>:'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/property already used: '<<propertyName>>'/).and.notify(done);
    //});

    it('should fail if there are repeated properties in a method in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        body:',
        '        body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a method in a resource type first declararion optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        body?:',
        '        body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a method in a resource type second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        body:',
        '        body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a method in a resource type both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        body?:',
        '        body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a method in a resource type both declarations parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'resourceTypes:',
    //    '  - type1:',
    //    '      post:',
    //    '        <<propertyName>>:',
    //    '        <<propertyName>>:'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/property already used: '<<propertyName>>'/).and.notify(done);
    //});
  });
//
  describe('in response codes', function () {

    //FIXTEST error message
    it('should fail if there are repeated response codes in a method', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    responses:',
        '      200:',
        '      201:',
        '      209:',
        '      200:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200:',
        '        201:',
        '        209:',
        '        200:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a trait first declararion optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200?:',
        '        201:',
        '        209:',
        '        200:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a trait second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200:',
        '        201:',
        '        209:',
        '        200?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a trait both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200?:',
        '        201:',
        '        209:',
        '        200?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a trait both declarations parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        <<successCode>>:',
        '        201:',
        '        209:',
        '        <<successCode>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'<<successCode>>\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a method in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200:',
        '          201:',
        '          204:',
        '          200:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a method in a resource type first declararion optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200?:',
        '          201:',
        '          204:',
        '          200:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a method in a resource type second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200:',
        '          201:',
        '          204:',
        '          200?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a method in a resource type both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200?:',
        '          201:',
        '          204:',
        '          200?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'200\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated response codes in a method in a resource type both declarations parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          <<successCode>>:',
        '          201:',
        '          204:',
        '          <<successCode>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Response \'<<successCode>>\' already exists/).and.notify(done);
    });
  });
//
  describe('in responses', function () {
    it('should fail if there are repeated properties in a response in a method', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    responses:',
        '      200:',
        '        description: some description',
        '        description: some other description'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'description'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200?:',
        '          description: some description',
        '          description: some other description'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'description'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a trait first declararion optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200?:',
        '          body?:',
        '          body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a trait second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200?:',
        '          body:',
        '          body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a trait both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      responses?:',
        '        200?:',
        '          body?:',
        '          body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a response in a trait both declarations parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'traits:',
    //    '  - trait1:',
    //    '      responses?:',
    //    '        200?:',
    //    '          <<somePropertyName>>: some description',
    //    '          <<somePropertyName>>: some other description'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/property already used: '<<somePropertyName>>'/).and.notify(done);
    //});

    it('should fail if there are repeated properties in a response in a method in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200?:',
        '            description: some description',
        '            description: some other description'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'description'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a method in a resource type first declararion optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200?:',
        '            body?:',
        '            body:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a method in a resource type second declaration optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200?:',
        '            body:',
        '            body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a response in a method in a resource type both declarations optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      post:',
        '        responses?:',
        '          200?:',
        '            body?:',
        '            body?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'body'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a response in a method in a resource type both declarations parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'resourceTypes:',
    //    '  - type1:',
    //    '      post:',
    //    '        responses?:',
    //    '          200?:',
    //    '            <<someParam>>: some description',
    //    '            <<someParam>>: some other description'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/property already used: '<<someParam>>'/).and.notify(done);
    //});
  });
//
  describe('in query parameters', function () {

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a method', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    queryParameters:',
        '      param1:',
        '      param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters:',
        '        param1:',
        '        param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a trait first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters:',
        '        param1?:',
        '        param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a trait second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters:',
        '        param1:',
        '        param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a trait both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters:',
        '        param1?:',
        '        param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a trait both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters:',
        '        <<parameter>>:',
        '        <<parameter>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'<<parameter>>\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1:',
        '          param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a resource type first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1?:',
        '          param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a resource type second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1:',
        '          param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a resource type both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1?:',
        '          param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated query parameter names in a resource type both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get:',
        '        queryParameters:',
        '          <<parameter>>:',
        '          <<parameter>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Query parameter \'<<parameter>>\' already exists/).and.notify(done);
    });
  });
//
  describe('in URI parameters', function () {
    it('should fail if there are repeated properties in a URI parameter in a method', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    queryParameters:',
        '      param1:',
        '        type: string',
        '        type: integer'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters?:',
        '        param1?:',
        '          type: string',
        '          type: integer'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a trait first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters?:',
        '        param1?:',
        '          enum?: [ "value" ]',
        '          enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a trait second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters?:',
        '        param1?:',
        '          enum: [ "value" ]',
        '          enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a trait both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      queryParameters?:',
        '        param1?:',
        '          enum?: [ "value" ]',
        '          enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a URI parameter in a trait both parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'traits:',
    //    '  - trait1:',
    //    '      queryParameters?:',
    //    '        param1?:',
    //    '          <<someParameter>>: number',
    //    '          <<someParameter>>: string'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/parameter property already used: '<<someParameter>>'/).and.notify(done);
    //});

    it('should fail if there are repeated properties in a URI parameter in a resourceType', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1?:',
        '            enum: [ "value" ]',
        '            enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a resourceType first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1?:',
        '            enum?: [ "value" ]',
        '            enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a resourceType second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1?:',
        '            enum: [ "value" ]',
        '            enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a URI parameter in a resourceType both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        queryParameters?:',
        '          param1?:',
        '            enum?: [ "value" ]',
        '            enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a URI parameter in a resourceType both parameters', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'resourceTypes:',
    //    '  - type1:',
    //    '      get?:',
    //    '        queryParameters?:',
    //    '          param1?:',
    //    '            <<someParameter>>: number',
    //    '            <<someParameter>>: string'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/parameter property already used: '<<someParameter>>'/).and.notify(done);
    //});
  });
//
  describe('form parameters', function () {

    //FIXTEST error message
    it('should fail if there are repeated form parameter names in a method with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        '/resource:',
        '  get:',
        '    body:',
        '      formParameters:',
        '        param1:',
        '        param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a trait with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters:',
        '          param1:',
        '          param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a trait first optional with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters:',
        '          param1?:',
        '          param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a trait second optional with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters:',
        '          param1:',
        '          param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a trait both optional with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters:',
        '          param1?:',
        '          param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a trait both parameters with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters:',
        '          <<parameter>>:',
        '          <<parameter>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'<<parameter>>\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a resource type with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '          formParameters?:',
        '            param1:',
        '            param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a resource type first optional with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '          formParameters?:',
        '            param1?:',
        '            param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a resource type second optional with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '          formParameters?:',
        '            param1:',
        '            param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a resource type both optional with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '          formParameters?:',
        '            param1?:',
        '            param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST actually added default media type, otherwise the error was different. Changed erorr message.
    it('should fail if there are repeated form parameter names in a resource type both parameters with default Media Type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '          formParameters?:',
        '            <<parameter>>:',
        '            <<parameter>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'<<parameter>>\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a method with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    body:',
        '     application/json:',
        '      formParameters:',
        '        param1:',
        '        param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a trait with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/json:',
        '        formParameters:',
        '          param1:',
        '          param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a trait first optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/json:',
        '        formParameters:',
        '          param1?:',
        '          param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a trait second optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/json:',
        '        formParameters:',
        '          param1:',
        '          param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a trait both optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/json:',
        '        formParameters:',
        '          param1?:',
        '          param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a trait both parameters with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/json:',
        '        formParameters:',
        '          <<parameter>>:',
        '          <<parameter>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'<<parameter>>\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a resource type with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '         application/json:',
        '          formParameters?:',
        '            param1:',
        '            param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a resource type first optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '         application/json:',
        '          formParameters?:',
        '            param1?:',
        '            param1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a resource type second optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '         application/json:',
        '          formParameters?:',
        '            param1:',
        '            param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a resource type both optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '         application/json:',
        '          formParameters?:',
        '            param1?:',
        '            param1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'param1\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message.
    it('should fail if there are repeated form parameter names in a resource type both parameters with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body?:',
        '         application/json:',
        '          formParameters?:',
        '            <<parameter>>:',
        '            <<parameter>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Form parameter \'<<parameter>>\' already exists/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a method with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        '/resource:',
        '  get:',
        '    body:',
        '      formParameters:',
        '        param1:',
        '          type: number',
        '          type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a trait with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters?:',
        '          param1?:',
        '            type: number',
        '            type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a trait first optional with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters?:',
        '          param1?:',
        '            enum?: [ "value" ]',
        '            enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a trait second optional with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters?:',
        '          param1?:',
        '            enum: [ "value" ]',
        '            enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a trait both optional with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '        formParameters?:',
        '          param1?:',
        '            enum?: [ "value" ]',
        '            enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a form parameter in a trait both parameters with default media type', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'mediaType: application/json',
    //    'traits:',
    //    '  - trait1:',
    //    '      body:',
    //    '        formParameters?:',
    //    '          param1?:',
    //    '            <<someParameter>>: number',
    //    '            <<someParameter>>: string'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/parameter property already used: '<<someParameter>>'/).and.notify(done);
    //});

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a resourceType with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '          formParameters?:',
        '            param1?:',
        '              type: number',
        '              type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a resourceType first optional with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '          formParameters?:',
        '            param1?:',
        '              enum?: [ "value" ]',
        '              enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a resourceType second optional with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '          formParameters?:',
        '            param1?:',
        '              enum: [ "value" ]',
        '              enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a form parameter in a resourceType both optional with default media type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '          formParameters?:',
        '            param1?:',
        '              enum?: [ "value" ]',
        '              enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a form parameter in a resourceType both parameters with default media type', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'mediaType: application/json',
    //    'resourceTypes:',
    //    '  - type1:',
    //    '      get?:',
    //    '        body:',
    //    '          formParameters?:',
    //    '            param1?:',
    //    '              <<someParameter>>: number',
    //    '              <<someParameter>>: string'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/parameter property already used: '<<someParameter>>'/).and.notify(done);
    //});

    it('should fail if there are repeated properties in a form parameter in a method with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    body:',
        '     application/x-www-form-urlencoded:',
        '      formParameters:',
        '        param1:',
        '          type: number',
        '          type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a trait with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded:',
        '        formParameters?:',
        '          param1?:',
        '            type: number',
        '            type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a trait first optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded:',
        '        formParameters?:',
        '          param1?:',
        '            enum?: [ "value" ]',
        '            enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a trait second optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded:',
        '        formParameters?:',
        '          param1?:',
        '            enum: [ "value" ]',
        '            enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a trait both optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded:',
        '        formParameters?:',
        '          param1?:',
        '            enum?: [ "value" ]',
        '            enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a form parameter in a trait both parameters with content type', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'traits:',
    //    '  - trait1:',
    //    '      body:',
    //    '       application/x-www-form-urlencoded:',
    //    '        formParameters?:',
    //    '          param1?:',
    //    '            <<someParameter>>: number',
    //    '            <<someParameter>>: string'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/parameter property already used: '<<someParameter>>'/).and.notify(done);
    //});

    it('should fail if there are repeated properties in a form parameter in a resourceType with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded:',
        '          formParameters?:',
        '            param1?:',
        '              type: number',
        '              type: string'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'type'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a resourceType first optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded:',
        '          formParameters?:',
        '            param1?:',
        '              enum?: [ "value" ]',
        '              enum: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a resourceType second optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded:',
        '          formParameters?:',
        '            param1?:',
        '              enum: [ "value" ]',
        '              enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    it('should fail if there are repeated properties in a form parameter in a resourceType both optional with content type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded:',
        '          formParameters?:',
        '            param1?:',
        '              enum?: [ "value" ]',
        '              enum?: [ "value" ]'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/parameter property already used: 'enum'/).and.notify(done);
    });

    //it('should fail if there are repeated properties in a form parameter in a resourceType both parameters with content type', function (done) {
    //  var definition = [
    //    '#%RAML 0.8',
    //    '---',
    //    'title: Test',
    //    'resourceTypes:',
    //    '  - type1:',
    //    '      get?:',
    //    '        body:',
    //    '         application/x-www-form-urlencoded:',
    //    '          formParameters?:',
    //    '            param1?:',
    //    '              <<someParameter>>: number',
    //    '              <<someParameter>>: string'
    //  ].join('\n');
    //
    //  raml.load(definition).should.be.rejectedWith(/parameter property already used: '<<someParameter>>'/).and.notify(done);
    //});
  });
//
  describe('in content types', function () {

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    body:',
        '      application/x-www-form-urlencoded:',
        '      application/x-www-form-urlencoded:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded:',
        '         application/x-www-form-urlencoded:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a resource type first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded?:',
        '         application/x-www-form-urlencoded:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a resource type second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded:',
        '         application/x-www-form-urlencoded?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a resource type both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         application/x-www-form-urlencoded?:',
        '         application/x-www-form-urlencoded?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a resource type both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         <<someContentType>>:',
        '         <<someContentType>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'<<someContentType>>\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded:',
        '       application/x-www-form-urlencoded:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a trait first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded?:',
        '       application/x-www-form-urlencoded:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a trait second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded:',
        '       application/x-www-form-urlencoded?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a trait both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       application/x-www-form-urlencoded?:',
        '       application/x-www-form-urlencoded?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'application\/x-www-form-urlencoded\' already exists/).and.notify(done);
    });

    //FIXTEST changed error message
    it('should fail if there are repeated content types in a body in a trait both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       <<someContentType>>:',
        '       <<someContentType>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'<<someContentType>>\' already exists/).and.notify(done);
    });
  });
//
  describe('in body properties', function () {

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a resource', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        '/resource:',
        '  get:',
        '    body:',
        '      schema:',
        '      schema:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'schema'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         formParameters:',
        '         formParameters:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a resource type first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         formParameters?:',
        '         formParameters:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a resource type second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         formParameters:',
        '         formParameters?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters'/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a resource type both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         formParameters?:',
        '         formParameters?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters'/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated properties in a body in a resource type both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        body:',
        '         <<someContentType>>:',
        '         <<someContentType>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'<<someContentType>>\' already exists/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '       schema:',
        '       schema:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'schema/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a trait first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '       formParameters?:',
        '       formParameters:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a trait second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '       formParameters:',
        '       formParameters?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters/).and.notify(done);
    });

    //FIXTEST added default media type, otherwise the error differs
    it('should fail if there are repeated properties in a body in a trait both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'mediaType: application/json',
        'traits:',
        '  - trait1:',
        '      body:',
        '       formParameters?:',
        '       formParameters?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/property already used: 'formParameters/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated properties in a body in a trait both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      body:',
        '       <<someContentType>>:',
        '       <<someContentType>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Body \'<<someContentType>>\' already exists/).and.notify(done);
    });
  });
//
  describe('in header', function () {

    //FIXTEST error message
    it('should fail if there are repeated header names in a method', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        '/resource:',
        '  get:',
        '    headers:',
        '      header1:',
        '      header1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a trait', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      headers:',
        '        header1:',
        '        header1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a trait first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      headers:',
        '        header1?:',
        '        header1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a trait second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      headers:',
        '        header1:',
        '        header1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a trait both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      headers:',
        '        header1?:',
        '        header1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a trait both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'traits:',
        '  - trait1:',
        '      headers:',
        '        <<headerName>>:',
        '        <<headerName>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'<<headerName>>\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a resource type', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        headers?:',
        '          header1:',
        '          header1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a resource type first optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        headers?:',
        '          header1?:',
        '          header1:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a resource type second optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        headers?:',
        '          header1:',
        '          header1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a resource type both optional', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get?:',
        '        headers?:',
        '          header1?:',
        '          header1?:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'header1\' already exists/).and.notify(done);
    });

    //FIXTEST error message
    it('should fail if there are repeated header names in a resource type both parameters', function (done) {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test',
        'resourceTypes:',
        '  - type1:',
        '      get:',
        '        headers?:',
        '          <<headerName>>:',
        '          <<headerName>>:'
      ].join('\n');

      raml.load(definition).should.be.rejectedWith(/Header \'<<headerName>>\' already exists/).and.notify(done);
    });
  });
});
