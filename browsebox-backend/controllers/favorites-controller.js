const favorites = require("../models/favorite");
const db = require("../util/datapool");


/**
*    Routes concerning actions such as favoriting an item, deleting a favorite or showing favorites
 */
exports.favoriteItem = (req, res, next) => {

    // userId maybe wrong
    let user_id = req.body.user_id;
    let sale_id = req.body.sale_id;

    // could hide the favorite button on the front end so users who arent
    // logged in cant favorite OR this is a check for it as well
    // could split into two seperate statements for better messages back to frontend
    // example "not logged in cant favorite" , "item cannot be located, might have been deleted"
    if(user_id === null || sale_id === null || user_id === '' || sale_id === '') {


        res.status(200).send("Unable to favorite item");

        //return back to the page of the request
        res.redirect('/');
    }

    //checks to see if they items asking to be favorited is already favorited.
    //redirects back to page request came from if already favorited.

    //could do this through the affectedRows === 1
    db.execute(
        'SELECT * from favorites where user_id = ? AND sale_id = ?',
        [user_id, sale_id], function (err, [result, fieldData]) {
            if( result.length > 0) {
                result.status(200).send("item already favorited");
                return;
                // res.redirect('/');
            } else {
                db.execute (
                    'INSERT INTO favorites(user_id, sale_id) VALUES (?, ?)',
                    [user_id, sale_id], function(err, [result, fieldData]) {
                        if(err){
                            console.log(err);
                        }
                        //could change to just  else {
                        if (result.affectedRows === 1) {
                            //may not need a message?
                            res.status(200).send("Item successfully favorited");
                            //return back to the page of the request
                            // res.redirect('/');
                        } else {
                            res.status(200).send("Item wasnt favorited");
                            // res.redirect('/');
                        }
                    });
            }
        });
}




/**
 *  Deletes a favorite from the favorites table
 *
 */
exports.deleteFavorite = (req, res, next) => {
    let user_id = req.body.user_id;
    let sale_id = req.body.sale_id;


    db.execute (

        'DELETE FROM favorites where user_id = ? AND sale_id = ?',
        [user_id, sale_id], function(err, result) {
            if(err) {
                console.log(err);
            }
            if(result.affectedRows === 1){
                //may not need the message back
                res.status(200).send("Removed Item as Favorite");

                res.redirect('/');
            }

        });

}