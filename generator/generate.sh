tsc generate-json.ts
node generate-json.js "../src/entities/Customer.ts" , "../src/entities/CustomerCard.ts" , "../src/entities/Order.ts" , "../src/entities/OrderItem.ts" , "../src/entities/OrderTag.ts" , "../src/entities/OrderCharge.ts" , "../src/entities/Delivery.ts" , "../src/entities/Timesheet.ts"
node generate-table > ../src/entities/README.md
node generate-table.js

