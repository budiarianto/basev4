import { City } from '../city';

//Meteor.publish('city', () => City.find());

(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/city.js                                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish('cities', function () {                                 // 1
  var data = City.find({}, { sort: { sequence: 1 } });                 // 2
  //  console.log('data city', data);                                  //
                                                                       //
  if (data) {                                                          // 5
    return data;                                                       // 6
  }                                                                    //
                                                                       //
  return this.ready();                                                 // 9
});                                                                    //
                                                                       //
Meteor.publish('city', function (cityId) {                             // 12
  check(cityId, String);                                               // 13
                                                                       //
  var user = this.userId;                                              // 15
  if (!user) throw new Meteor.Error(403, 'User not authorized');       // 16
                                                                       //
  var query = {};                                                      // 19
                                                                       //
  query['_id'] = cityId;                                               // 21
  var data = City.find(query);                                         // 22
                                                                       //
  if (data) {                                                          // 24
                                                                       //
    return data;                                                       // 26
  }                                                                    //
                                                                       //
  return this.ready();                                                 // 29
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=city.js.map
