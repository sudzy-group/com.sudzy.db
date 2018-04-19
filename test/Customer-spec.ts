import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customer } from "../src/entities/Customer";
import { Customers } from "../src/collections/Customers";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as metaphone from 'metaphone';

const expect = chai.expect;

@suite("Customer test")
class CustomerTest {

  static db;

  static before() {
    CustomerTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    CustomerTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const customers = new Customers(CustomerTest.db, Customer);
    expect(customers.getPrefix()).to.equal("customer");
  }
  //Insertion  
  @test("should insert customer with mobile")
  public testInsertMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490561" }).then((c) => {
      expect(c.mobile).to.equal("6465490561");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert all parameters")
  public testInsertAll(done) {
    let customerObj = {
      mobile: "19292778399",
      formatted_mobile: '+1(929)277-8399',
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
      autocomplete: "199 Orchard St, New York, NY 10002, USA",
      street_num: "199",
      street_route: "Orchard Street",
      apartment: "2D",
      city: "New York",
      state: "NY",
      zip: "10002",
      lat: "40.72224",
      lng: "-73.988152",
      is_doorman: true,
      delivery_notes: "Ring bell twice",
      cleaning_notes: "Clean slowly",
      payment_customer_id: "cus_9xJOnv9Enc98S",
      route_id: "123"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      return customers.find("mobile", "19292778399")
    }).then((cs) => {
      let c = cs[0];
      _.forIn(customerObj, function(value, key) {
        expect(c[key]).to.equal(value);
      })
      done();
    }).catch(m=>console.log(m));
  }

  //Search
  @test("should be searchable by mobile")
  public testSearchMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490562" }).then((c) => {
      return customers.find("mobile", "6465490562")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("6465490562");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be searchable by email")
  public testSearchEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "1235490562", email: "MYEMAIL@gmail.com" }).then((c) => {
      return customers.find("email", "myemail@gmail.com")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("1235490562");
      done();
    }).catch(m=>console.log(m));
  }  

  @test("should be searchable by last4")
  public testSearchLast4(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490563" }).then((c) => {
      return customers.find("mobile", "0563")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("6465490563");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be searchable by metaphone")
  public testSearchName(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Roy Ganor", mobile: "6465490564" }).then((c) => {
      return customers.findByName("Roi Gnor");
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].name).to.equal("Roy Ganor");
      done();
    }).catch(m=>console.log(m));
  }


  @test("should be searchable by last name")
  public testSearchLastName(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Hilary Barr", mobile: "6465490564" }).then((c) => {
      return customers.findByName("barr");
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].name).to.equal("Hilary Barr");
      done();
    }).catch(m=>console.log(m));
  }


  @test("should be not found by missing mobile")
  public testSearchNotFound(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Roy Ganor", mobile: "6465490564" }).then((c) => {
      return customers.find('mobile', '1111111');
    }).then((cs) => {
      expect(cs.length).to.equal(0);
      done();
    }).catch(m=>{
    });
  }  

  @test("should be searchable by name")
  public testSearchMetaphone(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Roo Ganor", mobile: "6465490565" }).then((c) => {
      return customers.find("name", "Roo Ganor");
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].name).to.equal("Roo Ganor");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be searchable by route id")
  public testSearchRouteId(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Roy Ganor", mobile: "6465490564", route_id : "567" }).then((c) => {
      return customers.findByRoute("567");
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].name).to.equal("Roy Ganor");
      return customers.update(cs[0], { route_id: null});
    }).then(() => {      
      return customers.findByRoute("567");
    }).then((cs) => {
      expect(cs.length).to.equal(0);
      done();
    }).catch(m=>console.log(m));
  }  

  @test("should be possible to paginate")
  public testSearchPaginate(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ name: "Boo Gan1", mobile: "6465490555" }).then((c) => {
      return customers.insert({ name: "Boo Gan2", mobile: "6165490555" });
    }).then((cs) => {
      return customers.insert({ name: "Boo Gan3", mobile: "6225490555" });
    }).then((cs) => {
      return customers.find("mobile", "0555")
    }).then((custs) => {
      expect(custs.length).to.equal(3);
      expect(custs[0].name).to.equal("Boo Gan1");
      expect(custs[1].name).to.equal("Boo Gan2");
      expect(custs[2].name).to.equal("Boo Gan3");
      return customers.find("mobile", "0555", {limit: 2});
    }).then((custs2) => {
      expect(custs2[0].name).to.equal("Boo Gan1");
      expect(custs2[1].name).to.equal("Boo Gan2");
      expect(custs2.length).to.equal(2);
      return customers.find("mobile", "0555", {limit: 1});
    }).then((custs1) => {
      expect(custs1.length).to.equal(1);
      expect(custs1[0].name).to.equal("Boo Gan1");
      return customers.find("mobile", "0555", {limit: 1, skip: 2});
    }).then((custs1) => {
      expect(custs1.length).to.equal(1);
      expect(custs1[0].name).to.equal("Boo Gan3");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert customer with extra mobile")
  public testInsertExtraMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490561", extra_mobile: "6465490562", is_extra_default: true }).then((c) => {
      expect(c.mobile).to.equal("6465490561");
      expect(c.extra_mobile).to.equal("6465490562");
      expect(c.is_extra_default).to.equal(true);
      return customers.update(c, { formatted_mobile : "6465490562" });
    }).then((cs) => {
      return customers.find("extra_mobile", "0562");
    }).then((cs) => {
      if (cs.length > 0) {
        expect(cs[0].mobile).to.equal("6465490561");
        expect(cs[0].is_extra_default).to.equal(true);
        expect(cs[0].formatted_mobile).to.equal("6465490562");
        done();
      }
    }).catch(m=>console.log(m));
  }  

  //Update
  @test("should update parameters")
  public testUpdate(done) {
    let customerObj = {
      mobile: "19292778391",
      name: "Mud Park",
      email: "mpark@gmail.com",
      autocomplete: "199 Orchard St, New York, NY 10002, USA",
      street_num: "199",
      street_route: "Orchard Street",
      apartment: "2D",
      city: "New York",
      state: "NY",
      zip: "10002",
      lat: "40.72224",
      lng: "-73.988152",
      is_doorman: true,
      delivery_notes: "Ring bell twice",
      cleaning_notes: "Clean slowly",
      payment_customer_id: "cus_9xJOnv9Enc98S"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      _.forIn(customerObj, function(value, key) {
        expect(c[key]).to.equal(value);
      });
      let updatedCustomerObj = {
        name: "Muddy Parks",
        email: "muddyparks@gmail.com",
        is_doorman: false,
        delivery_notes: "Turn around"
      }
      return customers.update(c, updatedCustomerObj);
    }).then((cus) => {
      expect(cus.mobile).to.equal("19292778391");
      expect(cus.name).to.equal("Muddy Parks");
      expect(cus.is_doorman).to.equal(false);
      expect(cus.autocomplete).to.equal("199 Orchard St, New York, NY 10002, USA");
      done();
    }).catch(m=>console.log(m));
  }

  //Update
  @test("should update parameters 2")
  public testUpdate2(done) {
    let customerObj = {
      formatted_mobile: "+1(929)2778391",
      mobile: "19292778391",
      allow_notifications: true,
      name: "Roy Ganor",
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj, new Date().getTime() - 200).then((c) => {
      return customers.find('mobile','19292778391');
    }).then(cs => {
      let c = cs[0];
      let updatedCustomerObj = {
        name: "Roy Ganor1",
        
      }
      return customers.update(c, updatedCustomerObj);
    }).then((cus) => {
      done();
    }).catch((m) => {
      console.log(m);
    });
  }  

  @test("should not update mobile")
  public testNoMobileUpdate(done) {
    let customerObj = {
      mobile: "19292778392",
      name: "Mud Park"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      expect(c.mobile).to.equal("19292778392");
      let updatedCustomerObj = {
        mobile: "19292778322"
      }
      return customers.update(c, updatedCustomerObj);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }


  //Delete
  @test("should delete customer with just mobile")
  public testDeleteCustomerMobile(done) {
    let id = "";
    let customerObj = {
      mobile: "19292778387"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      id = c.id;
      return customers.get(id);
    }).then((cus) => {
      expect(cus.mobile).to.equal("19292778387");
      return customers.remove(cus);
    }).then((e) => {
      return customers.get(id);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }


  @test("should delete customer with many params")
  public testDeleteCustomerAllParams(done) {
    let id = "";
    let customerObj = {
      mobile: "19292778388",
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
      autocomplete: "199 Orchard St, New York, NY 10002, USA",
      street_num: "199",
      street_route: "Orchard Street",
      apartment: "2D",
      city: "New York",
      state: "NY",
      zip: "10002",
      lat: "40.72224",
      lng: "-73.988152",
      is_doorman: true,
      delivery_notes: "Ring bell twice",
      cleaning_notes: "Clean slowly",
      payment_customer_id: "cus_9xJOnv9Enc98S"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      id = c.id;
      return customers.get(id);
    }).then((cus) => {
      expect(cus.mobile).to.equal("19292778388");
      return customers.remove(cus);
    }).then((e) => {
      return customers.get(id);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }

  // //Validators  
  @test("should not allow invalid mobile")
  public testInvalidMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "64654905" })
      .then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should not allow name with less than 2 characters")
  public testInvalidName(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490566", name: "a" })
      .then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("shouldn't allow invalid zip")
  public testInvalidZip(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490561", zip: "1002" })
      .then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should allow valid longitude")
  public testValidLng(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490561", lng: "-73.988152" }).then((c) => {
      expect(c.lng).to.equal("-73.988152");
      done();
    }).catch(m=>console.log(m));
  }

  @test("shouldn't allow invalid longitude")
  public testInvalidLng(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490561", lng: "-181" }).then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should allow valid latitude")
  public testValidLat(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490561", lat: "41.25" }).then((c) => {
      expect(c.lat).to.equal("41.25");
      done();
    }).catch(m=>console.log(m));
  }

  @test("shouldn't allow invalid latitude")
  public testInvalidLat(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490561", lat: "-91" }).then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should allow valid email")
  public testValidEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490566", email: "jshmo@gmail.com" }).then((c) => {
      expect(c.email).to.equal("jshmo@gmail.com");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should not allow invalid email")
  public testInvalidEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6465490567", email: "jshmo" }).then(_.noop
    ).catch((c) => {
      done();
    });
  }

  @test("shouldn't allow payment_customer_id with whitespace")
  public testInvalidPaymentCustomerId(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490563", payment_customer_id: "tok 123" }).then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should set pricing group")
  public testPricingGroup(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6125490405", pricing_group: "abc" }).then((c) => {
      return customers.find("mobile", "6125490405")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].pricing_group).to.equal("abc");
      done();
    }).catch(m=>console.log(m));
  }

  // last name
  @test("should insert all parameters")
  public testLastName(done) {
    let customerObj = {
      mobile: "19292778399",
      formatted_mobile: '+1(929)277-8399',
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      return customers.find("mobile", "19292778399")
    }).then((cs) => {
      let c = cs[0];
      expect(c.lastName("")).to.equal(null);
      expect(c.lastName("Booboo Barr")).to.equal("BR");
      expect(c.lastName("    Booboo Barr    ")).to.equal("BR");
      expect(c.lastName("    Booboo, Barr    ")).to.equal("BR");
      expect(c.lastName("Booboo Barr Babba")).to.equal("BR");
      expect(c.lastName(null)).to.equal(null);
      done();
    }).catch(m=>console.log(m));
  }  
  
}

