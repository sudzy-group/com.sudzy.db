import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customers } from "../src/collections/Customers";
import {Customer} from "../src/entities/Customer";
import { CustomerCard } from "../src/entities/CustomerCard";
import { CustomerCards } from "../src/collections/CustomerCards";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Customer card test")
class CustomerCardTest {

  static db;
  static customers: Customers;
  static customer_cards: CustomerCards;

  static before() {
    CustomerCardTest.db = new PouchDB("default");
    CustomerCardTest.customers = new Customers(CustomerCardTest.db, Customer);
    CustomerCardTest.customer_cards = new CustomerCards(CustomerCardTest.db, CustomerCard);
  }

  static after(done: Function) {
    CustomerCardTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let customer_cards = CustomerCardTest.customer_cards;
    expect(customer_cards.getPrefix()).to.equal("customer-card");
  }

//Insert
  @test("should insert card")
  public testInsertCard(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "4242",
        exp_month: "12",
        exp_year: "20",
        is_default: true
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
        expect(card.customer_id).to.exist;
        expect(card.last4).to.equal("4242");
        done();
    }).catch(m=>console.log(m));
  }


 @test("should insert two cards")
  public testInsertTwoCard(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    customers.insert({ mobile: "6465490520" }).then((cust) => {
      let cardObj1 = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        exp_month: "01",
        exp_year: "20",
        last4: "4242",
        is_default: true
      }
      return customer_cards.insert(cardObj1);
    }).then((card1) => {
      expect(card1.last4).to.equal("4242");
      let cardObj2 = {
        customer_id: card1.customer_id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4X",
        brand: "Mastercard",
        exp_month: "01",
        exp_year: "20",
        last4: "2222"
      }
      return customer_cards.insert(cardObj2);
    }).then((card2) => {
      expect(card2.last4).to.equal("2222");
      done();
    }).catch(m=>console.log(m));
  }

//Search 
@test("should be searchable by customer id")
  public testSearchByCustomerId(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    customers.insert({ mobile: "6225490560" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        exp_month: "01",
        exp_year: "20",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      return customers.get(card.customer_id);
    }).then((cust) => {
       return customer_cards.find("customer_id", cust.id);
    }).then((cards) => {
       expect(cards.length).to.equal(1);
       done();
    }).catch(m=>console.log(m));
  }

//delete card
@test("should be able to delete card")
  public testDeleteCard(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    let card_id = "";
    customers.insert({ mobile: "6265490561" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        exp_month: "01",
        exp_year: "20",
        brand: "Visa",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      card_id = card.id;
      return customer_cards.remove(card);
   }).then((e) => {
      return customer_cards.get(card_id);
    }).then(_.noop)
    .catch((c) => {
        done();
    });
  }


//Update 
  @test("should be able to update is_default to not default")
  public testChangeIsDefaultToFalse(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    let card_id = "";
    customers.insert({ mobile: "6265490562" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        exp_month: "01",
        exp_year: "20",
        brand: "Visa",
        last4: "4242",
        is_default: true
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      expect(card.is_default).to.equal(true);
      let updatedCardObj = {
         is_default: false
      }
      return customer_cards.update(card, updatedCardObj);
    }).then((updated_card) => {
      expect(updated_card.is_default).to.equal(false);
      done();
    }).catch(m=>console.log(m));
  }

//TODO uncomment
  //  @test("should be able to update is_default to true")
  // public testChangeIsDefaultToTrue(done) {
  //   let customers = CustomerCardTest.customers;
  //   let customer_cards = CustomerCardTest.customer_cards;
  //   let card_id = "";
  //   customers.insert({ mobile: "6265490564" }).then((cust) => {
  //     let cardObj = {
  //       customer_id: cust.id,
  //       card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
  //       brand: "Visa",
  //       last4: "4242",
  //       is_default: false
  //     }
  //     return customer_cards.insert(cardObj);
  //   }).then((card) => {
  //     let updatedCardObj = {
  //        is_default: true
  //     }
  //     return customer_cards.update(card, updatedCardObj);
  //   }).then((updated_card) => {
  //     expect(updated_card.is_default).to.equal(true);
  //     done();
  //   }).catch(m=>console.log(m));
  // }

  @test("should not be able to update customer_id")
  public testUpdateCustomerId(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    let card_id = "";
    customers.insert({ mobile: "6265490564" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      let updatedCardObj = {
         customer_id: "123"
      }
      return customer_cards.update(card, updatedCardObj);
    }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not be able to update card_id")
  public testUpdateCardId(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    let card_id = "";
    customers.insert({ mobile: "6265490564" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      let updatedCardObj = {
         card_id: "123"
      }
      return customer_cards.update(card, updatedCardObj);
    }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not be able to update brand")
  public testUpdateBrand(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    let card_id = "";
    customers.insert({ mobile: "6265490564" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      let updatedCardObj = {
         brand: "Mastercard"
      }
      return customer_cards.update(card, updatedCardObj);
    }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

@test("should not be able to update last4")
  public testUpdateLast4(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    let card_id = "";
    customers.insert({ mobile: "6265490564" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
    }).then((card) => {
      let updatedCardObj = {
         last4: "2222"
      }
      return customer_cards.update(card, updatedCardObj);
    }).then(_.noop)
      .catch((c) => {
        done();
    });
  }


//Validators
  @test("shouldn't allow card_id with whitespace")
  public testInvalidCardId(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    customers.insert({ mobile: "6465490560" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_ 19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
     }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

 @test("should not allow brand to be less than 2 char")
  public testInvalidBrand(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    customers.insert({ mobile: "6465490561" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "V",
        last4: "4242"
      }
      return customer_cards.insert(cardObj);
     }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not allow last4 to be other than 4 long")
  public testInvalidLast4(done) {
    let customers = CustomerCardTest.customers;
    let customer_cards = CustomerCardTest.customer_cards;
    customers.insert({ mobile: "6465490562" }).then((cust) => {
      let cardObj = {
        customer_id: cust.id,
        card_id: "card_19lhGEDMuhhpO1mOmpfsdX4I",
        brand: "Visa",
        last4: "42424"
      }
      return customer_cards.insert(cardObj);
     }).then(_.noop)
      .catch((c) => {
        done();
    });
  } 
}


