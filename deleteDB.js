const fs = require('fs');
//
if (fs.existsSync('./sqlite/save.sqlite')) {
    //begin
    fs.unlink('./sqlite/save.sqlite' , (err) => {
        if (err) console.log(`Error:\n${err}`);
        else console.log(`Database File Deleted`)
    })
    //end
} else {
    console.log(`There is No database to fix!!`)
}