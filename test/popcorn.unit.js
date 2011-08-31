module("Popcorn API");
test("API", function () {

  var expects = 4,
      count = 0;

  expect(expects);

  function plus(){ if ( ++count == expects ) start(); }

  stop( 10000 );


  try {

    ok( Popcorn, "Popcorn exists");
    plus();

  } catch (e) {};


  try {

    ok( typeof Popcorn === "function", "Popcorn is a function");
    plus();

  } catch (e) {};

  try {

    equals( Setup.getGlobalSize(), Setup.globalSize + 1 , "Popcorn API creates only 1 global reference");
    plus();

  } catch (e) {};


  try {

    Popcorn(function() {

      ok(1, "Popcorn calls its function argument");
      plus();


    });

  } catch (e) {};


});

test("Popcorn.* Static Methods", function () {

  var statics = [ "forEach", "extend", "error", "guid", "sizeOf", "nop",
                  "addTrackEvent", "removeTrackEvent", "getTrackEvents", "getTrackEvent", "position", "disable", "enable" ],
    substatics = [ "addTrackEvent", "removeTrackEvent", "getTrackEvents", "getTrackEvent"];

  expect(statics.length + substatics.length);

  statics.forEach(function(val, idx) {

    equals( typeof Popcorn[val], "function" , "Popcorn."+val+"() is a provided static function");

  });

  substatics.forEach(function(val, idx) {

    equals( typeof Popcorn[val].ref, "function" , "Popcorn."+val+".ref() is a private use static function");

  });
});

test("Popcorn.forEach", function() {

  expect(3);

  var count = 0,
    nodelist = document.querySelectorAll("div[id^='qunit-']"),
    array = [ 1, 2 ],
    object = { a: "1", b: "2" };

  Popcorn.forEach( nodelist, function() {
    count++;
  });

  equal(count, nodelist.length, nodelist.length + " elements in NodeList");
  count = 0;

  Popcorn.forEach( array, function() {
    count++;
  });

  equal(count, array.length, array.length + " items in Array");
  count = 0;

  Popcorn.forEach( object, function() {
    count++;
  });

  equal(count, Popcorn.sizeOf(object), Popcorn.sizeOf(object) + " properties in object");
});

test("Popcorn.util.toSeconds" , function () {
  var framerate = 24,
      storedStartTime,
      storedEndTime,
      areEquivalent,
      currentPeriod,
      startTimeStr,
      endTimeStr,
      message;

  //Time period data
  //The correct times that specify frame are calculated with a framerate of
  //24fps. Quotation is mixes (single and double) for testing purposes.
  var timePeriods = [
    { //Testing double quotes
      start: "01.234",
      end: "4.003",
      correctStartTime: 1.234,
      correctEndTime: 4.003
    },
    { //Tesing actual numbers
      start: 5.333,
      end: 6,
      correctStartTime: 5.333,
      correctEndTime: 6.000
    },
    { //Testing times in different data types (number and string)
      start: 6.004,
      end: "6.78",
      correctStartTime: 6.004,
      correctEndTime: 6.780
    },
    { //Testing times in different data types (string and number)
      start: "8.090",
      end: 9.11111111,
      correctStartTime: 8.090,
      correctEndTime: 9.11111111
    },
    { //Testing double quotes
      start: "10;4",
      end: "10;17",
      correctStartTime: 10.1666,
      correctEndTime: 10.7083
    },
    { //Testing single quotes
      start: '12;1',
      end: '13;2',
      correctStartTime: 12.0416,
      correctEndTime: 13.0833
    },
    { //Testing mixed quotes
      start: "20;11",
      end: '23;17',
      correctStartTime: 20.4583,
      correctEndTime: 23.7083
    },
    { //Testing mixed quotes
      start: '27;7',
      end: "27;22",
      correctStartTime: 27.2916,
      correctEndTime: 27.9166
    },
    { //Testing double quotes
      start: "12:04;12",
      end: "22:59;23",
      correctStartTime: 724.5,
      correctEndTime: 1379.9583
    },
    { //Testing single quotes
      start: '1:48:27;9',
      end: '3:23:15;1',
      correctStartTime: 6507.375,
      correctEndTime: 12195.0416
    },
    { //Testing mixed quotes
      start: '12:56;7',
      end: "2:02:42;8",
      correctStartTime: 776.2916,
      correctEndTime: 7362.3333
    }
  ];

  var equivalentTimes = function ( testedTime, correctTime ) {
    var tolerance = 0.0001;
    return ( testedTime < ( correctTime + tolerance ) ) &&
           ( testedTime > ( correctTime - tolerance ) );
  };

  var logMessage = function ( timeStr, correctTime, incorrectTime ) {
    return "Time stored in seconds for '" + timeStr +
           "' should be " + correctTime +
           ". Time stored was " + incorrectTime ;
  };

  for ( var periodsIdx = 0, timPeriodsLength = timePeriods.length; periodsIdx < timPeriodsLength; periodsIdx++ ) {
    currentPeriod = timePeriods[ periodsIdx ];
    startTimeStr = currentPeriod.start;
    endTimeStr = currentPeriod.end;

    storedStartTime = Popcorn.util.toSeconds( startTimeStr, framerate );
    storedEndTime = Popcorn.util.toSeconds( endTimeStr, framerate );

    message = logMessage(
      startTimeStr,
      currentPeriod.correctStartTime,
      storedStartTime
    );

    areEquivalent = equivalentTimes( storedStartTime, currentPeriod.correctStartTime );
    equals( areEquivalent, true, message );

    message = logMessage(
      endTimeStr,
      currentPeriod.correctEndTime,
      storedEndTime
    );

    areEquivalent = equivalentTimes( storedEndTime, currentPeriod.correctEndTime ) ;
    equals( areEquivalent, true, message );
  }
});

test("Instances", function() {
  var expects = 11,
      count   = 0,
      instance;

  expect(expects);

  function plus(){
    if ( ++count == expects ) {
      start();
    }
  }

  stop();

  Popcorn("#video");

  ok( typeof Popcorn.addInstance === "function" , "Popcorn.addInstance is a provided static function");
  plus();

  ok( typeof Popcorn.removeInstance === "function" , "Popcorn.removeInstance is a provided static function");
  plus();

  ok( typeof Popcorn.getInstanceById === "function" , "Popcorn.getInstanceById is a provided static function");
  plus();

  ok( typeof Popcorn.removeInstanceById === "function" , "Popcorn.removeInstanceById is a provided static function");
  plus();

  ok( typeof Popcorn.instanceIds === "object" , "Popcorn.instanceIds is a provided cache object");
  plus();

  ok( "length" in Popcorn.instances && "join" in Popcorn.instances, "Popcorn.instances is a provided cache array");
  plus();

  instance = Popcorn.getInstanceById("video");

  ok( instance.video, "Stored instance as a `video` property" );
  plus();

  ok( instance.data, "Stored instance as a `data` property" );
  plus();

  ok( instance instanceof Popcorn, "Instance instanceof Popcorn" );
  plus();

  equal( Popcorn.instances.length, 2, "There are the correct number of Popcorn instances" );
  plus();

  //  Create another instance
  Popcorn("#video");

  //  Get a reference to remove
  var remove = Popcorn.instances[1];

  //  Remove and check the length of the currently cached instances
  equal( Popcorn.removeInstanceById( remove.id ).length, 2, "Removing an instance by id: 1 instance remains" );
  plus();
});

test("guid", function () {

  expect(6);

  var count = 3,
      guids = [],
      temp;

  for ( var i = 0; i < count; i++ ) {

    temp = Popcorn.guid();

    if ( i > 0 ) {
      notEqual( temp, guids[ guids.length - 1 ], "Current guid does not equal last guid" );
    } else {
      ok( temp, "Popcorn.guid() returns value" );
    }

    guids.push(temp);
  }

  guids = [];

  for ( var i = 0; i < count; i++ ) {

    temp = Popcorn.guid( "pre" );

    if ( i > 0 ) {
      notEqual( temp, guids[ guids.length - 1 ], "Current guid does not equal last guid" );
    } else {
      ok( temp, "Popcorn.guid( 'pre' ) returns value" );
    }

    guids.push(temp);
  }

});
test("isArray", function() {

  expect(18);

  var empty = [],
      fastSmall = [1],
      slow = [],
      slowSmall = [],
      all = null;

  slowSmall[999999] = 0;
  slowSmall.length = 0;
  slow.slow = 0;

  all = [ [], [1], new Array, Array(0),'abc'.match(/(a)/g), slow, slowSmall ];

  all.forEach(function( a ) {
    ok( Popcorn.isArray(a), "Popcorn.isArray("+JSON.stringify(a)+")" );
  });

  equal( Popcorn.isArray.length, 1, "Popcorn.isArray.length, 1" );

  ok( !Popcorn.isArray(), "!Popcorn.isArray(), false");
  ok( !Popcorn.isArray({}), "!Popcorn.isArray({}), false");
  ok( !Popcorn.isArray(null), "!Popcorn.isArray(null), false");
  ok( !Popcorn.isArray(undefined), "!Popcorn.isArray(undefined)");
  ok( !Popcorn.isArray(17), "!Popcorn.isArray(17), false");
  ok( !Popcorn.isArray("Array"), "!Popcorn.isArray('Array'), false");
  ok( !Popcorn.isArray(Math.PI), "!Popcorn.isArray(Math.PI), false");
  ok( !Popcorn.isArray(true), "!Popcorn.isArray(true), false");
  ok( !Popcorn.isArray(false), "!Popcorn.isArray(false), false");
  ok( !Popcorn.isArray( {__proto__: Array.prototype, length:1, 0:1, 1:2} ), "{__proto__: Array.prototype, length:1, 0:1, 1:2}");
});


test("Protected", function () {

  expect(1);
  //  TODO: comprehensive tests for these utilities

  ok( !!Popcorn.protect , "Popcorn.protect exists");


});

test("Protected from removal", function () {

  expect( Popcorn.protect.natives.length * 2 );

  Popcorn.protect.natives.forEach(function( name ) {

    try {
      Popcorn.plugin( name );
    } catch( e ) {
      ok( true, e.message + " and cannot be used as a plugin name" );
    }

    try {
      Popcorn.removePlugin( name );
    } catch( e ) {
      ok( true, e.message + " and cannot be removed with this API" );
    }
  });
});



test( "Object", function () {

  var popped = Popcorn( "#video" ),
      popObj = Popcorn( document.getElementById( "video" ) ),
      methods = "load play pause currentTime mute volume roundTime exec removePlugin duration " +
                "preload playbackRate autoplay loop controls volume muted buffered readyState seeking paused played seekable ended",
      count = 0,
      expects = 60;

  expect( expects );

  function plus() {

    if ( ++count === expects ) {

      start();
    }
  }

  stop( 10000 );

  // testing element passed by id
  ok( "video" in popped, "instance by id has `video` property" );
  plus();
  equal( Object.prototype.toString.call( popped.video ), "[object HTMLVideoElement]", "instance by id video property is a HTMLVideoElement" );
  plus();

  ok( "data" in popped, "instance by id has `data` property" );
  plus();
  equal( Object.prototype.toString.call( popped.data ), "[object Object]", "instance by id data property is an object" );
  plus();

  ok( "trackEvents" in popped.data, "instance by id has `trackEvents` property" );
  plus();
  equal( Object.prototype.toString.call( popped.data.trackEvents ), "[object Object]", "instance by id trackEvents property is an object" );
  plus();

  popped.play();

  methods.split( /\s+/g ).forEach(function ( k,v ) {

    ok( k in popped, "instance by id has method: " + k );
    plus();
  });

  // testing element passed by reference
  ok( "video" in popObj, "instance by reference has `video` property" );
  plus();
  equal( Object.prototype.toString.call( popObj.video ), "[object HTMLVideoElement]", "instance by reference video property is a HTMLVideoElement" );
  plus();

  ok( "data" in popObj, "instance by reference has `data` property" );
  plus();
  equal( Object.prototype.toString.call( popObj.data ), "[object Object]", "instance by reference data property is an object" );
  plus();

  ok( "trackEvents" in popObj.data, "instance by reference has `trackEvents` property" );
  plus();
  equal( Object.prototype.toString.call( popObj.data.trackEvents ), "[object Object]", "instance by reference trackEvents property is an object" );
  plus();

  popObj.play();

  methods.split( /\s+/g ).forEach(function ( k,v ) {

    ok( k in popObj, "instance by reference has method: " + k );
    plus();
  });
});

module("Popcorn Static");

test("Popcorn.[addTrackEvent | removeTrackEvent].ref()", function() {

  expect(2);

  var popped = Popcorn("#video");

  // Calling exec() will create tracks and added them to the
  // trackreference internally
  popped.exec( 1, function() { /* ... */ });
  popped.exec( 3, function() { /* ... */ });
  popped.exec( 5, function() { /* ... */ });

  equal( Popcorn.sizeOf( popped.data.trackRefs ), 3, "There are 3 trackRefs in popped.data.trackRefs" );

  Popcorn.forEach( popped.data.trackRefs, function( ref, key ) {
    popped.removeTrackEvent( key );
  });

  equal( Popcorn.sizeOf( popped.data.trackRefs ), 0, "There are 0 trackRefs in popped.data.trackRefs" );

  //Popcorn.removeInstance( popped );
});



module("Popcorn Prototype Methods");



test("roundTime", function () {

  QUnit.reset();

  var popped = Popcorn("#video");

  popped.play().pause().currentTime( 0.98 );

  equals( 1, popped.roundTime(), ".roundTime() returns 1 when currentTime is 0.98s" );


});


test("exec", function () {

  QUnit.reset();

  var popped = Popcorn("#video"),
      expects = 2,
      count = 0,
      hasLooped = false,
      loop = 0;

  expect( expects + 1 );

  function plus(){
    if ( ++count == expects ) {

      setTimeout( function() {

        equals( loop, expects, "exec callback repeat check, only called twice" );
        Popcorn.removePlugin( popped, "exec" );
        start();

      }, 1000 );
    }
  }

  stop( 10000 );

  popped.exec( 4, function () {
    ok( loop < 2, "exec callback fired " + ++loop );
    plus();

    if ( !hasLooped ) {

      popped.currentTime(3).play();

      hasLooped = true;
    }
  }).currentTime(3).play();

});

test("mute", function () {

  var video = Popcorn("#video"),
      audio = Popcorn("#audio"),
      expects = 4,
      count = 0;

  expect( expects );

  function plus(){
    if ( ++count == expects ) {
      start();
    }
  }

  stop();


  video.listen("muted", function() {

    equal( this.media.muted, true, "Video `muted` attribute is true when muted" );
    plus();

    this.unmute();

  }).listen("unmuted", function() {

    equal( this.media.muted, false, "Video `muted` attribute is false when unmuted" );
    plus();

  });

  audio.listen("muted", function() {

    equal( this.media.muted, true, "Audio `muted` attribute is true when muted" );
    plus();

    this.unmute();

  }).listen("unmuted", function() {

    equal( this.media.muted, false, "Audio `muted` attribute is false when unmuted" );
    plus();

  });


  video.mute();
  audio.mute();

});


module("Popcorn Static Methods");

test( "Popcorn.extend", function () {

  QUnit.reset();

  expect( 12 );

  var dest = {},
      obj1 = {
        "key11" : "value",
        "key12" : 9001,
        "key13" : function() { return true; }
      },
      obj2 = {
        "key21" : "String",
        "key22" : 9002,
        "key23" : function() { return false; }
      },
      prop;

  Popcorn.extend( dest, obj1 );

  for ( prop in obj1 ) {
    equal( dest.hasOwnProperty( prop ), true, "{dest} has property: " + prop );
  }

  equal( typeof dest[ "key13" ], "function", "dest[key13] is a function" );

  dest = {};

  Popcorn.extend( dest, obj1, obj2 );

  for ( prop in obj1 ) {
    equal( dest.hasOwnProperty( prop ), true, "{dest} has property: " + prop + ", when extending 2 objects" );
  }

  for ( prop in obj2 ) {
    equal( dest.hasOwnProperty( prop ), true, "{dest} has property: " + prop + ", when extending 2 objects" );
  }

  equal( typeof dest[ "key13" ], "function","dest[key13] is a function" );

  equal( typeof dest[ "key23" ], "function","dest[key23] is a function" );

});

test( "Popcorn.events", function() {

  QUnit.reset()
  expect( 43 );

  var eventTypes = [ "UIEvents", "MouseEvents", "Events" ],
      natives = "",
      events,
      eventsReturned,
      idx = 0,
      len,
      okay = true;

  eventTypes.forEach (function( e ) {
    ok( Popcorn.Events[ e ], e + " Exists")
  });

  natives = Popcorn.Events[ eventTypes[ 0 ] ] + " " + Popcorn.Events[ eventTypes[ 1 ] ] + " " + Popcorn.Events[ eventTypes[ 2 ] ];
  events = natives.split( /\s+/g );
  eventsReturned = Popcorn.events.all;
  len = events.length;

  for ( ; idx++ < len && okay; ) {
    okay = events[ idx ] === eventsReturned[ idx ];
  }

  ok( okay, "Native events are correctly being handled" );

  equals( typeof Popcorn.Events.Natives, "string", "Popcorn.Events.Natives is a string" );
  equals( typeof Popcorn.events, "object", "Popcorn.events is an object" );

  Popcorn.forEach( eventsReturned, function ( e ) {
    ok( Popcorn.events.isNative ( e ), e + " is a native event" );
  });

});

test("Popcorn.events.hooks", function() {

  expect(1);

  ok( Popcorn.events.hooks, "Popcorn.events.hooks exists" );

});

test("Popcorn.events.hooks: canplayall", function() {
  //qunit-fixture

  var expects = 1,
    count = 0,
    fired = 0;

  expect(expects);

  function plus(){
    if ( ++count == expects ) {
      start();
    }
  }

  stop( 20000 );

  var video = document.createElement("video"),
    sources = {
      mp4: document.createElement("source"),
      ogv: document.createElement("source"),
      webm: document.createElement("source")
    },
    url = "http://videos.mozilla.org/serv/webmademovies/popcornplug.";

  video.id = "event-fixture";
  video.controls = true;
  video.autoplay = true;
  video.preload = "auto";


  Popcorn.forEach( sources, function( source, type ) {
    source.src = url + type;
    video.appendChild( source );
  });

  document.getElementById("qunit-fixture").appendChild( video );

  var $pop = Popcorn("#event-fixture");

  $pop.listen("canplayall", function( event ) {
    equal( ++fired, 1, "canplayall is fired only once" );
    plus();
  });

  $pop.listen("canplaythrough", function( event ) {
    // this should trigger re-fires of the original event
    this.currentTime(0);
  });
});

test("Popcorn.events.hooks: canplayall fires immediately if ready", function() {
  //qunit-fixture

  var $pop = Popcorn("#video"),
    expects = 1,
    count = 0,
    fired = 0;

  expect(expects);

  function plus(){
    if ( ++count == expects ) {
      start();
    }
  }

  stop( 20000 );

  function poll() {
    if ( $pop.media.readyState >= 2 ) {
      // this should trigger immediately
      $pop.listen("canplayall", function( event ) {
        equal( ++fired, 1, "canplayall is fired immediately if readyState permits" );
        plus();
      });
    } else {
      setTimeout( poll, 10 );
    }
  }

  poll();
});

/*
<video height="180" width="300" id="video" controls>
<source src="http://videos.mozilla.org/serv/webmademovies/popcornplug.mp4"></source>
<source src="http://videos.mozilla.org/serv/webmademovies/popcornplug.ogv"></source>
<source src="http://videos.mozilla.org/serv/webmademovies/popcornplug.webm"></source>
</video>

*/
module("Popcorn Locale");

test( "Popcorn.locale object", function() {

  var api = {
    get: "function",
    set: "function",
    broadcast: "function"
  },
  locale = navigator.language,
  parts = locale.split("-"),

  stub = {
    iso6391: locale,
    language: parts[ 0 ],
    region: parts[ 1 ]
  },
  $pop = Popcorn("#video"),
  expects = 18,
  count = 0;

  expect( expects );

  function plus() {
    if ( ++count == expects ) {
      start();
      Popcorn.removeInstance( $pop );
    }
  }

  stop( 10000 );

  ok( Popcorn.locale, "Popcorn.locale exists");
  plus();

  equal( typeof Popcorn.locale, "object", "Popcorn.locale is an object");
  plus();

  Popcorn.forEach( api, function( type, method ) {
    ok( Popcorn.locale[ method ], "Popcorn.locale." + method + "() exists" );
    plus();
    equal( typeof Popcorn.locale[ method ], type, "Popcorn.locale." + method + "() is a " + type );
    plus();
  });

  deepEqual( Popcorn.locale.get(), stub, "Popcorn.locale.get() === navigator.language (" +  JSON.stringify(stub) +  ") whenever possible" );
  plus();

  Popcorn.forEach( Popcorn.locale.get(), function( val, prop ) {
    equal( val, stub[ prop ], "Popcorn.locale.get() locale matches stub" );
    plus();
  });


  locale = "fr-CA";

  // Setup "locale:changed" event listener
  $pop.listen( "locale:changed", function() {

    var parts = locale.split( "-" ),
    stub = {
      iso6391: locale,
      language: parts[ 0 ],
      region: parts[ 1 ]
    };


    Popcorn.forEach( Popcorn.locale.get(), function( val, prop ) {
      equal( val, stub[ prop ], "Popcorn.locale.set() -> get() locale matches updated stub" );
      plus();
    });


    if ( locale === "fr-CA" ) {
      locale = "en-CA";

      // Change locale, trigger "locale:changed" event
      Popcorn.locale.set( "en-CA" );
    }

  });

  // Change locale, trigger "locale:changed" event
  Popcorn.locale.set( "fr-CA" );



});


module("Popcorn Position");
test("position", function () {

  expect(25);

  var $absolute = $(".absolute"),
      $relative = $(".relative"),
      $fixed = $(".fixed"),
      $static = $(".static"),
      tests;

  $("#position-tests").show();
//  console.log( $absolute );
//  console.log( $fixed );
//  console.log( $relative );
//  console.log( $static );

  tests = [
    { id: "absolute-1",     top:  0, left:  0 },
    { id: "absolute-1-1",   top:  1, left:  1 },
    { id: "absolute-1-1-1", top:  2, left:  2 },
    { id: "absolute-2",     top: 19, left: 19 }
  ];

  Popcorn.forEach( tests, function( test ) {
    equals( Popcorn( "#vid-" + test.id ).position().top,  test.top,  "Popcorn('#vid-" + test.id + "').position().top" );
    equals( Popcorn( "#vid-" + test.id ).position().left, test.left, "Popcorn('#vid-" + test.id + "').position().left" );
  });

  tests = [
    { id: "relative-1", top:   0, left:  0 },
    { id: "relative-2", top: 120, left: 20 }
  ];

  Popcorn.forEach( tests, function( test ) {
    equals( Popcorn( "#vid-" + test.id ).position().top,  test.top,  "Popcorn('#vid-" + test.id + "').position().top" );
    equals( Popcorn( "#vid-" + test.id ).position().left, test.left, "Popcorn('#vid-" + test.id + "').position().left" );
  });

  tests = [
    { id: "fixed-1", top:  0, left:  0 },
    { id: "fixed-2", top: 20, left: 20 }
  ];

  Popcorn.forEach( tests, function( test ) {
    equals( Popcorn( "#vid-" + test.id ).position().top,  test.top,  "Popcorn('#vid-" + test.id + "').position().top" );
    equals( Popcorn( "#vid-" + test.id ).position().left, test.left, "Popcorn('#vid-" + test.id + "').position().left" );
  });

  tests = [
    { id: "static-1",     top:  200, left:  0 },
    { id: "static-1-1",   top:  0, left:  0 },
    { id: "static-1-1-1", top:  0, left:  0 },
    { id: "static-2",     top: 300, left: 0 }
  ];

  Popcorn.forEach( tests, function( test ) {
    equals( Popcorn( "#vid-" + test.id ).position().top,  test.top,  "Popcorn('#vid-" + test.id + "').position().top" );
    equals( Popcorn( "#vid-" + test.id ).position().left, test.left, "Popcorn('#vid-" + test.id + "').position().left" );
  });

  try {
    ok( Popcorn( "#audio" ).position(), "position called from audio" );
  } catch( e ) {
    ok( false, e );
  }

  $("#position-tests").hide();
});

test("position called from plugin", function () {

  var $pop = Popcorn("#video"),
      expects = 3,
      count = 0;

  expect( expects );

  function plus(){
    if ( ++count == expects ) {
      start();
      Popcorn.removePlugin("positionPlugin");
      delete Popcorn.manifest.positionPlugin;
    }
  }

  stop( 10000 );

  Popcorn.plugin( "positionPlugin" , function(){
    return {
      _setup: function( options ) {
        ok( "position" in this, "this.position() avaliable in _setup");
        plus();
      },
      start: function(event, options){

        ok( "position" in this, "this.position() avaliable in start");
        plus();
      },
      end: function(event, options){
        ok( "position" in this, "this.position() avaliable in end");
        plus();
      }
    };
  });

  $pop.positionPlugin({
    start: 0,
    end: 1
  }).currentTime(0).play();
});

module("Popcorn Events");

test("Can Detect Native event types", function() {

  var tests = [ "play", "pause", "rough loade", "data seek" ],
      expects = [ true, true, false, false ];

  expect( tests.length );

  tests.forEach(function( type, idx ) {
    equal( Popcorn.events.isNative( type ), expects[ idx ], type + ( expects[ idx ] ? " is " : " is not " ) + "a valid native event" );
  });
});

test("Determine event api interface", function() {

  var tests = [ "play", "pause", "click", "scroll", "rough loade", "data seek" ],
      expects = [ "Events", "Events", "MouseEvents", "UIEvents", false, false ];

  expect( tests.length );

  tests.forEach(function( type, idx ) {
    equal( Popcorn.events.getInterface( type ), expects[ idx ], type + ( expects[ idx ] ? " is " : " is not " ) + "a valid native event" );
  });
});

test("Stored By Type", function () {

  QUnit.reset();

  expect(6)

  var p = Popcorn("#video"),
      count = 0,
      fired = 0,
      wants = 4;

  function plus(){

    if ( ++count === 4 ) {

      equals( fired, wants, "Number of callbacks fired from 1 handler" );

      p.unlisten("play");

      ok( !p.data.events["play"], "play handlers removed" );

      start();
    }
  }

  stop( 10000 );


  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);
    plus();
  });

  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);
    plus();
  });

  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);
    plus();
  });

  p.listen("play", function () {
    fired++;

    ok(true, "Play fired " + fired);
    plus();
  });

  p.trigger("play");

  if (fired < 4) {
    start();
  }

  p.unlisten("play");

});


test("Simulated", function () {

  QUnit.reset();

  var p = Popcorn("#video"),
      completed = [];


  var expects = Setup.events.length,
      count = 0;

  expect(expects);

  function plus(){
    if ( ++count == expects ) start();
  }

  stop( 10000 );


  Setup.events.forEach(function ( name ) {
    p.listen( name, function (event) {

      if ( completed.indexOf(name) === -1 ) {
        ok( true, name + " fired" );
        plus();

        completed.push(name);
      }


    });
  });

  Setup.events.forEach(function ( name ) {
    p.trigger( name );
  });


});


test("Real", function () {

  QUnit.reset();

  var p = Popcorn("#video"),
      completed = [];


  var expects = 5,
      count = 0;


  function plus(){
    if ( ++count == expects ) start();
  }

  stop( 10000 );


  [ "play", "pause", "volumechange", "seeking", "seeked" ].forEach(function ( name ) {

    p.listen( name, function (event) {

      if ( completed.indexOf(name) === -1 ) {
        ok( true, name + " fired" );
        plus();

        completed.push(name);
      }


    });
  });



  p.pause();

  p.play();

  p.volume(0.9);

  p.currentTime(49);



});

test("Custom", function () {

  var expects = 1,
      count = 0;

  expect(expects);

  function plus(){ if ( ++count == expects ) start(); }

  stop( 10000 );

  var p = Popcorn("#video");


  p.listen("eventz0rz", function ( event ) {

    ok( true, "Custom event fired" );
    plus();

  });

  p.trigger("eventz0rz");



});


test("UI/Mouse", function () {

  var expects = 1,
      count = 0;

  expect(expects);

  function plus(){ if ( ++count == expects ) start(); }

  stop( 10000 );

  var p = Popcorn("#video");


  p.listen("click", function ( event ) {

    ok( true, "click event fired" );
    plus();

  });

  p.trigger("click");



});

module("Popcorn Plugin")
test("Manifest", function () {



  var p = Popcorn("#video"),
      expects = 5,
      run = 1,
      count   = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
      // clean up added events after tests
      Popcorn.removePlugin("footnote");
    }
  }

  stop( 10000 );
  Popcorn.plugin( "footnote" , function(){
    return {
      _setup: function( options ) {
        ok( options.target, "`options.target exists`" );
        plus();

        if ( run === 2 ) {
          equals( options.target, 'custom-target', "Uses custom target if one is specified" );
          plus();
        }

        if ( run === 1 ) {
          equals( options.target, 'text-container', "Uses manifest target by default" );
          plus();

          run++;
        }
      },
      start: function(event, options){
      },

      end: function(event, options){

      }

    };

  },
  {
    about:{
      name: "Popcorn Manifest Plugin",
      version: "0.0",
      author: "Rick Waldron",
      website: ""
    },
    options: {
      start   : { elem:'input', type:'text', label:'In' },
      end     : { elem:'input', type:'text', label:'Out' },
      text    : { elem:'input', type:'text', label:'Manifest Text' },
      target  : 'text-container'
    }
  });


  expect(expects);

  equal( Popcorn.sizeOf( Popcorn.manifest ), 1, "One manifest stored" );
  plus();

  // add more tests

  p.footnote({});

  p.footnote({
    target: "custom-target"
  });


});

test("Configurable Defaults", function () {

  var expects = 13,
      count   = 0;

  function plus() {
    if ( ++count === expects ) {
      start();


      ["configurable", "multiconfig", "overridden"].forEach(function( val ) {
        Popcorn.removePlugin( val );
        delete Popcorn.manifest[ val ];
      });
    }
  }

  stop();

  Popcorn.plugin( "configurable", function () {
    return {
      _setup: function( options ) {

        options.persistant = true;

        equal( options.target, "foo", 'options.target, "foo" in configurable _setup');
        plus();
      },
      start: function( event, options ) {

        ok( options.persistant, "options.persistant proves same object passed from _setup" );
        plus();
        // target: "foo"
        // text: "bar"
        // type: "thinger"
        equal( options.target, "foo", 'options.target, "foo" in configurable start');
        plus();
        equal( options.text, "bar", 'options.text, "bar" in configurable start');
        plus();
        equal( options.type, "thinger", 'options.type, "thinger" in configurable start');
        plus();
      },
      end: function( event, options ) {
        ok( true, "end fired");
        plus();
      }
    };
  },
  {
    about:{
      name: "Popcorn Configurable Plugin",
      version: "0.0",
      author: "Rick Waldron",
      website: ""
    },
    options: {
      target: "manifest"
    }
  });

  Popcorn.plugin( "multiconfig", function () {
    return {
      start: function( event, options ) {
        equal( options.target, "quux", 'options.target, "quux" in multiconfig start');
        plus();
      },
      end: function( event, options ) {
        ok( true, "end fired");
        plus();
      }
    };
  });

  Popcorn.plugin( "overridden", function () {
    return {
      _setup: function( options ) {
        equal( options.text, "hello!", 'options.text, overriden with "hello!" in overridden _setup');
        plus();

        equal( options.target, "custom", 'options.target, overriden with "custom" in overridden _setup');
        plus();
      },
      start: function( event, options ) {
        equal( options.text, "hello!", 'options.text, overriden with "hello!" in overridden start');
        plus();

        equal( options.target, "custom", 'options.target, overriden with "custom" in overridden start');
        plus();
      },
      end: function( event, options ) {
        ok( true, "end fired");
        plus();
      }
    };
  });

  var p = Popcorn("#video", {
            defaults: {
              overridden: {
                target: "default"
              }
            }
          });

  p.defaults( "configurable", {

    // set a default element target id
    target: "foo"

  }).defaults([
    {
      multiconfig: {
        target: "quux"
      }
    },
    {
      configurable: {
        text: "bar",
        type: "thinger"
      }
    }
  ]).configurable({

    // all calls will have:
    // target: "foo"
    // text: "bar"
    // type: "thinger"
    start: 3,
    end: 4

  }).multiconfig({

    // all calls will have:
    // target: "quux"
    start: 4,
    end: 5

  }).overridden({

    // has a default set
    // we need limitless overriding
    start: 4,
    end: 5,
    target: "custom",
    text: "hello!"

  }).currentTime( 2 ).play();

});

test("Start Zero Immediately", function () {

  var $pop = Popcorn("#video"),
      expects = 1,
      count   = 0;

  function plus() {
    if ( ++count === expects ) {
      // clean up added events after tests
      Popcorn.removePlugin("zero");
      start();
    }
  }

  stop();

  $pop.pause().currentTime( 0 );

  Popcorn.plugin( "zero", {
    start: function() {
      ok( true, "$pop.zero({ start:0, end: 2 }) ran without play()");
      plus();
    },
    end: function() {}
  });

  $pop.zero({
    start:0,
    end: 2
  });
});
test("Update Timer", function () {

  QUnit.reset();

  var p2 = Popcorn("#video"),
      expects = 12,
      count   = 0,
      execCount = 0,
      // These make sure events are only fired once
      // any second call will produce a failed test
      forwardStart  = false,
      forwardEnd    = false,
      backwardStart = false,
      backwardEnd   = false,
      wrapperRunning = { one: false, two: false, };

  function plus() {
    if ( ++count === expects ) {
      // clean up added events after tests
      Popcorn.removePlugin( "forwards" );
      Popcorn.removePlugin( "backwards" );
      Popcorn.removePlugin( "wrapper" );
      p2.removePlugin( "exec" );
      start();
    }
  }

  // These tests come close to 10 seconds on chrome, increasing to 15
  stop( 15000 );

  Popcorn.plugin( "forwards", function () {
    return {
      start: function ( event, options ) {

        if ( !options.startFired ) {

          options.startFired = true;
          forwardStart = !forwardStart;
          ok( forwardStart, "forward's start fired" );
          plus();
        }
      },
      end: function ( event, options ) {

        if ( !options.endFired ) {

          options.endFired = true;
          forwardEnd = !forwardEnd;
          p2.currentTime(1).play();
          ok( forwardEnd, "forward's end fired" );
          plus();
        }
      }
    };
  });

  p2.forwards({
    start: 3,
    end: 4
  });

  Popcorn.plugin( "backwards", function () {
    return {
      start: function ( event, options ) {

        if ( !options.startFired ) {

          options.startFired = true;
          backwardStart = !backwardStart;
          p2.currentTime(0).play();
          ok( true, "backward's start fired" );
          plus();
        }
      },
      end: function ( event, options ) {

        if ( !options.endFired ) {

          options.endFired = true;
          backwardEnd = !backwardEnd;
          ok( backwardEnd, "backward's end fired" );
          plus();
          p2.currentTime( 5 ).play();
        }
      }
    };
  });

  p2.backwards({
    start: 1,
    end: 2
  });

  Popcorn.plugin( "wrapper", {
    start: function ( event, options ) {

      wrapperRunning[ options.wrapper ] = true;
    },
    end: function ( event, options ) {

      wrapperRunning[ options.wrapper ] = false;
    }
  });

  // second instance of wrapper is wrapping the first
  p2.wrapper({
    start: 6,
    end: 7,
    wrapper: "one"
  })
  .wrapper({
    start: 5,
    end: 8,
    wrapper: "two"
  })
  // checking wrapper 2's start
  .exec( 5, function() {

    if ( execCount === 0 ) {

      execCount++;
      ok( wrapperRunning.two, "wrapper two is running at second 5" );
      plus();
      ok( !wrapperRunning.one, "wrapper one is stopped at second 5" );
      plus();
    }
  })
  // checking wrapper 1's start
  .exec( 6, function() {

    if ( execCount === 1 ) {

      execCount++;
      ok( wrapperRunning.two, "wrapper two is running at second 6" );
      plus();
      ok( wrapperRunning.one, "wrapper one is running at second 6" );
      plus();
    }
  })
  // checking wrapper 1's end
  .exec( 7, function() {

    if ( execCount === 2 ) {

      execCount++;
      ok( wrapperRunning.two, "wrapper two is running at second 7" );
      plus();
      ok( !wrapperRunning.one, "wrapper one is stopped at second 7" );
      plus();
    }
  })
  // checking wrapper 2's end
  .exec( 8, function() {

    if ( execCount === 3 ) {

      execCount++;
      ok( !wrapperRunning.two, "wrapper two is stopped at second 9" );
      plus();
      ok( !wrapperRunning.one, "wrapper one is stopped at second 9" );
      plus();
    }
  });

  p2.currentTime(3).play();

});

test("Plugin Factory", function () {

  QUnit.reset();

  var popped = Popcorn("#video"),
      methods = "load play pause currentTime mute volume roundTime exec removePlugin",
      expects = 34, // 15*2+2+2. executor/complicator each do 15
      count = 0;

  function plus() {
    if ( ++count == expects ) {
      Popcorn.removePlugin("executor");
      Popcorn.removePlugin("complicator");
      start();
    }
  }

  expect( expects );
  stop( 15000 );

  Popcorn.plugin("executor", function () {

    return {

      start: function () {
        var self = this;

        // These ensure that a popcorn instance is the value of `this` inside a plugin definition

        methods.split(/\s+/g).forEach(function (k,v) {
          ok( k in self, "executor instance has method: " + k );

          plus();
        });

        ok( "video" in this, "executor instance has `video` property" );
        plus();
        ok( Object.prototype.toString.call(popped.video) === "[object HTMLVideoElement]", "video property is a HTMLVideoElement" );
        plus();

        ok( "data" in this, "executor instance has `data` property" );
        plus();
        ok( Object.prototype.toString.call(popped.data) === "[object Object]", "data property is an object" );
        plus();

        ok( "trackEvents" in this.data, "executor instance has `trackEvents` property" );
        plus();
        ok( Object.prototype.toString.call(popped.data.trackEvents) === "[object Object]", "executor trackEvents property is an object" )
        plus();
      },
      end: function () {

      }
    };

  });

  ok( "executor" in popped, "executor plugin is now available to instance" );
  plus();
  equals( Popcorn.registry.length, 1, "One item in the registry");
  plus();

  popped.executor({
    start: 1,
    end: 2
  });

  Popcorn.plugin("complicator", {

    start: function ( event ) {

      var self = this;

      // These ensure that a popcorn instance is the value of `this` inside a plugin definition

      methods.split(/\s+/g).forEach(function (k,v) {
        ok( k in self, "complicator instance has method: " + k );

        plus();
      });

      ok( "video" in this, "complicator instance has `video` property" );
      plus();
      ok( Object.prototype.toString.call(popped.video) === "[object HTMLVideoElement]", "video property is a HTMLVideoElement" );
      plus();

      ok( "data" in this, "complicator instance has `data` property" );
      plus();
      ok( Object.prototype.toString.call(popped.data) === "[object Object]", "complicator data property is an object" );
      plus();

      ok( "trackEvents" in this.data, " complicatorinstance has `trackEvents` property" );
      plus();
      ok( Object.prototype.toString.call(popped.data.trackEvents) === "[object Object]", "complicator trackEvents property is an object" )
      plus();
    },
    end: function () {

      //start();

    },
    timeupdate: function () {
    }
  });

  ok( "complicator" in popped, "complicator plugin is now available to instance" );
  plus();
  equals( Popcorn.registry.length, 2, "Two items in the registry");
  plus();

  popped.complicator({
    start: 4,
    end: 5
  });

  popped.currentTime(0).play();

});

test( "Popcorn Compose", function () {

  QUnit.reset();

  var popped = Popcorn("#video"),
      expects = 43,
      count = 0,
      effectTrackOne,
      effectTrackTwo,
      effectTrackThree,
      composeOptionsOne,
      composeOptionsTwo,
      test = {
        one: {
          setup: 0,
          running: 0
        },
        two: {
          setup: 0,
          running: 0
        }
      };

  function plus() {
    if ( ++count == expects ) {
      Popcorn.removePlugin("testPlugin");
      Popcorn.removePlugin("pluginOptions1");
      Popcorn.removePlugin("pluginOptions2");
      start();
    }
  }

  expect( expects );
  stop( 15000 );

  ok( Popcorn.compose, "Popcorn.compose method exists" );
  plus();

  ok( Popcorn.effect, "Popcorn.effect method exists" );
  plus();

  ok( Popcorn.plugin.effect, "Popcorn.plugin.effect method exists" );
  plus();

  Popcorn.plugin( "testPlugin", {});

  Popcorn.compose( "testCompose1", {
    start: function() {
      test.one.running++;
    },
    end: function() {
      test.one.running--;
    },
    _setup: function() {
      test.one.setup++;
    },
    _teardown: function() {
      test.one.setup--;
    }
  });

  Popcorn.effect( "testEffect2", {
    start: function() {
      test.two.running++;
    },
    end: function() {
      test.two.running--;
    },
    _setup: function() {
      test.two.setup++;
    },
    _teardown: function() {
      test.two.setup--;
    }
  });

  popped.testPlugin({
    start: 0,
    end: 1,
    compose: "testCompose1",
    effect: "testEffect2"
  });

  effectTrackOne = popped.getLastTrackEventId();

  popped.testPlugin({
    start: 1,
    end: 2
  })
  .testPlugin({
    start: 2,
    end: 4,
    compose: "testCompose1"
  })
  .testPlugin({
    start: 3,
    end: 4,
    compose: "testCompose1 testEffect2"
  });

  effectTrackTwo = popped.getLastTrackEventId();

  popped.testPlugin({
    start: 5,
    end: 6,
    effect: "testCompose1"
  })
  .testPlugin({
    start: 6,
    end: 7,
    effect: "testCompose1 testEffect2"
  });

  effectTrackThree = popped.getLastTrackEventId();

  equals( test.one.running, 0, "no compose one running" );
  plus();
  equals( test.one.setup, 5, "five compose one setup" );
  plus();
  equals( test.two.running, 0, "no compose two running" );
  plus();
  equals( test.two.setup, 3, "three compose two setup" );
  plus();

  popped.exec( 0, function() {
    equals( test.one.running, 1, "one compose running" );
   plus();
   equals( test.two.running, 1, "one effect running" );
   plus();
  })
  .exec( 1, function() {
    equals( test.one.running, 0, "no compose running" );
    plus();
    equals( test.two.running, 0, "no effect running" );
    plus();
  })
  .exec( 2, function() {
    equals( test.one.running, 1, "one compose running" );
    plus();
    equals( test.two.running, 0, "no effect running" );
    plus();
  })
  .exec( 3, function() {
    equals( test.one.running, 2, "two compose one running" );
    plus();
    equals( test.two.running, 1, "one compose two running" );
    plus();
  })
  .exec( 4, function() {
    equals( test.one.running, 0, "no compose one running" );
    plus();
    equals( test.two.running, 0, "no compose two running" );
    plus();
  })
  .exec( 5, function() {
    equals( test.one.running, 1, "one effect running" );
    plus();
    equals( test.two.running, 0, "no compose running" );
    plus();
  })
  .exec( 6, function() {
    equals( test.one.running, 1, "one effect one running" );
    plus();
    equals( test.two.running, 1, "one effect two running" );
    plus();
  })
  .exec( 7, function() {
    popped.removeTrackEvent( effectTrackOne );
    popped.removeTrackEvent( effectTrackTwo );
    popped.removeTrackEvent( effectTrackThree );
    popped.removeTrackEvent( composeOptionsOne );
    popped.removeTrackEvent( composeOptionsTwo );
    equals( test.one.setup, 2, "three compose one teardowns called. 5 - 3 = 2" );
    plus();
    equals( test.two.setup, 0, "three compose two teardowns called. 3 - 3 = 0" );
    plus();
  });

  // runs once, 2 tests
  Popcorn.plugin( "pluginOptions1", {
    _setup: function( options ) {
      console.log( "runs once?" );
      ok( options.pluginoption, "plugin option one exists at setup" );
      plus();
      ok( !options.composeoption, "compose option one does not exist at setup" );
      plus();
      // check to test plugin to effect call order
      options.composeoption = true;
    }
  });

  // runs once, 2 tests
  Popcorn.plugin( "pluginOptions2", {
    _setup: function( options ) {
      ok( !options.pluginoption, "plugin option two does not exist at setup" );
      plus();
      ok( options.composeoption, "compose option two exists at setup" );
      plus();
      // check to test plugin to effect call order
      options.pluginoption = true;
    }
  });

  // runs twice, 8 tests * 2 runs = 16 tests
  Popcorn.plugin.effect( "composeOptions", {
    _setup: function( options ) {
      ok( options.pluginoption, "plugin option exists at setup" );
      plus();
      ok( options.composeoption, "compose option exists at setup" );
      plus();
    },
    _teardown: function( options ) {
      ok( options.pluginoption, "plugin option exists at teardown" );
      plus();
      ok( options.composeoption, "compose option exists at teardown" );
      plus();
    },
    start: function( event, options ) {
      ok( options.pluginoption, "plugin option exists at start" );
      plus();
      ok( options.composeoption, "compose option exists at start" );
      plus();
    },
    end: function( event, options ) {
      ok( options.pluginoption, "plugin option exists at end" );
      plus();
      ok( options.composeoption, "compose option exists at end" );
      plus();
    }
  });

  popped.pluginOptions1({
    start: 0,
    end: 1,
    compose: "composeOptions",
    pluginoption: true
  });

  composeOptionsOne = popped.getLastTrackEventId();

  popped.pluginOptions2({
    start: 0,
    end: 1,
    compose: "composeOptions",
    composeoption: true
  });

  composeOptionsTwo = popped.getLastTrackEventId();

  popped.currentTime( 0 ).play();
});

test("Plugin Breaker", function () {

  QUnit.reset();

  var popped = Popcorn("#video"),
      expects = 6,
      count = 0;

  function plus() {
    if ( ++count == expects ) {
      Popcorn.removePlugin("breaker");
      start();
    }
  }

  expect( expects );
  stop( 10000 );

  var breaker = {

    start: 0,
    end: 0

  };

  Popcorn.plugin("breaker", {

    start: function () {

      breaker.start++;

      ok(true, "breaker started");
      plus();
    },
    end: function () {

      breaker.end++;

      ok(true, "breaker ended");
      plus();


      equals( breaker.start, 1, "plugin start method fires only once");
      plus();
      equals( breaker.end, 1, "plugin end method fires only once");
      plus();


    }
  });

  ok( "breaker" in popped, "breaker plugin is now available to instance" );
  plus();
  equals( Popcorn.registry.length, 1, "Three items in the registry");
  plus();

  popped.breaker({
    start: 1,
    end: 2
  });

  popped.currentTime(0).play();

});

test("Plugin Empty", function () {

  QUnit.reset();

  var popped = Popcorn("#video"),
      expects = 4,
      testObj = {},
      count = 0;

  function plus() {
    if ( ++count == expects ) {
      Popcorn.removePlugin("empty");
      start();
    }
  }

  expect( expects );
  stop( 10000 );

  Popcorn.plugin("empty", testObj);

  popped.empty({});

  ok( testObj.start, "default start function is generated" );
  plus();
  ok( testObj.end, "default end function is generated" );
  plus();
  ok( testObj._setup, "default _setup function is generated" );
  plus();
  ok( testObj._teardown, "default _teardown function is generated" );
  plus();

  popped.currentTime(0).play();

});

test("Plugin Closure", function () {

  QUnit.reset();

  var popped = Popcorn("#video"),
      methods = "load play pause currentTime mute volume roundTime exec removePlugin",
      expects = 8,
      count = 0;

  function plus() {
    if ( ++count == expects ) {
      Popcorn.removePlugin("closure");
      start();
    }
  }

  expect( expects );
  stop( 10000 );

  Popcorn.plugin("closure", function() {

    var startCount = 0;
    var endCount = 0;

    return {

      _setup: function( options ) {
        options.startCount = 0;
        options.endCount = 0;
      },
      start: function ( event, options ) {
        // called once for each instance; the test will fail if startCount is not actually unique per instance
        equals( startCount++, options.startCount++, options.nick + " has correct start counts" );
        plus();
      },
      end: function ( event, options ) {
        // likewise for endCount
        equals( endCount++, options.endCount++, options.nick + " has correct end counts" );
        plus();

        // running tracks again to make sure data increments uniquly
        popped.currentTime(5).play();
      }
    };
  });

  popped.closure({
    start: 5,
    end: 6,
    nick: "first closure track"
  })
  .closure({
    start: 5,
    end: 6,
    nick: "second closure track"
  });

  popped.currentTime(5).play();

});

test("Remove Plugin", function () {

  var p = Popcorn("#video"),
      p2 = Popcorn("#video"),
      rlen = Popcorn.registry.length,
      count = 0,
      expects = 23,
      interval;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect( expects );
  stop( 10000 );
  p.currentTime(0).pause();

  equals( rlen, 0, "Popcorn.registry.length is empty");
  plus();

  equals( p.data.trackEvents.byStart.length, 2, "p.data.trackEvents.byStart is initialized and has 2 entries");
  plus();
  equals( p.data.trackEvents.byEnd.length, 2, "p.data.trackEvents.byEnd is initialized and has 2 entries");
  plus();

  Popcorn.plugin("removeme", {

    start: function () {

    },
    end: function () {

    },
    _teardown: function( options ) {
      ok( true, "teardown called on " + options.order + " plugin via removePlugin()" );
      plus();
    }
  });

  p.removeme({
    start: 2,
    end: 3,
    order: "first"
  });

  p2.removeme({
    start: 2,
    end: 3,
    order: "second"
  });

  equals( Popcorn.registry.length, 1, "Popcorn.registry.length is 1");
  plus();
  equals( p.data.trackEvents.byStart.length, 3, "p.data.trackEvents.byStart is updated and has 3 entries");
  plus();
  equals( p.data.trackEvents.byEnd.length, 3, "p.data.trackEvents.byEnd is updated and has 3 entries");
  plus();

  p.removePlugin("removeme");

  // p.removeme still exists on the prototype, even though we said to remove it
  // the tracks of that type though, are removed.
  // think of it as removing all tracks of plugin type attached to an instance
  ok( typeof p.removeme === "function", "removeme plugin is still defined to p instance" );
  plus();
  ok( ( "removeme" in Popcorn.prototype ), "removeme plugin is still available to Popcorn.prototype" );
  plus();
  equals( Popcorn.registry.length, 1, "Popcorn.registry.length has not changed");
  plus();

  ok( (typeof p2.removeme === "function"), "removeme plugin is defined to p2 instance" );
  plus();

  equals( p2.data.trackEvents.byStart.length, 3, "p2.data.trackEvents.byStart is updated and has 3 entries");
  plus();
  equals( p2.data.trackEvents.byEnd.length, 3, "p2.data.trackEvents.byEnd is updated and has 3 entries");
  plus();

  equals( p.data.trackEvents.byStart.length, 2, "p.data.trackEvents.byStart is updated and has 2 entries");
  plus();
  equals( p.data.trackEvents.byEnd.length, 2, "p.data.trackEvents.byEnd is updated and has 2 entries");
  plus();
  Popcorn.removePlugin("removeme");

  ok( !("removeme" in p2), "removeme plugin is no longer available to p2 instance" );
  plus();
  ok( !("removeme" in Popcorn.prototype), "removeme plugin is no longer available to Popcorn.prototype" );
  plus();
  equals( Popcorn.registry.length, 0, "Popcorn.registry.length is empty again");
  plus();


  interval = setInterval( function() {
    if( p2.currentTime() > 3 ) {

      equals( p2.data.trackEvents.byStart.length, 2, "p2.data.trackEvents.byStart is updated and has 2 entries");
      plus();
      equals( p2.data.trackEvents.byEnd.length, 2, "p2.data.trackEvents.byEnd is updated and has 2 entries");
      plus();
      clearInterval( interval );
    }
  }, 1);

  Popcorn.plugin( "cleanup", {

    _setup: function( options ) {

      options.exist = true;
    },
    _teardown: function( options ) {

      ok( true, "cleanup function is called during removal" );
      plus();

      ok( options.exist, "options object exists at time of cleanup" );
      plus();
    }
  });

  p2.cleanup({
    start: 2,
    end: 3
  });
  p2.removeTrackEvent( p2.getLastTrackEventId() );

  p2.currentTime( 2 ).play();

});




test("Protected Names", function () {
  //QUnit.reset();

  expect(8);

  var popped = Popcorn("#video");

  $.each( "load play pause currentTime playbackRate mute volume duration".split(/\s+/), function (k, name) {
    try {

      Popcorn.plugin( name, {});
    }   catch (e) {

      ok( name, "Attempting to overwrite '" + name + "' threw an exception " );

    };
  });
});

test("Defaulting Empty End Values", function() {

  expect (2);

  Popcorn.plugin("testdefault", {
    _setup: function( options ) {
      equals( options.end, Number.MAX_VALUE, "The end value defaulted to maximum number value");
    },
    start: function(event, options) {

    },
    end: function(event, options) {

    }
  });

  var popped = Popcorn( document.createElement( "audio" ) )
  .play()
  .testdefault({
    start: 0, // seconds
    apikey: "CHAyhB5IisvLqqzGYNYbmA",
    mediaid: "13607892"
  });

  var popped2 = Popcorn( document.createElement( "video" ) )
  .play()
  .testdefault({
    start: 0, // seconds
    apikey: "CHAyhB5IisvLqqzGYNYbmA",
    mediaid: "13607892"
  });
});

module("Popcorn TrackEvents");
test("Functions", function () {

  //  TODO: break this into sep. units per function
  expect(19);

  var popped = Popcorn("#video"), ffTrackId, rwTrackId, rw2TrackId, rw3TrackId, historyRef, trackEvents;


  Popcorn.plugin("ff", function () {
    return {
      start: function () {},
      end: function () {}
    };
  });

  popped.ff({
    start: 3,
    end: 4
  });


  ffTrackId = popped.getLastTrackEventId();



  Popcorn.plugin("rw", function () {
    return {
      start: function () {},
      end: function () {}
    };
  });

  popped.rw({
    start: 1,
    end: 2
  });


  rwTrackId = popped.getLastTrackEventId();

  historyRef = popped.data.history;


  equals( historyRef.length, 2, "2 TrackEvents in history index");
  equals( popped.data.trackEvents.byStart.length, 4, "4 TrackEvents in popped.data.trackEvents.byStart ");
  equals( popped.data.trackEvents.byEnd.length, 4, "4 TrackEvents in popped.data.trackEvents.byEnd ");


  trackEvents = popped.getTrackEvents();

  equals( trackEvents.length, 2, "2 user created trackEvents returned by popped.getTrackEvents()" )


  ok( ffTrackId !== rwTrackId, "Track Events have different ids" );

  popped.removeTrackEvent( rwTrackId );

  equals( popped.data.history.length, 1, "1 TrackEvent in history index - after popped.removeTrackEvent( rwTrackId ); ");
  equals( popped.data.trackEvents.byStart.length, 3, "3 TrackEvents in popped.data.trackEvents.byStart ");
  equals( popped.data.trackEvents.byEnd.length, 3, "3 TrackEvents in popped.data.trackEvents.byEnd ");

  trackEvents = popped.getTrackEvents();

  equals( trackEvents.length, 1, "1 user created trackEvents returned by popped.getTrackEvents()" )

  popped.rw({
    start: 1,
    end: 2
  });


  rw2TrackId = popped.getLastTrackEventId();

  equals( popped.data.history.length, 2, "2 TrackEvents in history index - after new track added ");


  ok( rw2TrackId !== rwTrackId, "rw2TrackId !== rwTrackId" );

  equals( popped.data.trackEvents.byStart.length, 4, "4 TrackEvents in popped.data.trackEvents.byStart  - after new track added");
  equals( popped.data.trackEvents.byEnd.length, 4, "4 TrackEvents in popped.data.trackEvents.byEnd  - after new track added");


  trackEvents = popped.getTrackEvents();

  equals( trackEvents.length, 2, "2 user created trackEvents returned by popped.getTrackEvents()" )


  popped.rw({
    id: "my-track-id",
    start: 3,
    end: 10
  });

  rw3TrackId = popped.getLastTrackEventId();

  equals( popped.data.history.length, 3, "3 TrackEvents in history index - after new track added ");
  equals( popped.data.trackEvents.byStart.length, 5, "5 TrackEvents in popped.data.trackEvents.byStart  - after new track added");
  equals( popped.data.trackEvents.byEnd.length, 5, "5 TrackEvents in popped.data.trackEvents.byEnd  - after new track added");

  equals( rw3TrackId, "my-track-id", "TrackEvent has user defined id");

  trackEvents = popped.getTrackEvents();

  equals( trackEvents.length, 3, "3 user created trackEvents returned by popped.getTrackEvents()" )




});

test("getTrackEvent", function () {

  //  TODO: break this into sep. units per function
  expect(5);

  var popped = Popcorn("#video"),
    trackIds = [], obj, oldId;

  Popcorn.plugin("ff", function () {
    return {
      start: function () {},
      end: function () {}
    };
  });

  popped.ff({
    start: 3,
    end: 4
  });

  trackIds.push( popped.getLastTrackEventId() );

  Popcorn.plugin("rw", function () {
    return {
      start: function () {},
      end: function () {}
    };
  });

  popped.rw({
    start: 1,
    end: 2
  });


  trackIds.push( popped.getLastTrackEventId() );

  popped.rw({
    start: 5,
    end: 7
  });

  trackIds.push( popped.getLastTrackEventId() );

  obj = popped.getTrackEvent( trackIds[0] );

  equals( typeof obj  === "object", true, "getTrackEvent() returned an object" );

  trackIds.forEach (function( id ) {
    var trackEvent = popped.getTrackEvent( id );
    equals( id, trackEvent._id, "returned the correct TrackEvent");
  });

  oldId = trackIds[trackIds.length - 1];

  popped.removeTrackEvent( oldId );

  equals( popped.getTrackEvent( oldId ), undefined,  "returned undefined when id is not found" );

});

test("Index Integrity", function () {



  var trackLen, hasrun = false, lastrun = false;


  Popcorn.plugin("ff", function () {
    return {
      start: function () {
        var div = document.createElement('div');
        div.id = "index-test";
        div.innerHTML = "foo";

        document.body.appendChild(div);
      },
      end: function () {
        document.getElementById('index-test').parentNode.removeChild(document.getElementById('index-test'));
      }
    };
  });


  var p = Popcorn("#video");

  p.ff({
    id: "removeable-track-event",
    start: 40,
    end: 41
  });

  p.currentTime(40).pause();

  stop( 10000 );

  equals(p.data.trackEvents.endIndex, 0, "p.data.trackEvents.endIndex is 0");
  equals(p.data.trackEvents.startIndex, 0, "p.data.trackEvents.startIndex is 0");
  equals(p.data.trackEvents.byStart.length, 3, "p.data.trackEvents.byStart.length is 3 - before play" );




  p.listen("timeupdate", function () {

    if ( p.roundTime() > 40 && p.roundTime() < 42 && !hasrun ) {
    }

    if ( p.roundTime() > 40 && p.roundTime() < 42 && hasrun && !lastrun ) {

      lastrun = true;

      equals( document.getElementById('index-test'), null, "document.getElementById('index-test') is null on second run - after removeTrackEvent" );

      start();
    }

    if ( p.roundTime() >= 42 && !hasrun ) {

      hasrun  = true;
      p.pause();

      equals(p.data.trackEvents.byStart.length, 3, "p.data.trackEvents.byStart.length is 3 - after play, before removeTrackEvent" );
      equals(p.data.trackEvents.startIndex, 2, "p.data.trackEvents.startIndex is 2 - after play, before removeTrackEvent");
      equals(p.data.trackEvents.endIndex, 2, "p.data.trackEvents.endIndex is 2 - after play, before removeTrackEvent");



      p.removeTrackEvent("removeable-track-event");

      equals(p.data.trackEvents.byStart.length, 2, "p.data.trackEvents.byStart.length is 2 - after removeTrackEvent" );
      equals(p.data.trackEvents.startIndex, 1, "p.data.trackEvents.startIndex is 1 - after removeTrackEvent");
      equals(p.data.trackEvents.endIndex, 1, "p.data.trackEvents.endIndex is 1 - after removeTrackEvent");



      p.currentTime(40).play();



    }
  });

  p.play();


});

test("Popcorn.disable/enable/toggle", function() {


  var $pop = Popcorn( "#video" ),
      count = 0,
      expects = 5;

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();

      Popcorn.removeInstance( $pop );
    }
  }

  Popcorn.plugin("toggler", function () {
    return {
      start: function () {
        var div = document.createElement("div");
        div.id = "toggler-test";
        div.innerHTML = "foo";

        document.body.appendChild(div);
      },
      end: function () {
        document.getElementById("toggler-test").parentNode.removeChild(document.getElementById("toggler-test"));
      }
    };
  });

  $pop.exec( 40, function() {

    //  make sure toggler never happened
    // look for: "toggler-test"

    ok( !document.getElementById("toggler-test"), "No toggler container, disabled toggler plugin correctly never ran" );
    plus();

    // Test per-instance toggle on
    $pop.toggle( "toggler" );
    ok( $pop.data.disabled.indexOf("toggler") === -1, "toggle() plugin: toggler is re-enabled" );
    plus();
  });

  $pop.toggler({
    start: 40,
    end: 50
  });

  // rw/ff

  // Test per-instance function call
  $pop.disable( "toggler" );

  ok( $pop.data.disabled.indexOf("toggler") > -1, "disable() plugin: toggler is disabled" );
  plus();

  // Test per-instance function call
  $pop.enable( "toggler" );

  ok( $pop.data.disabled.indexOf("toggler") === -1, "enable() plugin: toggler is enabled" );
  plus();

  // Test per-instance toggle off
  $pop.toggle( "toggler" );

  ok( $pop.data.disabled.indexOf("toggler") > -1, "toggle() plugin: toggler is disabled" );
  plus();

  stop( 10000 );
});


test("Popcorn.disable/enable/toggle triggers timeupdate", function() {

  var $pop = Popcorn( "#video" ),
      tests = [ "disabled", "enabled", "disabled" ],
      count = 0,
      expects = 6;

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
      Popcorn.removeInstance( $pop );
    }
  }

  stop( 5000 );

  Popcorn.plugin( "toggler", function () {
    return {
      start: function () {},
      end: function () {}
    };
  });

  $pop.toggler({
    start: 40,
    end: 50
  });

  $pop.listen( "timeupdate", function( event, data ) {

    if ( data.name && data.state ) {
      ok( true, "`timeupdate` event fired");
      plus();

      equal( data.state, tests.shift(), "Received correct data");
      plus();
    }
  });

  $pop.disable( "toggler" ).enable( "toggler" ).toggle( "toggler" );
  // Order: "disabled", "enabled", "disabled"
});

module("Popcorn XHR");
test("Basic", function () {

  expect(2);

  equals( typeof Popcorn.xhr, "function" , "Popcorn.xhr is a provided static function");
  equals( typeof Popcorn.xhr.httpData, "function" , "Popcorn.xhr.httpData is a provided static function");


});

test("Text Response", function () {

  var expects = 2,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop()

  Popcorn.xhr({
    url: 'data/test.txt',
    success: function( data ) {

      ok(data, "xhr returns data");
      plus();

      equals( data.text, "This is a text test", "test.txt returns the string 'This is a text test'");
      plus();

    }
  });
});

test("dataType: Text Response", function () {

  var expects = 2,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop()

  Popcorn.xhr({
    url: 'data/test.txt',
    dataType: "text",
    success: function( data ) {

      ok(data, "xhr returns data");
      plus();

      equals( data, "This is a text test", "dataType: 'text', test.txt returns the string 'This is a text test'");
      plus();

    }
  });
});


test("JSON Response", function () {

  var expects = 2,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop()


  var testObj = { "data": {"lang": "en", "length": 25} };

  Popcorn.xhr({
    url: 'data/test.js',
    success: function( data ) {

      ok(data, "xhr returns data");
      plus();


      ok( QUnit.equiv(data.json, testObj) , "data.json returns an object of data");
      plus();

    }
  });

});

test("dataType: JSON Response", function () {

  var expects = 2,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop()


  var testObj = { "data": {"lang": "en", "length": 25} };

  Popcorn.xhr({
    url: 'data/test.js',
    dataType: "json",
    success: function( data ) {

      ok(data, "xhr returns data");
      plus();


      ok( QUnit.equiv(data, testObj) , "dataType: 'json',  data returns an object of data");
      plus();

    }
  });

});


if ( !/file/.test( location.protocol ) ) {

  test("JSONP Response", function () {

    var expects = 8,
        count = 0;

    function plus() {
      if ( ++count === expects ) {
        start();
      }
    }

    expect(expects);

    stop(10000);


    var testObj = { "data": {"lang": "en", "length": 25} };

    Popcorn.xhr({

      url: 'data/jsonp.php?callback=jsonp',
      dataType: 'jsonp',
      success: function( data ) {

        ok(data, "getJSONP returns data");
        plus();


        ok( QUnit.equiv(data, testObj) , "Popcorn.xhr({}) data.json returns an object of data");
        plus();

      }
    });

    Popcorn.xhr.getJSONP(
      'data/jsonp.php?callback=jsonp',

      function( data ) {

        ok(data, "getJSONP returns data");
        plus();



        ok( QUnit.equiv(data, testObj) , "Popcorn.xhr.getJSONP data.json returns an object of data");
        plus();

      }
    );

    Popcorn.xhr.getJSONP(
      "http://api.flickr.com/services/feeds/photos_public.gne?id=35034346917@N01&lang=en-us&format=json&jsoncallback=flickr",

      function( data ) {



        ok(data, "getJSONP returns flickr data");
        plus();

        equal( typeof data, "object", "getJSONP returns flickr data");
        plus();


      }
    );

    Popcorn.getJSONP(
      'data/jsonp.php?callback=jsonp',

      function( data ) {

        ok(data, "getJSONP returns data");
        plus();



        ok( QUnit.equiv(data, testObj) , "Popcorn.xhr.getJSONP data.json returns an object of data");
        plus();

      }
    );
  });

} else {
  test("JSONP Response", function () {

    expect(1);


    stop(10000);
    ok(false, "jsonp requests require a webserver with php");
    start();
  });
}

test("Popcorn.getScript()", function () {

  var expects = 8,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop();


  Popcorn.xhr({

    url: "data/remoteA.js",

    dataType: "script",

    success: function() {

      ok( true, "getScript A returned");
      plus();



      ok( Popcorn.AlphaLib, "Popcorn.xhr.getScript remoteA.js loaded: `Popcorn.AlphaLib` is available");
      plus();

    }
  });

  Popcorn.getScript(

    "data/remoteB.js",

    function() {

      ok( true, "getScript B returned");
      plus();


      ok( Popcorn.BetaLib , "Popcorn.getScript remoteB.js loaded: `Popcorn.BetaLib` is available ");
      plus();

    }
  );


  Popcorn.getScript(

    "https://github.com/rwldrn/has.js/raw/master/has.js",

    function() {

      ok( true, "getScript C returned");
      plus();


      ok( ("has" in window) , "Popcorn.getScript https://github.com/rwldrn/has.js/raw/master/has.js loaded: `has` is available");
      plus();


      delete window["has"];
    }
  );



  Popcorn.xhr({

    url: "data/remoteA.js",

    dataType: "script",

    success: function( exists ) {

      ok( exists, "Success, remoteA loaded once");
      plus()
    }
  });

  Popcorn.getScript(

    "data/remoteB.js",

    function( exists ) {

      ok( exists, "Success, remoteB loaded once");
      plus()

    }
  );


});


test("XML Response", function () {

  var expects = 2,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop()


  Popcorn.xhr({
    url: 'data/test.xml',
    success: function( data ) {

      ok(data, "xhr returns data");
      plus();

      var parser = new DOMParser(),
      xml = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><dashboard><locations class="foo"><location for="bar"><infowindowtab> <tab title="Location"><![CDATA[blabla]]></tab> <tab title="Users"><![CDATA[blublu]]></tab> </infowindowtab> </location> </locations> </dashboard>',"text/xml");


      equals( data.xml.toString(), xml.toString(), "data.xml returns a document of xml");
      plus();

    }
  });

});

test("dataType: XML Response", function () {

  var expects = 2,
      count = 0;

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop()


  Popcorn.xhr({
    url: 'data/test.xml',
    dataType: "xml",
    success: function( data ) {

      ok(data, "xhr returns data");
      plus();

      var parser = new DOMParser(),
      xml = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><dashboard><locations class="foo"><location for="bar"><infowindowtab> <tab title="Location"><![CDATA[blabla]]></tab> <tab title="Users"><![CDATA[blublu]]></tab> </infowindowtab> </location> </locations> </dashboard>',"text/xml");


      equals( data.toString(), xml.toString(), "dataType: 'xml', data.xml returns a document of xml");
      plus();

    }
  });

});



module("Popcorn Parser");

test("Parsing Functions", function () {

  var expects = 3,
      count = 0,
      popperly = Popcorn("#video");

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  expect(expects);

  stop( 10000 );

  ok(typeof Popcorn.parser === "function", "Popcorn.parser is a function");
  plus();

  Popcorn.parser( "parseJSON" , "json", function( data ){
    return data;
  });

  ok(typeof popperly.parseJSON === "function", "Popcorn.parser created a parseJSON function");
  plus();

  ok(typeof popperly.parseJSON().parseJSON("data/test.js").parseJSON === "function" , "parseJSON function is chainable");
  plus();

});

test("Parsing Integrity", function () {

  var expects = 6,
      count = 0,
      timeOut = 0,
      poppercore = Popcorn( "#video" );

  function plus() {
    if ( ++count === expects ) {
      start();
      // clean up added events after tests
      Popcorn.removePlugin( "parserTest" );
    }
  }

  expect(expects);

  stop( 10000 );

  Popcorn.parser( "parseJSON2", function( data ){
    ok( typeof data.json === "object", "data.json exists");
    plus();
    return data.json;
  });

  Popcorn.parser( "parseJSON3" , "json", function( data ){
    ok( typeof data === "object", "data exists");
    plus();
    return data;
  });

  Popcorn.plugin("parserTest", {

    start: function () {
      ok(true, "parserTest started");
      plus();
    },
    end: function () {
      ok(true, "parserTest ended");
      plus();
    }
  });

  poppercore.parseJSON2("data/parserData.json", function() {

    poppercore.parseJSON3("data/parserData.json", function() {
      poppercore.currentTime(5).play();
    });

  });

});


test("Parsing Handler - References unavailable plugin", function () {

  var expects = 1,
      count = 0,
      timeOut = 0,
      interval,
      poppercore = Popcorn( "#video" );

  function plus() {
    if ( ++count === expects ) {
      start();
      // clean up added events after tests
      clearInterval( interval );
      poppercore.removePlugin( "parserTest" );
    }
  }

  expect(expects);

  stop();

  Popcorn.parser( "parseJson", function( data ){

    return data.json;
  });

  poppercore.parseJson("data/parseMissing.json");

  // interval used to wait for data to be parsed
  interval = setInterval( function() {
    poppercore.currentTime(5).play().currentTime(6);

    ok( true, "Ignored call to missing plugin " );
    plus();

  }, 2000);

});

module("Audio");
test( "Basic Audio Support", function () {

  var popped = Popcorn( "#audio" ),
      popObj = Popcorn( document.getElementById( "audio" ) ),
      methods = "load play pause currentTime mute volume roundTime exec removePlugin",
      count = 0,
      expects = 30;

  expect( expects );

  function plus() {

    if ( ++count === expects ) {

      start();
    }
  }

  stop( 10000 );

  // testing element passed by id
  ok( "audio" in popped, "instance by id has `media` property" );
  plus();
  equal( Object.prototype.toString.call( popped.media ), "[object HTMLAudioElement]", "instance by id media property is a HTMLAudioElement" );
  plus();

  ok( "data" in popped, "instance by id has `data` property" );
  plus();
  equal( Object.prototype.toString.call( popped.data ), "[object Object]", "instance by id data property is an object" );
  plus();

  ok( "trackEvents" in popped.data, "instance by id has `trackEvents` property" );
  plus();
  equal( Object.prototype.toString.call( popped.data.trackEvents ), "[object Object]", "instance by id trackEvents property is an object" );
  plus();

  popped.play();

  methods.split( /\s+/g ).forEach(function ( k,v ) {

    ok( k in popped, "instance by id has method: " + k );
    plus();
  });

  // testing element passed by reference
  ok( "media" in popObj, "instance by reference has `media` property" );
  plus();
  equal( Object.prototype.toString.call( popObj.media ), "[object HTMLAudioElement]", "instance by reference media property is a HTMLAudioElement" );
  plus();

  ok( "data" in popObj, "instance by reference has `data` property" );
  plus();
  equal( Object.prototype.toString.call( popObj.data ), "[object Object]", "instance by reference data property is an object" );
  plus();

  ok( "trackEvents" in popObj.data, "instance by reference has `trackEvents` property" );
  plus();
  equal( Object.prototype.toString.call( popObj.data.trackEvents ), "[object Object]", "instance by reference trackEvents property is an object" );
  plus();

  popObj.play();

  methods.split( /\s+/g ).forEach(function ( k,v ) {

    ok( k in popObj, "instance by reference has method: " + k );
    plus();
  });
});

test("Parser Support", function () {

  var expects = 3,
      count = 0,
      timeOut = 0,
      interval,
      audiocorn = Popcorn( "#audio" );

  function plus() {
    if ( ++count === expects ) {
      start();

      Popcorn.removePlugin( "testAudioParser" );
    }
  }

  expect(expects);
  stop(5000);


  Popcorn.plugin("testAudioParser", {

    start: function() {
      ok(true, "testAudioParser started: " + Math.round(this.currentTime()) );
      plus();
    },
    end: function() {
      ok(true, "testAudioParser ended: " + Math.round(this.currentTime()) );
      plus();
    }
  });

  Popcorn.parser( "parseAudio", function( data ){
    ok( typeof data.json === "object", "data.json exists");
    plus();
    return data.json;
  });

  audiocorn.parseAudio("data/parserAudio.json", function() {

    audiocorn.currentTime(4).play();

  });
});


module("Popcorn Test Runner End");
test("Last Check", function () {

  //   ALWAYS RUN LAST
  try {

    equals( Setup.getGlobalSize(), Setup.globalSize + 1 , "Popcorn API did not leak");

    if ( !Setup.globalDiff.length ) {
      //console.log(Setup.globalDiff);
    }

  } catch (e) {};

  //  Trigger follow-up tests to run in iframes
  (function( $ ) {

    $("iframe[data-src]").attr( "src", function() {
      return $(this).data("src");
    });

  })( jQuery );

});

