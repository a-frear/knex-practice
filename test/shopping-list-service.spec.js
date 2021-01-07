require('dotenv').config();
const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service.js');

describe('shopping-list-service object', () => {
    let db;

    let testItems = [
        {
            id: 1,
            name: 'Apples',
            price: '0.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'
        },
        {
            id: 2,
            name: 'Pasta',
            price: '1.25',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 3,
            name: 'Oatmeal',
            price: '2.25',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        }
    ]

    // Prepare the database connection using the `db` variable available
    // in the scope of the primary `describe` block. This means `db`
    // will be available in all of our tests.
    before('setup db', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());
  
    after(() => db.destroy());

    describe('getAllItems()', () => {
        it('returns an empty array', () => {
          return ShoppingListService
            .getAllItems(db)
            .then(items => expect(items).to.eql([]));
        });
    })

    context('with data present', () => {
        beforeEach('insert test items', () =>
          db('shopping_list')
            .insert(testItems)
        );
        
        it('returns all test items', () => {
            return ShoppingListService
            .getAllItems(db)
            .then(items => expect(items).to.eql(testItems));
        });

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            const expectedItems = testItems.map(item => ({
              ...item,
              checked: false,
            }));
            return ShoppingListService.getAllItems(db)
              .then(actual => {
                expect(actual).to.eql(expectedItems);
              });
        });

          it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const idToGet = 3;
            const thirdItem = testItems[idToGet - 1];
            return ShoppingListService.getById(db, idToGet)
              .then(actual => {
                expect(actual).to.eql({
                  id: idToGet,
                  name: thirdItem.name,
                  date_added: thirdItem.date_added,
                  price: thirdItem.price,
                  category: thirdItem.category,
                  checked: false,
                });
              });
          });

          it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const idToDelete = 3;
            return ShoppingListService.deleteItem(db, idToDelete)
              .then(() => ShoppingListService.getAllItems(db))
              .then(allItems => {
                // copy the test items array without the removed item
                const expected = testItems
                  .filter(item => item.id !== idToDelete)
                  .map(item => ({
                    ...item,
                    checked: false,
                  }));
                expect(allItems).to.eql(expected);
              });
          });

          it(`updateItem() updates an item in the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
              name: 'updated title',
              price: '99.99',
              date_added: new Date(),
              checked: true,
            };
            const originalItem = testItems[idOfItemToUpdate - 1];
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
              .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
              .then(item => {
                expect(item).to.eql({
                  id: idOfItemToUpdate,
                  ...originalItem,
                  ...newItemData,
                });
              });
          });
    });
    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
          return ShoppingListService.getAllItems(db)
            .then(actual => {
              expect(actual).to.eql([]);
            });
        });
    
        it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
          const newItem = {
            name: 'Test new name name',
            price: '5.05',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'Lunch',
          };
          return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
              expect(actual).to.eql({
                id: 1,
                name: newItem.name,
                price: newItem.price,
                date_added: newItem.date_added,
                checked: newItem.checked,
                category: newItem.category,
              });
            });
        });
      });
    });