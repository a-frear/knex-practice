require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})


//Get all items that contain text
//A function that takes one parameter for searchTerm which will be a string
//The function will query shopping_list using Knex methods and select the rows which have a name that contains the searchTerm using a case insensitive match
function searchByItemName(searchTerm) {
    knexInstance    
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log('Search Term', { searchTerm })
            console.log(result)
        })

}

searchByItemName('eggs')

//Get all items paginated
//A function that will query the shopping_list and select the pageNumber page of rows paginated to 6 items per page
function paginateItems(page) {
    const limit = 6
    const offset = limit * (page - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(limit)
        .offset(offset)
        .then(result => {
            console.log('PAGINATE ITEMS', { page })
            console.log(result)
        })
}

paginateItems(2)

//Get all items added after date
//A function that takes one parameter for daysAgo which will be a number representing a number of days
//Query the shopping_list and select the rows which have a date_added that is greater than the daysAgo
function productsAddedDaysAgo(daysAgo) {
    knexInstance
      .select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
      )
      .then(results => {
        console.log('PRODUCTS ADDED DAYS AGO')
        console.log(results)
      })
  }
  
  productsAddedDaysAgo(5)

//Get the total cost for each category
//Function takes no parameters
//Select rows grouped by their category and show the total price for each category
function costPerCategory() {
    knexInstance
        .select('category')
        .from('shopping_list')
        .groupBy('category')
        .sum('price AS total')
        .then(result => {
            console.log(result)
        })
}
  
  costPerCategory()