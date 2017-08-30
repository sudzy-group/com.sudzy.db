import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customers } from "../src/collections/Customers";
import {Customer} from "../src/entities/Customer";
import { Delivery } from "../src/entities/Delivery";
import { Deliveries } from "../src/collections/Deliveries";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Delivery test")
class DeliveryTest {

  static db;
  static customers: Customers;
  static deliveries: Deliveries;

  before() {
    DeliveryTest.db = new PouchDB("default");
    DeliveryTest.customers = new Customers(DeliveryTest.db, Customer);
    DeliveryTest.deliveries = new Deliveries(DeliveryTest.db, Delivery);
  }
  after(done: Function) {
    DeliveryTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const deliveries = new Deliveries(DeliveryTest.db, Delivery);
    expect(deliveries.getPrefix()).to.equal("delivery");
  }


//Insert

 @test("should insert pickup")
  public testInsertPickup(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let deliveryObj = {
        customer_id: cust.id,
        is_pickup: true,
        delivery_time: new Date().getTime(),
        delivery_person: "Jason"
      }
      return deliveries.insert(deliveryObj);
    }).then((deliv) => {
        expect(deliv.customer_id).to.exist;
        expect(deliv.is_pickup).to.equal(true);
        done();
    }).catch(m=>console.log(m));
  }

 @test("should insert dropoff")
  public testInsertDropoff(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6465490561" }).then((cust) => {
      let deliveryObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        delivery_person: "Jason"
      }
      return deliveries.insert(deliveryObj);
    }).then((deliv) => {
        expect(deliv.customer_id).to.exist;
        expect(deliv.is_pickup).to.equal(false);
        done();
    }).catch(m=>console.log(m));
  } 

  @test("should insert express delivery")
  public testInsertExpress(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6465490561" }).then((cust) => {
      let deliveryObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        express_id: "del_x039303"
      }
      return deliveries.insert(deliveryObj);
    }).then((deliv) => {
        expect(deliv.customer_id).to.exist;
        expect(deliv.express_id).to.equal("del_x039303");
        done();
    }).catch(m=>console.log(m));
  } 

 @test("should insert two deliveries")
  public testTwoDelivery(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    let cust_id = "";
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      cust_id = cust.id;
      let deliveryObj1 = {
        customer_id: cust_id,
        is_pickup: true,
        delivery_time: new Date().getTime()
      }
      return deliveries.insert(deliveryObj1);
    }).then((deliv1) => {
        expect(deliv1.customer_id).to.exist;
        expect(deliv1.is_pickup).to.equal(true);
        let deliveryObj2 = {
          customer_id: cust_id,
          is_pickup: false,
          delivery_time: new Date().getTime()
      }
      return deliveries.insert(deliveryObj2);
   }).then((deliv2) => {
      expect(deliv2.customer_id).to.exist;
      expect(deliv2.is_pickup).to.equal(false);
      done();
    }).catch(m=>console.log(m));
  }

//Search
  @test("should be able to search by delivery_time")
  public testSearchDeliveryTime(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6465490563" }).then((cust) => {
      let deliveryObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: "1489627534819"
      }
      return deliveries.insert(deliveryObj);
    }).then((deliv) => {
       return deliveries.find("delivery_time", "1489627534819")
     }).then((delivs) => {   
        expect(delivs.length).to.equal(1);
        done();
    }).catch(m=>console.log(m));
  } 

  @test("should be able to search by external id")
  public testSearchDeliveryExternalId(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "1465490999" }).then((cust) => {
      let deliveryObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: "1489627534819",
        external_id: "37644"
      }
      return deliveries.insert(deliveryObj);
    }).then((deliv) => {
       return deliveries.find("external_id", "37644")
     }).then((delivs) => {   
        expect(delivs.length).to.equal(1);
        done();
    }).catch(m=>console.log(m));
  } 

//Update
@test("should be able to update delivery_person")
  public testUpdateDeliveryPerson(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265490564" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        delivery_person: "Tom"
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      expect(deliv.customer_id).to.exist;
      let updatedDeliv = {
         delivery_person: "Mike"
      }
      return deliveries.update(deliv, updatedDeliv);
    }).then((updated_deliv) => {
      expect(updated_deliv.delivery_person).to.equal("Mike");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be able to update is_confirmed")
  public testUpdateIsConfirmed(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265490565" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        is_confirmed: false
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      expect(deliv.customer_id).to.exist;
      let updatedDeliv = {
         is_confirmed: true
      }
      return deliveries.update(deliv, updatedDeliv);
    }).then((updated_deliv) => {
      expect(updated_deliv.is_confirmed).to.equal(true);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be able to search by is_confirmed")
  public testSearchByIsConfirmed(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265455555" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        is_confirmed: false
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      return deliveries.findIds('is_confirmed', false);
    }).then((ds) => {
      expect(ds.length).to.be.above(0);
      done();
    }).catch(m=>console.log(m));
  }  


  @test("should be able to update express_id")
  public testUpdateExpressId(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265490565" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime()
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      expect(deliv.customer_id).to.exist;
      let updatedDeliv = {
          express_id: "del_2222"
      }
      return deliveries.update(deliv, updatedDeliv);
    }).then((updated_deliv) => {
      expect(updated_deliv.express_id).to.equal("del_2222");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should be able to update is_canceled")
  public testUpdateIsCanceled(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265490565" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime()
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      expect(deliv.customer_id).to.exist;
      let updatedDeliv = {
          is_canceled: true
      }
      return deliveries.update(deliv, updatedDeliv);
    }).then((updated_deliv) => {
      expect(updated_deliv.is_canceled).to.equal(true);
      done();
    }).catch(m=>console.log(m));
  }


@test("should not be able to update is_pickup")
  public testUpdateIsPickup(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265490565" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      expect(deliv.customer_id).to.exist;
      let updatedDeliv = {
          is_pickup: true
      }
      return deliveries.update(deliv, updatedDeliv);
    }).then(_.noop)
      .catch((c) => {
        done();
    });
 }

 @test("should not be able to update delivery_time")
  public testUpdateDeliveryTime(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    customers.insert({ mobile: "6265490565" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: "1489627534819"
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      expect(deliv.customer_id).to.exist;
      let updatedDeliv = {
          delivery_time: "1489627534812"
      }
      return deliveries.update(deliv, updatedDeliv);
    }).then(_.noop)
      .catch((c) => {
        done();
    });
 }

//Delete 

@test("should be able to delete delivery")
  public testDeleteDelivery(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    let delivery_id = "";
    customers.insert({ mobile: "6265490566" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime()
      }
      return deliveries.insert(delivObj);
    }).then((deliv) => {
      delivery_id = deliv.id;
      expect(deliv.customer_id).to.exist;
      return deliveries.remove(deliv);
    }).then((e) => {
      return deliveries.get(delivery_id);
    }).then(_.noop)
    .catch((c) => {
        done();
    });
  }


//Validators

@test("shouldn't allow delivery_person to have one char")
  public testInvalidDeliveryPerson(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    let delivery_id = "";
    customers.insert({ mobile: "6265490567" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        delivery_person: "a"
      }
      return deliveries.insert(delivObj);
     }).then(_.noop)
      .catch((c) => {
        done();
    });
  }


 @test("shouldn't allow express_id with whitespace")
  public testInvalidExpressId(done) {
    let customers = DeliveryTest.customers;
    let deliveries = DeliveryTest.deliveries;
    let delivery_id = "";
    customers.insert({ mobile: "6265490567" }).then((cust) => {
      let delivObj = {
        customer_id: cust.id,
        is_pickup: false,
        delivery_time: new Date().getTime(),
        express_id: "del_ 123"
      }
      return deliveries.insert(delivObj);
     }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

}

