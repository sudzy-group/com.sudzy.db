import { Products } from "../src/collections/Products";
import { Product } from "../src/entities/Product";
import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import * as PouchDB from "pouchdb";
import * as _ from "lodash";

const expect = chai.expect;

@suite("Product test")
class ProductTest {
  static db;
  static products: Products;

  before() {
    ProductTest.db = new PouchDB("default");
    ProductTest.products = new Products(ProductTest.db, Product);
  }
  after(done: Function) {
    ProductTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const products = new Products(ProductTest.db, Product);
    expect(products.getPrefix()).to.equal("prod");
  }

  //Insert
  @test("should insert product")
  public testInsertPickup(done) {
    let products = ProductTest.products;
    products
      .insert({
        name: "Soap",
        sku: "12",
        image: "1.png",
        price: 4.56,
        goods_in_stock: 2
      })
      .then(product => {
        expect(product.name).to.exist;
        expect(product.sku).to.equal("12");
        expect(product.price).to.equal(4.56);
        expect(product.goods_in_stock).to.equal(2);
        done();
      })
      .catch(m => console.log(m));
  }

}
