import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderTag } from "../src/entities/OrderTag";
import { OrderTags } from "../src/collections/OrderTags";
import * as PouchDB from "pouchdb";
import * as _ from "lodash";
import { Promise } from 'ts-promise';

const expect = chai.expect;

@suite("Order tag test")
class OrderTagTest {
	static db;
	static order_tags: OrderTags;

	static before() {
		OrderTagTest.db = new PouchDB("default");
		OrderTagTest.order_tags = new OrderTags(OrderTagTest.db, OrderTag);
	}

	static after(done: Function) {
		OrderTagTest.db.destroy(() => done());
	}

	@test("should return correct prefix")
	public testPrefix() {
		let order_tags = OrderTagTest.order_tags;
		expect(order_tags.getPrefix()).to.equal("order-tag");
	}

	//Insert
	@test("should insert tag")
	public testInsertTag(done) {
		let order_tags = OrderTagTest.order_tags;
		let orderTagObj = {
			order_id: "123",
			tag_number: 333
		};
		order_tags
			.insert(orderTagObj)
			.then(tag => {
				expect(tag.tag_number).to.equal(333);
				done();
			})
			.catch(m => console.log(m));
	}

	@test("should insert 3 tags")
	public testInsert3Tag(done) {
		let order_tags = OrderTagTest.order_tags;
		let orderTag1 = {
			order_id: "222",
			tag_number: 333
		};
		order_tags
			.insert(orderTag1)
			.then(tag1 => {
				expect(tag1.tag_number).to.equal(333);
				let orderTag2 = {
					order_id: "222",
					tag_number: 333
				};
				return order_tags.insert(orderTag2);
			})
			.then(tag2 => {
				expect(tag2.tag_number).to.equal(333);
				let orderTag3 = {
					order_id: "222",
					tag_number: 123
				};
				return order_tags.insert(orderTag3);
			})
			.then(tag3 => {
				expect(tag3.tag_number).to.equal(123);

				done();
			})
			.catch(m => console.log(m));
	}

	//Search
	@test("should search by order id")
	public testSearchOrderId(done) {
		let order_tags = OrderTagTest.order_tags;
		order_tags
			.find("order_id", "222")
			.then(tags => {
				expect(tags.length).to.equal(3);
				done();
			})
			.catch(m => console.log(m));
  }

	@test("should insert 3 tags and search")
	public testSearchTags(done) {
    let order_tags = OrderTagTest.order_tags;
    let ps = [];
    let data = []
    _.times(100, () => {
			let d = {
				order_id: _.uniqueId('order-'),
        tag_number: 'tag-1'
      }
      data.push(d);
      ps.push(order_tags.insert(d));
    })
    Promise.all(ps).then(() => {
      return order_tags.findIds('tag_number', 'tag-1', { descending: true, limit: 1 })
    }).then((rs) => {
			expect(rs.length).to.equal(1);
      done();
    })
    .catch(m => console.log(m));
	}  

	//Search
	@test("should search by order id")
	public testSearchTag(done) {
		let order_tags = OrderTagTest.order_tags;
		order_tags
			.find("tag_number", "123")
			.then(tags => {
				expect(tags.length).to.equal(1);
				done();
			})
			.catch(m => console.log(m));
	}

	//Delete
	@test("should delete tag")
	public testDeleteTag(done) {
		let order_tags = OrderTagTest.order_tags;
		let orderTagObj = {
			order_id: "2121",
			tag_number: 444
		};
		order_tags
			.insert(orderTagObj)
			.then(tag => {
				expect(tag.tag_number).to.equal(444);
				return order_tags.remove(tag);
			})
			.then(e => {
				return order_tags.get("2121");
			})
			.then(_.noop)
			.catch(c => {
				done();
			});
	}

	//Update
	@test("should update is_rack")
	public testUpdateTagNumber(done) {
		let order_tags = OrderTagTest.order_tags;
		let orderTagObj = {
			order_id: "535",
			tag_number: 555
		};
		order_tags
			.insert(orderTagObj)
			.then(tag => {
				expect(tag.tag_number).to.equal(555);
				let updatedTag = {
					is_rack: true
				};
				return order_tags.update(tag, updatedTag);
			})
			.then(updated_deliv => {
				expect(updated_deliv.is_rack).to.equal(true);
				done();
			})
			.catch(m => console.log(m));
	}
}
