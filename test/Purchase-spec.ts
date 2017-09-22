import { Purchases } from "../src/collections/Purchases";
import { Purchase } from "../src/entities/Purchase";
import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from "lodash";

const expect = chai.expect;

@suite("Purchase test")
class PurchaseTest {
  static db;
  static purchases: Purchases;

  before() {
    PurchaseTest.db = new PouchDB("default");
    PurchaseTest.purchases = new Purchases(PurchaseTest.db, Purchase);
  }
  after(done: Function) {
    PurchaseTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const purchases = new Purchases(PurchaseTest.db, Purchase);
    expect(purchases.getPrefix()).to.equal("purch");
  }

  //Insert
  @test("should insert purchase")
  public testInsertPickup(done) {
    let purchases = PurchaseTest.purchases;
    purchases
      .insert({
        product_ids: ['123', '234', '43243'],
        total_price: 16.7,
        tax : 1.2,
        readable_id: '111',
        payment_type: "cash",
        payment_id: "2321321",
        refund_id: "32343243"
      })
      .then(purchase => {
        expect(purchase.total_price).to.exist;
        expect(purchase.product_ids.length).to.equal(3);
        expect(purchase.payment_type).to.equal("cash");
        expect(purchase.refund_id).to.equal("32343243");
        done();
      })
      .catch(m => console.log(m));
  }


  //Insert
  @test("should insert purchase")
  public testInsertAndSearch(done) {
    let purchases = PurchaseTest.purchases;
    purchases
      .insert({
        product_ids: ['123', '234', '43243'],
        total_price: 16.7,
        tax : 1.2,
        readable_id: '111',
        payment_type: "cash",
        payment_id: "2321321",
        refund_id: "32343243"
      })
      .then(purchase => {
        return purchases.get(purchase.id)
      }).then(purchase => {
        expect(purchase.product_ids).to.be.an('array');
        expect(purchase.product_ids).to.deep.equal(['123', '234', '43243']);
        done();
      })
      .catch(m => console.log(m));
  }  

}
