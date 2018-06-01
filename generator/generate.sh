tsc generate-json.ts
node generate-json.js "../src/entities/Customer.ts" , "../src/entities/CustomerCard.ts" , "../src/entities/CustomerCredit.ts" , "../src/entities/CustomerCoupon.ts" , "../src/entities/Order.ts" , "../src/entities/OrderItem.ts" , "../src/entities/OrderTag.ts" , "../src/entities/OrderCharge.ts" , "../src/entities/Delivery.ts" , "../src/entities/Timesheet.ts" , "../src/entities/Timeline.ts" , "../src/entities/Product.ts" , "../src/entities/Purchase.ts" , "../src/entities/Task.ts" , "../src/entities/TaskData.ts" , "../src/entities/Message.ts"
node generate-table > ../src/entities/README.md
node generate-table.js

